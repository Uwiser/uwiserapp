import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
    Image,
    View,
    DeviceEventEmitter,
    Modal,
    Text,
} from 'react-native';
import { Voximplant } from 'react-native-voximplant';
import { StripeProvider } from '@stripe/stripe-react-native';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import IncomingCall from 'react-native-incoming-call';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'react-native-firebase';

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/routes/routes';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AttachmentDetailsScreen from './src/screens/AttachmentDetailsScreen';
import AttachmentsScreen from './src/screens/AttachmentsScreen';
import AttachmentsInterpretersScreen from './src/screens/AttachmentsInterpretersScreen';
import AttachmentsUsersScreen from './src/screens/AttachmentsUsersScreen';
import CallDetailsScreen from './src/screens/CallDetailsScreen';
import CallsScreen from './src/screens/CallsScreen';
import CallScreen from './src/screens/CallScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import CreditsScreen from './src/screens/CreditsScreen';
import LoginScreen from './src/screens/LoginScreen';
import IncomingCallScreen from './src/screens/IncomingCallScreen';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecoverPasswordScreen from './src/screens/RecoverPasswordScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import InterpreterDetailsScreen from './src/screens/InterpreterDetailsScreen';
import InterpretersScreen from './src/screens/InterpretersScreen';

import LoginManager from './src/manager/LoginManager';

import I18n from './src/locales';
import styles from './src/styles/styles';

const splash = require('./src/assets/images/flaticon.png');
const callIcon = require('./src/assets/images/call_nav_icon.png');
const attachmentIcon = require('./src/assets/images/attachment_icon.png');
const interpretersIcon = require('./src/assets/images/interpreters_nav_icon.png');
const profileIcon = require('./src/assets/images/profile_nav_icon.png');
const creditIcon = require('./src/assets/images/credit_nav_icon.png');

const InterpreterStack = createStackNavigator();

function InterpreterStackScreen() {
    return (
        <InterpreterStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                ),
            }}>
            <InterpreterStack.Screen options={{ headerLeft: null }} name="Interpreters" component={InterpretersScreen} />
            <InterpreterStack.Screen options={{ headerBackTitleVisible: false }} name="InterpreterDetails" component={InterpreterDetailsScreen} />
        </InterpreterStack.Navigator>
    );
}

const CallStack = createStackNavigator();

function CallStackScreen() {
    return (
        <CallStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                ),
            }}>
            <CallStack.Screen options={{ headerLeft: null }} name="Calls" component={CallsScreen} />
            <CallStack.Screen options={{ headerBackTitleVisible: false }} name="CallDetails" component={CallDetailsScreen} />
        </CallStack.Navigator>
    );
}

const AttachmentStack = createStackNavigator();

function AttachmentStackScreen() {
    return (
        <AttachmentStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                ),
            }}>
            <AttachmentStack.Screen options={{ headerLeft: null }} name="Attachments" component={AttachmentsScreen} />
            <AttachmentStack.Screen options={{ headerBackTitleVisible: false }} name="AttachmentDetails" component={AttachmentDetailsScreen} />
            <AttachmentStack.Screen options={{ headerBackTitleVisible: false }} name="AttachmentsUsers" component={AttachmentsUsersScreen} />
            <AttachmentStack.Screen options={{ headerBackTitleVisible: false }} name="AttachmentsInterpreters" component={AttachmentsInterpretersScreen} />
        </AttachmentStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                ),
            }}>
            <ProfileStack.Screen options={{ headerLeft: null }} name="Profile" component={ProfileScreen} />
            <ProfileStack.Screen options={{ headerBackTitleVisible: false }} name="ChangePassword" component={ChangePasswordScreen} />
        </ProfileStack.Navigator>
    );
}

const CreditsStack = createStackNavigator();

function CreditsStackScreen() {
    return (
        <CreditsStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                ),
            }}>
            <CreditsStack.Screen options={{ headerLeft: null }} name="Credits" component={CreditsScreen} />
        </CreditsStack.Navigator>
    );
}

const BottomTabNavigator = createBottomTabNavigator();

function HomeStackScreen() {
    return (
        <BottomTabNavigator.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === I18n.t('interpreters')) {
                        return <Image source={interpretersIcon} style={{ width: 24, height: 24, tintColor: color }} />;
                    } else if (route.name === I18n.t('calls')) {
                        return <Image source={callIcon} style={{ width: 24, height: 24, tintColor: color }} />;
                    } else if (route.name === I18n.t('attachments')) {
                        return <Image source={attachmentIcon} style={{ width: 24, height: 24, tintColor: color }} />;
                    } else if (route.name === I18n.t('profile')) {
                        return <Image source={profileIcon} style={{ width: 24, height: 24, tintColor: color }} />;
                    } else {
                        return <Image source={creditIcon} style={{ width: 24, height: 24, tintColor: color }} />;
                    }
                },
            })}
            tabBarOptions={{
                activeTintColor: '#1E4B77',
                inactiveTintColor: 'gray',
            }}>
            <BottomTabNavigator.Screen name={I18n.t('interpreters')} component={InterpreterStackScreen} />
            <BottomTabNavigator.Screen name={I18n.t('calls')} component={CallStackScreen} />
            <BottomTabNavigator.Screen name={I18n.t('attachments')} component={AttachmentStackScreen} />
            <BottomTabNavigator.Screen name={I18n.t('profile')} component={ProfileStackScreen} />
            <BottomTabNavigator.Screen name={I18n.t('wallet')} component={CreditsStackScreen} />
        </BottomTabNavigator.Navigator>
    );
}

const Stack = createStackNavigator();

export default function App() {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(async () => {
        const id = await AsyncStorage.getItem('id');
        const userType = await AsyncStorage.getItem('user_type_id');

        async function isLogged() {
            AsyncStorage.getItem('token').then(async (token) => {
                setToken(token);
                setIsLoading(false);

                if (token != null && token != '') {
                    isLoggedVox();

                    if (userType == 1) {
                        const reference1 = firebase.database().ref(`/onlineUsers/${id}`);
                        reference1.set(true).then(() => console.log('Online presence set'));
                    }

                    if (userType == 2) {
                        const reference2 = firebase.database().ref(`/onlineInterpreters/${id}`);
                        reference2.set(true).then(() => console.log('Online presence set'));
                    }
                }
            });
        }

        async function isLoggedVox() {
            const client = Voximplant.getInstance();
            let state = await client.getClientState();

            if (state == Voximplant.ClientState.DISCONNECTED) {
                console.log(state)
                LoginManager.getInstance().loginWithToken();
            }
        }

        async function getLanguage() {
            AsyncStorage.getItem('locale').then((locale) => {
                if (locale) {
                    console.log(locale)
                    I18n.locale = locale;
                } else {
                    I18n.locale = I18n.currentLocale();
                }
            });
        }

        async function getPermission() {
            if (Platform.OS === 'android') {
                OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
                    console.log(status);
                    setModalVisible(status);
                });

                /** App open from killed state (headless mode) */
                const payload = await IncomingCall.getExtrasFromHeadlessMode();
                console.log('launchParameters', payload);
                if (payload) {
                    // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
                }

                /** App in foreground / background: listen to call events and determine what to do next */
                DeviceEventEmitter.addListener('endCall', payload => {
                    // End call action here
                    IncomingCall.dismiss();
                    IncomingCall.backToForeground();
                });

                DeviceEventEmitter.addListener('answerCall', payload => {
                    // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
                });
            }
        }

        getPermission();
        getLanguage();
        isLogged();
    }, []);

    console.log(token)
    if (isLoading) {
        return (
            <View style={[styles.backgroundWhite, styles.container, styles.containerCenter, styles.alignCenter]}>
                <Image source={splash} style={{ width: 300, height: 300 }} />
            </View>
        )
    } else {
        if (token == null || token == '') {
            return (
                <StripeProvider publishableKey={'pk_live_51ItBE6AFx70QXgMXM59T3qM6or72nKFATxkmmllpFeBikvmakKum1ZFikv63z1SwtEjvpkqQol9tYHyGS6TZcGr3007cHVYOtw'}>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator initialRouteName={'Main'}
                            screenOptions={{
                                headerTitleAlign: 'center',
                                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                                headerBackTitleVisible: false,
                                headerBackImage: () => (
                                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                                ),
                            }}
                        >
                            <Stack.Screen
                                name='Main'
                                component={MainScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='Login'
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name='Register'
                                component={RegisterScreen}
                            />
                            <Stack.Screen
                                name='RecoverPassword'
                                component={RecoverPasswordScreen}
                            />
                            <Stack.Screen
                                name='Home'
                                component={HomeStackScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='Call'
                                component={CallScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='IncomingCall'
                                component={IncomingCallScreen}
                                options={{ headerShown: false }}
                            />
                        </Stack.Navigator>
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(visible => !visible);
                            }}
                        >
                            <View style={[styles.container, styles.containerCenter, styles.alignCenter, styles.padding40, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                                <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding40]}>
                                    <View style={[styles.containerCenter, styles.alignCenter, styles.paddingBottom20, styles.separator]}>
                                        <View style={[styles.containerCenter, styles.backgroundGreen, styles.borderRound, styles.padding5]}>
                                            <Image source={require('./src/assets/images/lock_icon.png')} style={{ width: 50, height: 50 }} />
                                        </View>
                                        <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>Tenha uma experiência incrível!</Text>
                                        <Text style={[styles.fontLarge, styles.textCenter, styles.textLight]}>Para que você tenha uma experiência completa com nosso aplicativo, precisaremos acessar suas permissões. Ao aceitar, localize o aplicativo uwiser e habilite as permissões necessárias.</Text>
                                    </View>
                                    <Text onPress={() => { setModalVisible(false); OverlayPermissionModule.requestOverlayPermission(); }} style={[styles.fontExtraLarge, styles.textGreen, styles.fontBold, styles.marginTop20]}>Aceitar permissões</Text>
                                    <Text onPress={() => { setModalVisible(false); }} style={[styles.fontMedium, styles.textLight, styles.marginTop20]}>Recusar</Text>
                                </View>
                            </View>
                        </Modal>
                    </NavigationContainer>
                </StripeProvider>
            );
        } else {
            return (
                <StripeProvider publishableKey={'pk_live_51ItBE6AFx70QXgMXM59T3qM6or72nKFATxkmmllpFeBikvmakKum1ZFikv63z1SwtEjvpkqQol9tYHyGS6TZcGr3007cHVYOtw'}>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator initialRouteName={'Home'}
                            screenOptions={{
                                headerTitleAlign: 'center',
                                headerTitleStyle: { fontWeight: '600', color: '#1c4370', },
                                headerBackTitleVisible: false,
                                headerBackImage: () => (
                                    <Image source={require('./src/assets/images/back_icon.png')} style={{ height: 25, width: 25, }} />
                                ),
                            }}
                        >
                            <Stack.Screen
                                name='Main'
                                component={MainScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='Login'
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name='Register'
                                component={RegisterScreen}
                            />
                            <Stack.Screen
                                name='RecoverPassword'
                                component={RecoverPasswordScreen}
                            />
                            <Stack.Screen
                                name='Home'
                                component={HomeStackScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='Call'
                                component={CallScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='IncomingCall'
                                component={IncomingCallScreen}
                                options={{ headerShown: false }}
                            />
                        </Stack.Navigator>
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(visible => !visible);
                            }}
                        >
                            <View style={[styles.container, styles.containerCenter, styles.alignCenter, styles.padding40, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                                <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding40]}>
                                    <View style={[styles.containerCenter, styles.alignCenter, styles.paddingBottom20, styles.separator]}>
                                        <View style={[styles.containerCenter, styles.backgroundGreen, styles.borderRound, styles.padding5]}>
                                            <Image source={require('./src/assets/images/lock_icon.png')} style={{ width: 50, height: 50 }} />
                                        </View>
                                        <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>Tenha uma experiência incrível!</Text>
                                        <Text style={[styles.fontLarge, styles.textCenter, styles.textLight]}>Para que você tenha uma experiência completa com nosso aplicativo, precisaremos acessar suas permissões. Ao aceitar, localize o aplicativo uwiser e habilite as permissões necessárias.</Text>
                                    </View>
                                    <Text onPress={() => { setModalVisible(false); OverlayPermissionModule.requestOverlayPermission(); }} style={[styles.fontExtraLarge, styles.textGreen, styles.fontBold, styles.marginTop20]}>Aceitar permissões</Text>
                                    <Text onPress={() => { setModalVisible(false); }} style={[styles.fontMedium, styles.textLight, styles.marginTop20]}>Recusar</Text>
                                </View>
                            </View>
                        </Modal>
                    </NavigationContainer>
                </StripeProvider>
            );
        }
    }
}


