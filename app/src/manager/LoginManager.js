'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Voximplant } from 'react-native-voximplant';
import * as RootNavigation from '../routes/routes';
import PushManager from './PushManager';
import CallManager from './CallManager';
import md5 from 'react-native-md5';
import firebase from 'react-native-firebase';

const handlersGlobal = {};

export default class LoginManager {
    static myInstance = null;
    client = null;
    displayName = 'usuario';
    fullUserName = 'usuario';
    username = 'usuario';
    myuser = '';
    password = '';

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new LoginManager();
        }
        return this.myInstance;
    }

    constructor() {
        this.client = Voximplant.getInstance();
        // Connection to the Voximplant Cloud is stayed alive on reloading of the app's
        // JavaScript code. Calling "disconnect" API here makes the SDK and app states
        // synchronized.
        PushManager.init();
        (async () => {
            try {
                this.client.disconnect();
            } catch (e) {

            }
        })();
        this.client.on(Voximplant.ClientEvents.ConnectionClosed, this._connectionClosed);
    }

    async loginWithPassword(user, password) {
        this.username = user;
        this.password = password;

        try {
            let state = await this.client.getClientState();
            if (state === Voximplant.ClientState.DISCONNECTED) {
                await this.client.connect();
            }

            if (state === Voximplant.ClientState.CONNECTING || state === Voximplant.ClientState.LOGGING_IN) {
                console.log('LoginManager: loginWithPassword: login is in progress');
                return;
            }

            let authResult = await this.client.login(user, password);
            await this._processLoginSuccess(authResult);
        } catch (e) {
            console.log('LoginManager: loginWithPassword ' + e.name + e.message);
            switch (e.name) {
                case Voximplant.ClientEvents.ConnectionFailed:
                    this._emit('onConnectionFailed', e.message);
                    break;
                case Voximplant.ClientEvents.AuthResult:
                    this._emit('onLoginFailed', e.code);
                    break;
            }
        }
    }

    async loginWithOneTimeKey(user, password) {
        this.fullUserName = user;
        this.myuser = user.split('@')[0];
        this.password = password;
        try {
            let state = await this.client.getClientState();
            if (state === Voximplant.ClientState.DISCONNECTED) {
                await this.client.connect();
            }
            if (state === Voximplant.ClientState.CONNECTING || state === Voximplant.ClientState.LOGGING_IN) {
                console.log('LoginManager: loginWithPassword: login is in progress');
                return;
            }
            await this.client.requestOneTimeLoginKey(user);
        } catch (e) {
            console.log('LoginManager: loginWithPassword ' + e.name);
            switch (e.name) {
                case Voximplant.ClientEvents.ConnectionFailed:
                    this._emit('onConnectionFailed', e.message);
                    break;
                case Voximplant.ClientEvents.AuthResult:
                    if (e.code === 302) {
                        let hash = md5.hex_md5(e.key + '|'
                            + md5.hex_md5(this.myuser + ':voximplant.com:'
                                + this.password));
                        try {
                            let authResult = await this.client.loginWithOneTimeKey(this.fullUserName, hash);
                            await this._processLoginSuccess(authResult);
                        } catch (e1) {
                            this._emit('onLoginFailed', e1.code);
                        }
                    }
                    break;
            }
        }
    }

    async loginWithToken() {
        try {
            let state = await this.client.getClientState();
            if (state === Voximplant.ClientState.DISCONNECTED) {
                await this.client.connect();
            }
            if (state !== Voximplant.ClientState.LOGGED_IN) {
                const username = await AsyncStorage.getItem('usernamevox');
                const accessToken = await AsyncStorage.getItem('accessToken');
                console.log('LoginManager: loginWithToken: user: ' + username + ', token: ' + accessToken);
                const authResult = await this.client.loginWithToken(username + '@uwiser.criatec.n2.voximplant.com', accessToken);
                await this._processLoginSuccess(authResult);
            }
        } catch (e) {
            console.log('LoginManager: loginWithToken: ' + e.name);
            if (e.name === Voximplant.ClientEvents.AuthResult) {
                console.log('LoginManager: loginWithToken: error code: ' + e.code);

                AsyncStorage.getItem('id').then(async (id) => {
                    if (id) {
                        const reference1 = firebase.database().ref(`/onlineUsers/${id}`);
                        reference1
                            .remove()
                            .then(() => console.log('On disconnect function configured.'));

                        const reference2 = firebase.database().ref(`/onlineInterpreters/${id}`);
                        reference2
                            .remove()
                            .then(() => console.log('On disconnect function configured.'));
                    }

                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('name');
                    await AsyncStorage.removeItem('age');
                    await AsyncStorage.removeItem('city');
                    await AsyncStorage.removeItem('cpf');
                    await AsyncStorage.removeItem('email');
                    await AsyncStorage.removeItem('id');
                    await AsyncStorage.removeItem('idvox');
                    await AsyncStorage.removeItem('phone');
                    await AsyncStorage.removeItem('description');
                    await AsyncStorage.removeItem('specialty');
                    await AsyncStorage.removeItem('user_type_id');
                    await AsyncStorage.removeItem('usernamevox');
                    await AsyncStorage.removeItem('credits');
                    await AsyncStorage.removeItem('balance');

                    this.logout();
                });

                RootNavigation.navigate('Main', {});
                console.log('Leaving...')
            }
        }
    }

    async logout() {
        this.unregisterPushToken();
        await this.client.disconnect();
        this._emit('onConnectionClosed');
    }

    registerPushToken() {
        this.client.registerPushNotificationsToken(PushManager.getPushToken());
    }

    unregisterPushToken() {
        this.client.unregisterPushNotificationsToken(PushManager.getPushToken());
    }

    pushNotificationReceived(notification) {
        (async () => {
            await this.loginWithToken();
            this.client.handlePushNotification(notification);
        })();
    }

    on(event, handler) {
        if (!handlersGlobal[event]) {
            handlersGlobal[event] = [];
        }
        handlersGlobal[event].push(handler);
    }

    off(event, handler) {
        if (handlersGlobal[event]) {
            handlersGlobal[event] = handlersGlobal[event].filter(v => v !== handler);
        }
    }

    _emit(event, ...args) {
        const handlers = handlersGlobal[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _connectionClosed = () => {
        this._emit('onConnectionClosed');
    };

    async _processLoginSuccess(authResult) {
        this.displayName = authResult.displayName;

        // save acceess and refresh token to default preferences to login using
        // access token on push notification, if the connection to Voximplant Cloud
        // is closed
        const loginTokens = authResult.tokens;
        if (loginTokens !== null) {
            await AsyncStorage.setItem('accessToken', loginTokens.accessToken);
            await AsyncStorage.setItem('refreshToken', loginTokens.refreshToken);
            await AsyncStorage.setItem('accessExpire', loginTokens.accessExpire.toString());
            await AsyncStorage.setItem('refreshExpire', loginTokens.refreshExpire.toString());
        } else {
            console.error('LoginSuccessful: login tokens are invalid');
        }
        this.registerPushToken();
        CallManager.getInstance().init();
        this._emit('onLoggedIn', authResult.displayName);
    }
}

const loginManagerGlobal = LoginManager.getInstance();
