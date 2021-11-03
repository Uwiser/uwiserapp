import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginManager from '../manager/LoginManager';
import I18n from '../locales';
import styles from '../styles/styles';
import firebase from 'react-native-firebase';

export default function LogoutButton({ navigation }) {
    const logout = () => {
        (async () => {
            AsyncStorage.getItem('id').then(async (id) => {
                const reference1 = firebase.database().ref(`/onlineUsers/${id}`);
                reference1
                    .remove()
                    .then(() => console.log('On disconnect function configured.'));

                const reference2 = firebase.database().ref(`/onlineInterpreters/${id}`);
                reference2
                    .remove()
                    .then(() => console.log('On disconnect function configured.'));

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

                await LoginManager.getInstance().logout();
            });
        })();

        navigation.reset({ index: 0, routes: [{ name: 'Main' }], });
        console.log('Leaving...')
    }

    return (
        <TouchableOpacity style={styles.marginRight20} onPress={() => logout()}>
            <Text style={styles.textColor}>{I18n.t('logout')}</Text>
        </TouchableOpacity>
    )
}
