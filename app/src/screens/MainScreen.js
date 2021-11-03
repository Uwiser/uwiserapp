import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import RoundedOutlinedButton from '../components/RoundedOutlinedButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';
import pickerSelectStyles from '../styles/pickerSelectStyles';

export default function MainScreen({ navigation }) {
    const [language, setLanguage] = useState(I18n.currentLocale());

    const onChangeLanguage = async (languageSelected) => {
        console.log(languageSelected)
        setLanguage(languageSelected);
        I18n.locale = languageSelected;

        await AsyncStorage.setItem('locale', languageSelected);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <View style={[styles.container, styles.containerCenter, styles.alignCenter, styles.backgroundWhite]}>
                <View style={styles.imageBackgroundContainer}>
                    <ImageBackground source={require('../assets/images/main.png')} resizeMode={'contain'} style={styles.container} />
                </View>

                <View style={styles.imageBackgroundContainerSmall}>
                    <ImageBackground source={require('../assets/images/logo.png')} resizeMode={'contain'} style={styles.container} />
                </View>

                <View style={styles.pickerSelectContainer}>
                    <RNPickerSelect
                        placeholder={{ label: I18n.t('selectLanguage'), value: null }}
                        value={language}
                        style={pickerSelectStyles}
                        onValueChange={(value) => onChangeLanguage(value)}
                        items={[
                            { label: '🇺🇸  ' + I18n.t('english'), value: 'en' },
                            { label: '🇪🇸  ' + I18n.t('spanish'), value: 'es' },
                            { label: '🇫🇷  ' + I18n.t('french'), value: 'fr' },
                            { label: '🇯🇵  ' + I18n.t('japanese'), value: 'ja' },
                            { label: '🇧🇷  ' + I18n.t('portuguese'), value: 'pt' },
                        ]}
                    />
                </View>
                <RoundedOutlinedButton title={I18n.t('next')} click={() => navigation.navigate('Login')} />
            </View>
        </SafeAreaView>
    );
}