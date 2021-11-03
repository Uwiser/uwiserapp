'use strict';

import React from 'react';
import {
    Text,
    View,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    PermissionsAndroid,
    TouchableOpacity,
    Image,
    BackHandler,
} from 'react-native';
import { Voximplant } from 'react-native-voximplant';
import CallManager from '../manager/CallManager';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/styles';
import COLOR_SCHEME from '../styles/ColorScheme';

const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
};

const fullStar = require('../assets/images/full_star_icon.png');
const emptyStar = require('../assets/images/empty_star_icon.png');

export default class CallScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = props.route.params;

        this.callTo = params ? params.callTo : null;
        this.callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.isIncoming = params ? params.isIncoming : false;
        this.callState = CALL_STATES.DISCONNECTED;
        this.interpreter = params ? params.interpreter : null;
        this.credits = params ? params.credits : null;

        this.state = {
            isAudioMuted: false,
            isVideoSent: this.isVideoCall,
            isKeypadVisible: false,
            localVideoStreamId: null,
            remoteVideoStreamId: null,
            audioDeviceSelectionVisible: false,
            audioDevices: [],
            callDuration: 0,
            callAnswered: false,
            modalVisible: false,
            audioDeviceIcon: 'hearing',
            currentAudioDevice: 'h',
            rating: 0,
            userType: 1,
            startTime: null,
            id: '',
            name: '',
        };

        this.call = CallManager.getInstance().getCallById(this.callId);

        console.log('CallScreen: ctr: callid: ' + this.callId + ', isVideoCall: ' + this.isVideoCall + ', isIncoming:  ' + this.isIncoming + ', callState: ' + this.callState);
    }

    backAction = () => {
        return true;
    };

    componentDidMount() {
        clearInterval(this.interval);

        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().on(eventName, this[callbackName]);
            }
        });

        const callSettings = {
            video: {
                sendVideo: this.isVideoCall,
                receiveVideo: this.isVideoCall,
            },
        };

        if (this.isIncoming) {
            this.call.answer(callSettings);
            this.setupListeners();
        } else {
            if (Platform.OS === 'ios') {
                callSettings.setupCallKit = true;
            }

            (async () => {
                this.call = await Voximplant.getInstance().call(this.callTo, callSettings);
                this.setupListeners();
                let callManager = CallManager.getInstance();
                callManager.addCall(this.call);
                if (callSettings.setupCallKit) {
                    callManager.startOutgoingCallViaCallKit(this.isVideoCall, this.callTo);
                }
            })();
        }

        this.callState = CALL_STATES.CONNECTING;

        (async () => {
            let currentAudioDevice = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
            this.setState({ currentAudioDevice: currentAudioDevice, userType: await AsyncStorage.getItem('user_type_id'), id: await AsyncStorage.getItem('id'), name: await AsyncStorage.getItem('name') })
        })();

        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
        console.log('CallScreen: componentWillUnmount ' + this.call.callId);
    }

    setupListeners() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
            if (this.isIncoming) {
                this.call.getEndpoints().forEach(endpoint => {
                    this._setupEndpointListeners(endpoint, true);
                });
            }
        }
    }

    removeListeners() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
        }
        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().off(eventName, this[callbackName]);
            }
        });
    }

    muteAudio() {
        console.log('CallScreen[' + this.callId + '] muteAudio: ' + !this.state.isAudioMuted);
        const isMuted = this.state.isAudioMuted;
        this.call.sendAudio(isMuted);
        this.setState({ isAudioMuted: !isMuted });
    }

    async sendVideo(doSend) {
        console.log('CallScreen[' + this.callId + '] sendVideo: ' + doSend);
        try {
            if (doSend && Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('CallScreen[' + this.callId + '] sendVideo: failed due to camera permission is not granted');
                    return;
                }
            }
            await this.call.sendVideo(doSend);
            this.setState({ isVideoSent: doSend });
        } catch (e) {
            console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    async hold(doHold) {
        console.log('CallScreen[' + this.callId + '] hold: ' + doHold);
        try {
            await this.call.hold(doHold);
        } catch (e) {
            console.warn('Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message);
        }
    }

    async receiveVideo() {
        console.log('CallScreen[' + this.callId + '] receiveVideo');
        try {
            await this.call.receiveVideo();
        } catch (e) {
            console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
        }
    }

    endCall() {
        console.log('CallScreen[' + this.callId + '] endCall');
        this.call.getEndpoints().forEach(endpoint => {
            this._setupEndpointListeners(endpoint, false);
        });
        this.call.hangup();
    }

    switchKeypad() {
        let isVisible = this.state.isKeypadVisible;
        this.setState({ isKeypadVisible: !isVisible });
    }

    async getAudioDevices() {
        console.log('CallScreen[' + this.callId + '] switchAudioDevice');
        let devices = await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
        this.setState({ audioDevices: devices });
    }

    selectAudioDevice(device) {
        console.log('CallScreen[' + this.callId + '] selectAudioDevice: ' + device);
        Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(device);
    }

    _keypadPressed(value) {
        console.log('CallScreen[' + this.callId + '] _keypadPressed(: ' + value);
        this.call.sendTone(value);
    }

    _onCallFailed = (event) => {
        console.log('Call failed: ' + event.reason);
        this.callState = CALL_STATES.DISCONNECTED;
        this.removeListeners();
        CallManager.getInstance().removeCall(this.call);
        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
        });

        if (this.state.userType == 2) {
            const reference = firebase.database().ref(`/busy/${this.state.id}`);
            reference
                .remove()
                .then(() => console.log('On disconnect function configured.'));
        }

        // if (event.reason == 'Decline') {
        this.props.navigation.goBack();
        // }
    };

    _onCallDisconnected = (event) => {
        console.log('CallScreen: _onCallDisconnected: ' + event.call.callId);
        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
        });
        this.removeListeners();
        CallManager.getInstance().removeCall(this.call);
        if (Platform.OS === 'android' && Platform.Version >= 26 && this.callState === CALL_STATES.CONNECTED) {
            (async () => {
                await VIForegroundService.stopService();
            })();
        }
        this.callState = CALL_STATES.DISCONNECTED;

        if (this.state.userType == 2) {
            const reference = firebase.database().ref(`/busy/${this.state.id}`);
            reference
                .remove()
                .then(() => console.log('On disconnect function configured.'));
        }

        clearInterval(this.interval);

        if (this.state.callAnswered && this.state.userType == 1) {
            this.handleBalance();
            this.setState({ modalVisible: true });
        } else {
            this.props.navigation.navigate('Interpreters');
        }
    };

    _onCallConnected = (event) => {
        console.log('CallScreen: _onCallConnected: ' + this.call.callId);
        this.callState = CALL_STATES.CONNECTED;
        this.setState({ callAnswered: true });

        this.interval = setInterval(
            async () => {
                this.setState((prevState) => ({ callDuration: prevState.callDuration + 1 }));

                if (this.credits != null && this.credits == this.state.callDuration) {
                    await AsyncStorage.setItem('credits', '0');
                    this.endCall();
                }
            },
            1000
        );

        if (this.state.userType == 2) {
            const reference = firebase.database().ref(`/busy/${this.state.id}`);
            reference.set(true).then(() => console.log('Online presence set'));
        }

        this.setState({ startTime: new Date() });

        if (Platform.OS === 'android' && Platform.Version >= 26) {
            const channelConfig = {
                id: 'ForegroundServiceChannel',
                name: 'In progress calls',
                description: 'Notify the call is in progress',
                enableVibration: true,
            };

            const notificationConfig = {
                channelId: 'ForegroundServiceChannel',
                id: 3456,
                title: 'Voximplant',
                text: 'Call in progress',
                icon: 'ic_vox_notification',
            };

            (async () => {
                await VIForegroundService.createNotificationChannel(channelConfig);
                await VIForegroundService.startService(notificationConfig);
            })();
        }
    };

    _onCallLocalVideoStreamAdded = (event) => {
        console.log('CallScreen: _onCallLocalVideoStreamAdded: ' + this.call.callId + ', video stream id: ' + event.videoStream.id);
        this.setState({ localVideoStreamId: event.videoStream.id });
    };

    _onCallLocalVideoStreamRemoved = (event) => {
        console.log('CallScreen: _onCallLocalVideoStreamRemoved: ' + this.call.callId);
        this.setState({ localVideoStreamId: null });
    };

    _onCallEndpointAdded = (event) => {
        console.log('CallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, true);
    };

    _onEndpointRemoteVideoStreamAdded = (event) => {
        console.log('CallScreen: _onEndpointRemoteVideoStreamAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id +
            ', video stream id: ' + event.videoStream.id);
        this.setState({ remoteVideoStreamId: event.videoStream.id });
    };

    _onEndpointRemoteVideoStreamRemoved = (event) => {
        console.log('CallScreen: _onEndpointRemoteVideoStreamRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id +
            ', video stream id: ' + event.videoStream.id);
        if (this.state.remoteVideoStreamId === event.videoStream.id) {
            this.setState({ remoteVideoStreamId: null });
        }
    };

    _onEndpointRemoved = (event) => {
        console.log('CallScreen: _onEndpointRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, false);
    };

    _onEndpointInfoUpdated = (event) => {
        console.log('CallScreen: _onEndpointInfoUpdated: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
    };

    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
            }
        });
    }

    _onAudioDeviceChanged = (event) => {
        console.log('CallScreen: _onAudioDeviceChanged:' + event.currentDevice);
        this.setState({ currentAudioDevice: event.currentDevice })
    };

    _onAudioDeviceListChanged = (event) => {
        (async () => {
            let device = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
            console.log(device);
        })();
        this.setState({ audioDevices: event.newDeviceList });
    };

    durationFormatter = (seconds) => {
        console.log(seconds)
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    handleBalance = async () => {
        let duration = Math.trunc(Math.abs(new Date() - this.state.startTime) / 1000);
        console.log('duration');
        console.log(duration);
        let callValue = Math.round(((duration / 60) * (50 * 0.6)) * 100) / 100;
        console.log(callValue);

        const token = await AsyncStorage.getItem('token');

        axios.post(`http://157.245.2.201:3456/api/uwiser/BalanceHistory`,
            {
                user_id: parseInt(this.state.id),
                interpreter_id: parseInt(this.interpreter.id),
                seconds: parseInt(duration),
                value: callValue,
                created: new Date().toISOString(),
                interpreter_name: this.interpreter.name,
                user_name: this.state.name,
                call_id: this.call.callId,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        ).then(async (res) => {
            console.log(res.data);
            let balance = parseFloat(await AsyncStorage.getItem('balance'));
            AsyncStorage.setItem('balance', (balance + callValue).toString());
        }).catch(err => {
            console.log('BalanceHistory: ', err);
        });
    }

    handleSetRating = async (rating) => {
        AsyncStorage.getItem('token').then(async (token) => {
            axios.post(`http://157.245.2.201:3456/api/uwiser/users/Assessment`,
                {
                    callId: 1,
                    userId: parseInt(this.state.id),
                    userIdTranslator: parseInt(this.interpreter.id),
                    description: '',
                    value: parseInt(rating),
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setTimeout(function () {
                        this.setState({ modalVisible: false });
                        this.props.navigation.goBack();
                    }.bind(this), 1000);
                }
            }).catch(err => {
                setTimeout(function () {
                    this.setState({ modalVisible: false });
                    this.props.navigation.goBack();
                }.bind(this), 1000);
                console.log(err);
            });
        });
    }

    clickStar1 = () => {
        this.setState({ rating: 1 });
        this.handleSetRating(1);
    }

    clickStar2 = () => {
        this.setState({ rating: 2 });
        this.handleSetRating(2);
    }

    clickStar3 = () => {
        this.setState({ rating: 3 });
        this.handleSetRating(3);
    }

    clickStar4 = () => {
        this.setState({ rating: 4 });
        this.handleSetRating(4);
    }

    clickStar5 = () => {
        this.setState({ rating: 5 });
        this.handleSetRating(5);
    }

    render() {
        // <View style={styles.videoPanel}>
        //     <Voximplant.VideoView style={styles.remotevideo} videoStreamId={this.state.remoteVideoStreamId}
        //         scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
        //     {this.state.isVideoSent ? (
        //         <Voximplant.VideoView style={styles.selfview} videoStreamId={this.state.localVideoStreamId}
        //             scaleType={Voximplant.RenderScaleType.SCALE_FIT} showOnTop={true} />
        //     ) : null}
        // </View>
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
                <LinearGradient colors={['#4ab1b9', '#ffffff']} style={[styles.container, styles.containerSpaceBetween, styles.alignCenter]}>
                    <View style={[styles.containerCenter, styles.alignCenter, styles.marginTop50]}>
                        <Image source={this.interpreter != null && this.interpreter.image != null && this.interpreter.image != '' ? { uri: this.interpreter.image } : require('../assets/images/placeholder_icon.png')} style={{ width: 140, height: 140, borderRadius: 70 }} />
                        <Text style={[styles.fontBold, styles.textColor, styles.marginTop20, styles.fontExtraLarge]}>{this.interpreter != null ? this.interpreter.name : 'Unknown'}</Text>
                    </View>
                    {this.callState == CALL_STATES.CONNECTED &&
                        <View style={[styles.containerCenter, styles.alignCenter]}>
                            <Text style={[styles.fontBold, styles.textColor, styles.marginTop50, styles.fontExtraLarge]}>Tempo de ligação: {this.durationFormatter(this.state.callDuration)}</Text>
                        </View>
                    }
                    <View style={[styles.containerCenter, styles.alignCenter]}>
                        <Text style={[styles.fontBold, styles.textWhite, styles.marginTop50, styles.fontExtraLarge]}>{this.callState}</Text>
                    </View>
                    <View style={[styles.containerCenter, styles.alignCenter, styles.marginTop50, styles.marginBottom20]}>
                        <TouchableOpacity onPress={() => this.endCall()}>
                            <Image source={require('../assets/images/hangup_icon.png')} style={{ width: 60, height: 60, }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.micButton}>
                        {this.state.isAudioMuted ?
                            <TouchableOpacity onPress={() => this.muteAudio()}>
                                <Image source={require('../assets/images/muted_icon.png')} style={{ width: 40, height: 40, }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.muteAudio()}>
                                <Image source={require('../assets/images/mic_icon.png')} style={{ width: 40, height: 40, }} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.speakerButton}>
                        {this.state.currentAudioDevice == 'Speaker' ?
                            <TouchableOpacity onPress={() => this.selectAudioDevice('hearing')}>
                                <Image source={require('../assets/images/speaker_icon.png')} style={{ width: 40, height: 40, tintColor: 'green' }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.selectAudioDevice('Speaker')}>
                                <Image source={require('../assets/images/speaker_icon.png')} style={{ width: 40, height: 40, tintColor: 'grey' }} />
                            </TouchableOpacity>
                        }
                    </View>
                </LinearGradient>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: !this.state.modalVisible });
                    }}
                >
                    <View style={[styles.container, styles.containerCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding40, styles.paddingHorizontal80]}>
                            {this.credits == this.state.callDuration &&
                                <Text style={[styles.fontMedium, styles.textRed, styles.marginBottom20]}>Seus créditos acabaram.</Text>
                            }
                            <Text style={styles.fontLarge}>Avalie seu intérprete!</Text>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginTop20]}>
                                <Image source={this.interpreter != null && this.interpreter.image != null && this.interpreter.image != '' ? { uri: this.interpreter.image } : require('../assets/images/placeholder_icon.png')} style={{ width: 140, height: 140, borderRadius: 70 }} />
                                <Text style={[styles.fontBold, styles.textColor, styles.marginTop10, styles.fontExtraLarge]}>{this.interpreter != null ? this.interpreter.name : 'Unknown'}</Text>
                            </View>
                            <View style={[styles.containerRow, styles.marginBottom20, styles.marginTop20]}>
                                <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight10]}>
                                    <TouchableOpacity onPress={() => this.clickStar1()}>
                                        {this.state.rating >= 1 ?
                                            <Image source={fullStar} style={{ width: 24, height: 24, }} />
                                            :
                                            <Image source={emptyStar} style={{ width: 24, height: 24, }} />
                                        }
                                    </TouchableOpacity>
                                    <Text style={[styles.textLight, styles.fontMedium, styles.marginTop5]}>1</Text>
                                </View>
                                <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight10]}>
                                    <TouchableOpacity onPress={() => this.clickStar2()}>
                                        {this.state.rating >= 2 ?
                                            <Image source={fullStar} style={{ width: 24, height: 24, }} />
                                            :
                                            <Image source={emptyStar} style={{ width: 24, height: 24, }} />
                                        }
                                    </TouchableOpacity>
                                    <Text style={[styles.textLight, styles.fontMedium, styles.marginTop5]}>2</Text>
                                </View>
                                <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight10]}>
                                    <TouchableOpacity onPress={() => this.clickStar3()}>
                                        {this.state.rating >= 3 ?
                                            <Image source={fullStar} style={{ width: 24, height: 24, }} />
                                            :
                                            <Image source={emptyStar} style={{ width: 24, height: 24, }} />
                                        }
                                    </TouchableOpacity>
                                    <Text style={[styles.textLight, styles.fontMedium, styles.marginTop5]}>3</Text>
                                </View>
                                <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight10]}>
                                    <TouchableOpacity onPress={() => this.clickStar4()}>
                                        {this.state.rating >= 4 ?
                                            <Image source={fullStar} style={{ width: 24, height: 24, }} />
                                            :
                                            <Image source={emptyStar} style={{ width: 24, height: 24, }} />
                                        }
                                    </TouchableOpacity>
                                    <Text style={[styles.textLight, styles.fontMedium, styles.marginTop5]}>4</Text>
                                </View>
                                <View style={[styles.containerCenter, styles.alignCenter]}>
                                    <TouchableOpacity onPress={() => this.clickStar5()}>
                                        {this.state.rating == 5 ?
                                            <Image source={fullStar} style={{ width: 24, height: 24, }} />
                                            :
                                            <Image source={emptyStar} style={{ width: 24, height: 24, }} />
                                        }
                                    </TouchableOpacity>
                                    <Text style={[styles.textLight, styles.fontMedium, styles.marginTop5]}>5</Text>
                                </View>
                            </View>
                            <Text onPress={() => { this.setState({ modalVisible: false }); this.props.navigation.goBack(); }} style={[styles.fontMedium, styles.textLink]}>Prefiro não avaliar</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}
