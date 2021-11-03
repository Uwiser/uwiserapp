import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

const searchIcon = require('../assets/images/search_icon.png');

export default function CallsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [callsAux, setCallsAux] = useState([]);
    const [calls, setCalls] = useState([]);
    const [userType, setUserType] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setCalls([]);
            setCallsAux([]);
            getCallsById();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('calls'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        getCallsById();
        setLanguage();
    }, []);

    const getCallsById = async () => {
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        const user_type_id = await AsyncStorage.getItem('user_type_id');
        setUserType(user_type_id);

        if (user_type_id == 1) {
            axios.get(`http://157.245.2.201:3456/api/uwiser/BalanceHistory/user/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setCalls(res.data);
                    setCallsAux(res.data);
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            axios.get(`http://157.245.2.201:3456/api/uwiser/BalanceHistory/interpreter/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setCalls(res.data);
                    setCallsAux(res.data);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const searchHandler = (value) => {
        setSearch(value);
        setCalls(callsAux.filter(call => call.remoteNumber.toLowerCase().includes(value.toLowerCase())));
    }

    const dateFormatter = (date) => {
        let dateString = new Date(date).toLocaleDateString();
        return dateString;
    }

    const renderItem = ({ item, index }) =>
        <TouchableOpacity key={item.id} style={index == calls.length - 1 ? [styles.interpretersCard, styles.containerSpaceBetween, styles.padding20] : [styles.interpretersCard, styles.containerSpaceBetween, styles.separator, styles.padding20]} onPress={() => navigation.navigate('CallDetails', { call: item, userType: userType })}>
            <Text style={[styles.fontBold, styles.fontLarge, styles.marginLeft20]}>{userType == 1 ? item.interpreter_name : item.user_name}</Text>
            <Text style={[styles.fontLarge, styles.marginRight20]}>{dateFormatter(item.created)}</Text>
        </TouchableOpacity>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <View style={[styles.container, styles.marginBottom50]}>
                <View style={[styles.padding20]}>
                    <View style={[styles.containerSpaceBetween, styles.containerRow, styles.alignCenter, styles.input, styles.boxShadow]}>
                        <TextInput
                            placeholder={I18n.t('searchTranslator')}
                            placeholderTextColor={'#c6c6c6'}
                            name={'search'}
                            value={search}
                            onChangeText={value => searchHandler(value)} />
                        <Image source={searchIcon} style={{
                            padding: 10,
                            margin: 5,
                            height: 20,
                            width: 20,
                        }} />
                    </View>
                </View>
                <View style={[styles.paddingHorizontal20, styles.marginBottom50]}>
                    <FlatList
                        data={calls}
                        contentContainerStyle={{ borderRadius: 10, overflow: 'hidden' }}
                        renderItem={renderItem}
                        keyExtractor={item => item.id} />
                </View>
            </View>
        </SafeAreaView>
    );
}
