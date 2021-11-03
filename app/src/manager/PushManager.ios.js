'use strict';

import LoginManager from './LoginManager';
import VoipPushNotification from 'react-native-voip-push-notification';

class PushManager {
    pushToken = '';

    constructor() {
        console.log('Push manager ios');
        VoipPushNotification.addEventListener('register', (token) => {
            this.pushToken = token;
        });

        VoipPushNotification.addEventListener('notification', (notification) => {
            console.log('PushManager: ios: push notification is received: ' + notification);

            if (VoipPushNotification.wakeupByPush) {
                VoipPushNotification.wakeupByPush = false;
            }
            LoginManager.getInstance().pushNotificationReceived(notification);
        });

        VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
            if (!events || !Array.isArray(events) || events.length < 1) {
                return;
            }
            for (let voipPushEvent of events) {
                let { name, data } = voipPushEvent;
                if (name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent) {
                    this.onVoipPushNotificationRegistered(data);
                } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
                    this.onVoipPushNotificationiReceived(data);
                }
            }
        });

        VoipPushNotification.registerVoipToken();
    }

    init() {
        console.log('PushManager init');
    }

    getPushToken() {
        return this.pushToken;
    }
}

const pushManager = new PushManager();
export default pushManager;
