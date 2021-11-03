'use strict';

import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    PermissionsAndroid,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import CallManager from '../manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/styles';

export default class IncomingCallScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = props.route.params;

        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);

        this.state = {
            image: null,
        };
    }

    componentDidMount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            this.call = null;
        }
    }

    async answerCall(withVideo) {
        try {
            if (Platform.OS === 'android') {
                let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                if (withVideo) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                }
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                if (recordAudioGranted) {
                    if (withVideo && !cameraGranted) {
                        console.warn('IncomingCallScreen: answerCall: camera permission is not granted');
                        return;
                    }
                } else {
                    console.warn('IncomingCallScreen: answerCall: record audio permission is not granted');
                    return;
                }
            }
        } catch (e) {
            console.warn('IncomingCallScreen: asnwerCall:' + e);
            return;
        }
        this.props.navigation.navigate('Call', {
            callId: this.call.callId,
            isVideo: withVideo,
            isIncoming: true,
            interpreter: {
                name: this.displayName,
                image: this.state.image,
            }
        });
    }

    declineCall() {
        this.call.decline();
    }

    _onCallDisconnected = (event) => {
        CallManager.getInstance().removeCall(event.call);
        this.props.navigation.navigate('Interpreters');
    };

    _onCallEndpointAdded = (event) => {
        console.log('IncomingCallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);

        // const token = await AsyncStorage.getItem('token');
        // axios.get(`http://157.245.2.201:3456/api/uwiser/users/usernamevox/${event.endpoint.userName}`,
        //     {
        //         headers: {
        //             Authorization: 'Bearer ' + token
        //         }
        //     }
        // ).then((res) => {
        //     if (res.status == 200) {
        //         console.log(res.data);
        //         this.setState({ image: res.data.image });
        //     }
        // }).catch(err => {
        //     console.log(err);
        // });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient colors={['#4ab1b9', '#ffffff']} style={[styles.container, styles.containerSpaceBetween]}>
                    <View style={[styles.containerCenter, styles.alignCenter, styles.marginTop50]}>
                        <Text style={[styles.fontBold, styles.fontExtraLarge, styles.marginBottom20]}>Recebendo ligação de:</Text>
                        <Image source={this.state.image != null && this.state.image != '' ? { uri: this.state.image } : require('../assets/images/placeholder_icon.png')} style={{ width: 140, height: 140, borderRadius: 70 }} />
                        <Text style={[styles.fontBold, styles.textColor, styles.marginTop20, styles.fontExtraLarge]}>{this.state.displayName}</Text>
                    </View>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.declineButton} onPress={() => this.declineCall()}>
                            <Image source={require('../assets/images/hangup_icon.png')} style={{ width: 60, height: 60, }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptButton} onPress={() => this.answerCall(false)}>
                            <Image source={require('../assets/images/accept_icon.png')} style={{ width: 60, height: 60, }} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}
