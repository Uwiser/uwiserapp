import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

const placeholder = require('../assets/images/placeholder_icon.png');

export default function CallDetailsScreen({ route, navigation }) {
    const { call, userType } = route.params;
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('callDetails'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        async function getUser() {
            const token = await AsyncStorage.getItem('token');

            axios.get(`http://157.245.2.201:3456/api/uwiser/users/${userType == 1 ? call.user_id : call.interpreter_id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    setName(res.data.name);
                    setProfileImage(res.data.image);
                }
            }).catch(err => {
                console.log(err);
            });
        }

        getUser();
        setLanguage();
    }, []);

    const dateFormatter = (date) => {
        let format = new Date(date);
        return format.toLocaleDateString();
    }

    const timeFormatter = (date) => {
        let format = new Date(date);
        return format.toLocaleTimeString();
    }

    const durationFormatter = (seconds) => {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView>
                <View style={[styles.container, styles.padding20]}>
                    <View style={[styles.alignCenter, styles.padding20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10]}>
                        <Image source={profileImage == null || profileImage == '' ? placeholder : { uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        <Text style={[styles.fontBold, styles.marginTop20, styles.fontLarge]}>{name}</Text>
                    </View>
                    <View style={[styles.marginTop20, styles.padding20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10]}>
                        <View style={[styles.containerRow, styles.containerSpaceBetween]}>
                            <Text style={[styles.fontBold, styles.fontLarge, styles.textColorLight]}>{dateFormatter(call.startTime)}</Text>
                            <Text style={[styles.fontBold, styles.fontLarge, styles.textColorLight]}>{timeFormatter(call.startTime)}</Text>
                        </View>
                        <View style={[styles.containerRow, styles.containerSpaceBetween, styles.marginTop20]}>
                            <Text style={[styles.fontLarge, styles.textLight]}>{I18n.t('minutePrice')}</Text>
                            <Text style={[styles.fontLarge, styles.textLight]}>¥ 50</Text>
                        </View>
                        <View style={[styles.containerRow, styles.containerSpaceBetween, styles.marginTop10]}>
                            <Text style={[styles.fontLarge, styles.textLight]}>{I18n.t('minutesSpoken')}</Text>
                            <Text style={[styles.fontLarge, styles.textLight]}>{durationFormatter(call.seconds)}</Text>
                        </View>
                        <View style={[styles.containerRow, styles.containerSpaceBetween, styles.marginTop20, styles.marginBottom10]}>
                            <Text style={[styles.fontBold, styles.fontLarge]}>{I18n.t('totalCost')}</Text>
                            <Text style={[styles.fontBold, styles.fontLarge]}>¥ {Math.trunc((call.seconds * 50 / 60) * 100) / 100}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
