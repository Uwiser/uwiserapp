import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    Alert,
    Modal,
} from 'react-native';
import firebase from 'react-native-firebase';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

const placeholder = require('../assets/images/placeholder_icon.png');
const fullStar = require('../assets/images/full_star_icon.png');
const halfStar = require('../assets/images/half_star_icon.png');
const emptyStar = require('../assets/images/empty_star_icon.png');
const attachment = require('../assets/images/attachment_icon.png');

export default function InterpreterDetailsScreen({ route, navigation }) {
    const { interpreter, rating } = route.params;
    const [userType, setUserType] = useState(2);
    const [credits, setCredits] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [onlineInterpreters, setOnlineInterpreters] = useState({});

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('credits').then((credits) => {
                setCredits(credits);
                console.log(credits)
            });
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        firebase.database()
            .ref('/onlineInterpreters')
            .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
                if (snapshot.val() != null) {
                    setOnlineInterpreters(snapshot.val());
                } else {
                    setOnlineInterpreters({});
                }
            });

        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('details'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        function getUserType() {
            AsyncStorage.getItem('user_type_id').then((userType) => {
                setUserType(userType);
            });

            AsyncStorage.getItem('credits').then((credits) => {
                setCredits(credits);
            });
        }

        getUserType();
        setLanguage();
    }, []);

    const makeCall = async (user) => {
        let isVideoCall = false;

        if (credits == 0) {
            Alert.alert(
                I18n.t('insufficientFunds'),
                I18n.t('insufficientFundsMessage'),
                [
                    {
                        text: I18n.t('buyCredits'),
                        onPress: () => navigation.navigate(I18n.t('wallet')),
                        style: 'cancel'
                    },
                    { text: I18n.t('ok'), onPress: () => console.log('OK Pressed') }
                ]
            );
        } else {
            console.log('MainScreen: make call: ' + user + ', isVideo:' + false);
            try {
                if (Platform.OS === 'android') {
                    let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                    if (isVideoCall) {
                        permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                    }
                    const granted = await PermissionsAndroid.requestMultiple(permissions);
                    const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                    const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                    if (recordAudioGranted) {
                        if (isVideoCall && !cameraGranted) {
                            console.warn('MainScreen: makeCall: camera permission is not granted');
                            return;
                        }
                    } else {
                        console.warn('MainScreen: makeCall: record audio permission is not granted');
                        return;
                    }
                }

                console.log('Iniciando ligacao para ', user);
                navigation.navigate('Call', {
                    callId: null,
                    isVideo: isVideoCall,
                    isIncoming: false,
                    callTo: user + '@uwiser.criatec.n2.voximplant.com',
                    interpreter: interpreter,
                    credits: credits,
                });
            } catch (e) {
                console.warn('MainScreen: makeCall failed: ' + e);
            }
        }
    }

    const handleAttachment = async (base64) => {
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        var URL = `https://api.imgbb.com/1/upload?key=8ae6fb5043b2cd29437b4a8d955c1ae3`;

        var data = new FormData();
        data.append('image', base64);

        console.log('result.data1')
        axios.post(URL, data,
            {
                headers: {
                    Accept: 'application/json',
                }
            })
            .then(async (res) => {
                console.log('result.data2')
                axios.post('http://157.245.2.201:3456/api/uwiser/files',
                    {
                        user_id: parseInt(id),
                        interpreter_id: parseInt(interpreter.id),
                        url: res.data.data.url,
                        created_at: new Date().toISOString(),
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                ).then((result) => {
                    console.log('result.data3')
                    console.log(result.data)
                    setModalVisible(true);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
    }

    const handleFile = () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        }, (data) => {
            if (!data.didCancel) {
                handleAttachment(data.base64);
            }
        })
    }

    const ageFormatter = (date) => {
        let birthday = new Date(date);
        let today = new Date();

        let age = today.getUTCFullYear() - birthday.getUTCFullYear() - 1;

        if (birthday.getUTCMonth() > (today.getUTCMonth() + 1) || (birthday.getUTCMonth() == (today.getUTCMonth() + 1) && birthday.getUTCDate() >= today.getUTCDate())) {
            age++;
        }

        return age;
    }

    const getLanguages = (languages) => {
        return (languages.toLowerCase().includes('english') ? '\n' + I18n.t('english') : '') +
            (languages.toLowerCase().includes('french') ? '\n' + I18n.t('french') : '') +
            (languages.toLowerCase().includes('japanese') ? '\n' + I18n.t('japanese') : '') +
            (languages.toLowerCase().includes('portuguese') ? '\n' + I18n.t('portuguese') : '') +
            (languages.toLowerCase().includes('spanish') ? '\n' + I18n.t('spanish') : '');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView>
                <View style={[styles.container, styles.padding20]}>
                    <View style={[styles.alignCenter, styles.padding20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10]}>
                        <Image source={interpreter.image == null ? placeholder : { uri: interpreter.image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        <Text style={[styles.fontBold, styles.marginTop20, styles.fontLarge]}>{interpreter.name}</Text>
                        <View style={[styles.containerRow, styles.marginTop10]}>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight5]}>
                                {rating == 0 ?
                                    <Image source={emptyStar} style={{ width: 16, height: 16, }} />
                                    :
                                    rating > 0 && rating < 1 ?
                                        <Image source={halfStar} style={{ width: 16, height: 16, }} />
                                        :
                                        <Image source={fullStar} style={{ width: 16, height: 16, }} />
                                }
                            </View>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight5]}>
                                {rating <= 1 ?
                                    <Image source={emptyStar} style={{ width: 16, height: 16, }} />
                                    :
                                    rating > 1 && rating < 2 ?
                                        <Image source={halfStar} style={{ width: 16, height: 16, }} />
                                        :
                                        <Image source={fullStar} style={{ width: 16, height: 16, }} />
                                }
                            </View>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight5]}>
                                {rating <= 2 ?
                                    <Image source={emptyStar} style={{ width: 16, height: 16, }} />
                                    :
                                    rating > 2 && rating < 3 ?
                                        <Image source={halfStar} style={{ width: 16, height: 16, }} />
                                        :
                                        <Image source={fullStar} style={{ width: 16, height: 16, }} />
                                }
                            </View>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight5]}>
                                {rating <= 3 ?
                                    <Image source={emptyStar} style={{ width: 16, height: 16, }} />
                                    :
                                    rating > 3 && rating < 4 ?
                                        <Image source={halfStar} style={{ width: 16, height: 16, }} />
                                        :
                                        <Image source={fullStar} style={{ width: 16, height: 16, }} />
                                }
                            </View>
                            <View style={[styles.containerCenter, styles.alignCenter, styles.marginRight5]}>
                                {rating <= 4 ?
                                    <Image source={emptyStar} style={{ width: 16, height: 16, }} />
                                    :
                                    rating > 5 && rating < 5 ?
                                        <Image source={halfStar} style={{ width: 16, height: 16, }} />
                                        :
                                        <Image source={fullStar} style={{ width: 16, height: 16, }} />
                                }
                            </View>
                            <Text style={[styles.fontLarge, rating > 0 ? styles.textYellow : styles.textLight]}>{rating}</Text>
                        </View>
                        {userType == 1 &&
                            <TouchableOpacity style={[styles.containerRow, styles.marginTop10, styles.alignCenter]} onPress={handleFile}>
                                <Text style={[styles.marginRight5, styles.textLink]}>{I18n.t('uploadFile')}</Text>
                                <Image source={attachment} style={{ width: 14, height: 14, tintColor: '#21a6f3' }} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={[styles.padding20, styles.marginTop20, styles.boxShadow, styles.interpreterDetailsPriceCard, styles.border10]}>
                        <Text style={[styles.fontBold, styles.textWhite, styles.fontLarge]}>{I18n.t('minutePrice')}</Text>
                        <Text style={[styles.fontBold, styles.textWhite, styles.fontLarge]}>¥ 50</Text>
                    </View>
                    <View style={[styles.marginTop20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10]}>
                        <View style={[styles.separator, styles.padding20]}>
                            <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{I18n.t('languages')}</Text>
                            <Text style={styles.fontLarge}>{getLanguages(interpreter.languages)}</Text>
                        </View>
                        <View style={[styles.separator, styles.padding20]}>
                            <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{I18n.t('specialty')}</Text>
                            <Text style={styles.fontLarge}>{I18n.t(interpreter.specialty)}</Text>
                        </View>
                        <View style={[styles.separator, styles.padding20]}>
                            <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{I18n.t('city')}</Text>
                            <Text style={styles.fontLarge}>{interpreter.city}</Text>
                        </View>
                        <View style={[styles.separator, styles.padding20]}>
                            <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{I18n.t('age')}</Text>
                            <Text style={styles.fontLarge}>{ageFormatter(interpreter.age)}</Text>
                        </View>
                        <View style={styles.padding20}>
                            <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{I18n.t('about')}</Text>
                            <Text style={styles.fontLarge}>{interpreter[`description_${I18n.t('lang')}`]}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {userType != 2 && onlineInterpreters != {} && onlineInterpreters[interpreter.id.toString()] == true &&
                <TouchableOpacity onPress={() => makeCall(interpreter.usernamevox)} style={styles.callButton}>
                    <Image source={require('../assets/images/call_icon.png')} style={{ width: 90, height: 90, zIndex: 2 }} />
                </TouchableOpacity>
            }
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(visible => !visible);
                }}>
                <View style={[styles.container, styles.containerCenter, styles.alignCenter, styles.padding40, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding40]}>
                        <View style={[styles.containerCenter, styles.alignCenter, styles.paddingBottom20, styles.separator]}>
                            <View style={[styles.containerCenter, styles.backgroundGreen, styles.borderRound, styles.padding10]}>
                                <Image source={require('../assets/images/check_icon.png')} style={{ width: 40, height: 40 }} />
                            </View>
                            <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>{I18n.t('fileSended')}</Text>
                        </View>
                        <View style={[styles.containerRow, styles.alignCenter, styles.containerSpaceBetween]}>
                            <Text onPress={() => { setModalVisible(false); navigation.navigate(I18n.t('attachments')); }} style={[styles.fontLarge, styles.textLight, styles.marginTop20, styles.marginRight20]}>{I18n.t('attachments')}</Text>
                            <Text onPress={() => setModalVisible(false)} style={[styles.fontLarge, styles.textGreen, styles.fontBold, styles.marginTop20, styles.marginLeft20]}>{I18n.t('ok')}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}
