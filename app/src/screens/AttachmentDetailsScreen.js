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
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

export default function AttachmentDetailsScreen({ route, navigation }) {
    const { file } = route.params;

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('attachments'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        setLanguage();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <View style={[styles.container, styles.padding20]}>
                <Image source={{ uri: file }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
            </View>
        </SafeAreaView>
    );
}
