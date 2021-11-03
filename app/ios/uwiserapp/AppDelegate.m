#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import "RNCallKeep.h"
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"
#import "VIClientModule.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"uwiserapp"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
  // restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler
{
  return [RNCallKeep application:application
            continueUserActivity:userActivity
              restorationHandler:restorationHandler];
}

// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
// - (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type {
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}

// --- Handle incoming pushes (for ios <= 10)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

// Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  NSString *uuid = [VIClientModule uuidForPushNotification:payload.dictionaryPayload].UUIDString;
  
  // Process the received push
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];


  if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
    NSLog(@"AppDelegate: didReceiveIncomingPush: application is in active state");
  }

  if ([RNCallKeep isCallActive:uuid]){
    NSLog(@"AppDelegate: didReceiveIncomingPush: call is already been reported");
  }

  if ([UIApplication sharedApplication].applicationState != UIApplicationStateActive && ![RNCallKeep isCallActive:uuid]) {
    NSLog(@"AppDelegate: didReceiveIncomingPush: report new incoming call to CallKit");
    NSString *callerName = [[payload.dictionaryPayload valueForKey:@"voximplant"] valueForKey:@"display_name"];
    [RNCallKeep reportNewIncomingCall:uuid
                               handle:callerName
                           handleType:@"generic"
                             hasVideo:YES
                  localizedCallerName:callerName
                      supportsHolding:YES
                         supportsDTMF:YES
                     supportsGrouping:YES
                   supportsUngrouping:YES
                          fromPushKit:YES
                              payload:payload.dictionaryPayload
                withCompletionHandler:completion];
  }
  completion();
}

@end
