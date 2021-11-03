import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    TextInput,
    Text,
    View,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../components/RoundedButton';
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

export default function ChangePasswordScreen({ route, navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPasswordEmptyError, setOldPasswordEmptyError] = useState(false);
    const [newPasswordEmptyError, setNewPasswordEmptyError] = useState(false);
    const [newPasswordLengthError, setNewPasswordLengthError] = useState(false);
    const [newPasswordConfirmationEmptyError, setNewPasswordConfirmationEmptyError] = useState(false);
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [changeError, setChangeError] = useState(false);

    const inputElement = useRef(null);
    const inputElement2 = useRef(null);
    const inputElement3 = useRef(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            inputElement.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
            inputElement2.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
            inputElement3.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
        }

        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('changePassword'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        setLanguage();
    }, []);

    const updateHandler = async () => {
        setOldPasswordEmptyError(false);
        setNewPasswordEmptyError(false);
        setNewPasswordLengthError(false);
        setNewPasswordConfirmationEmptyError(false);
        setNewPasswordConfirmationError(false);
        setChangeSuccess(false);
        setChangeError(false);

        if (oldPassword.length == 0) {
            setOldPasswordEmptyError(true);
        } else if (newPassword.length == 0) {
            setNewPasswordEmptyError(true);
        } else if (newPassword.length < 8) {
            setNewPasswordLengthError(true);
        } else if (confirmNewPassword.length == 0) {
            setNewPasswordConfirmationEmptyError(true);
        } else if (newPassword != confirmNewPassword) {
            setNewPasswordConfirmationError(true);
        } else {
            const token = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('id');

            axios.put(`http://157.245.2.201:3456/api/uwiser/users/password`,
                {
                    id: parseInt(id),
                    oldPassword: oldPassword,
                    newPassword: newPassword
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setChangeSuccess(true);
                }
            }).catch(err => {
                console.log(err);
                setChangeError(true);
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView>
                <View style={[styles.container, styles.padding20]}>
                    <View style={[styles.container, styles.padding20, styles.containerCenter, styles.backgroundWhite, styles.border10, styles.boxShadow]}>
                        <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>{I18n.t('password')}</Text>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('currentPassword')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'oldPassword'}
                                value={oldPassword}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setOldPassword(value)}
                                secureTextEntry={true}
                                ref={inputElement} />
                            {oldPasswordEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        </View>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('newPassword')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'newPassword'}
                                value={newPassword}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setNewPassword(value)}
                                secureTextEntry={true}
                                ref={inputElement2} />
                            {newPasswordEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {newPasswordLengthError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>A senha deve possuir ao menos 8 caracteres.</Text>}
                        </View>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('confirmNewPassword')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'confirmNewPassword'}
                                value={confirmNewPassword}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setConfirmNewPassword(value)}
                                secureTextEntry={true}
                                ref={inputElement3} />
                            {newPasswordConfirmationEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {newPasswordConfirmationError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('invalidPasswordConfirmation')}</Text>}
                        </View>
                        <View style={styles.alignCenter}>
                            {changeSuccess && <Text style={[styles.textGreen, styles.fontSmall]}>Senha alterada com sucesso.</Text>}
                            {changeError && <Text style={[styles.textRed, styles.fontSmall]}>{I18n.t('invalidCurrentPassword')}</Text>}
                            <View style={styles.containerRow}>
                                <RoundedButton title={I18n.t('update')} click={() => updateHandler()} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
