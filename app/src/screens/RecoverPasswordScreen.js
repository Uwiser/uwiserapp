import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
    ImageBackground,
} from 'react-native';
import axios from 'axios';
import RoundedButton from '../components/RoundedButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

export default function RecoverPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [emailEmptyError, setEmailEmptyError] = useState(false);
    const [emailInvalidError, setEmailInvalidError] = useState(false);

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({ title: I18n.t('forgotPassword') })
        }

        setLanguage();
    }, []);

    const changePasswordHandler = async () => {
        setEmailEmptyError(false);
        setEmailInvalidError(false);

        if (email.length == 0) {
            setEmailEmptyError(true);
        } else {
            axios.post(`http://157.245.2.201:3456/api/uwiser/users/Email`,
                {
                    email: email
                }
            ).then((res) => {
                if (res.status == 200) {
                    navigation.navigate('Login');
                }
            }).catch(err => {
                console.log(err);
                setEmailInvalidError(true);
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView style={styles.backgroundWhite}>
                <View style={[styles.container, styles.containerCenter, styles.backgroundWhite, styles.paddingHorizontal20]}>
                    {/* <ImageBackground source={require('./assets/splash.png')} style={styles.backgroundImage} /> */}

                    <View style={styles.alignCenter}>
                        <View style={styles.imageBackgroundContainer}>
                            <ImageBackground source={require('../assets/images/password.png')} resizeMode={'contain'} style={styles.container} />
                        </View>

                        <Text style={[styles.fontBold, styles.marginBottom20, styles.fontLarge]}>{I18n.t('recoverPasswordMessage')}</Text>
                    </View>

                    <View style={styles.marginBottom20}>
                        <TextInput
                            placeholder={I18n.t('email')}
                            placeholderTextColor={'#c6c6c6'}
                            name={'email'}
                            value={email}
                            style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                            onChangeText={value => setEmail(value)} />
                        {emailEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        {emailInvalidError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('invalidEmail')}</Text>}
                    </View>

                    <View style={styles.containerRow}>
                        <RoundedButton title={I18n.t('send')} click={() => changePasswordHandler()} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
