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

const placeholder = require('../assets/images/placeholder_icon.png');

export default function AttachmentsInterpretersScreen({ route, navigation }) {
    const { interpreterId } = route.params;
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setFiles([]);
            getFiles();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('attachments'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        getFiles();
        setLanguage();
    }, []);

    const getFiles = async () => {
        const token = await AsyncStorage.getItem('token');

        axios.get(`http://157.245.2.201:3456/api/uwiser/files/interpreter/${interpreterId}`,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        ).then((res) => {
                console.log(res.data);
                setFiles(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const dateFormatter = (date) => {
        let format = new Date(date);
        return format.toLocaleDateString();
    }

    const timeFormatter = (date) => {
        let format = new Date(date);
        return format.toLocaleTimeString();
    }

    const renderItem = ({ item, index }) =>
        <TouchableOpacity style={index == files.length - 1 ? [styles.interpretersCard, styles.containerSpaceBetween, styles.padding20] : [styles.interpretersCard, styles.containerSpaceBetween, styles.separator, styles.padding20]} key={item.id} onPress={() => item.url != null && item.url != '' && navigation.navigate('AttachmentDetails', { file: item.url })}>
            <View style={[styles.container, styles.containerCenter]}>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{dateFormatter(item.created_at)}</Text>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{timeFormatter(item.created_at)}</Text>
            </View>
            <View style={[styles.marginRight20]}>
                <Image source={item.url == null || item.image == '' ? placeholder : { uri: item.url }} style={{ width: 100, height: 100, }} />
            </View>
        </TouchableOpacity>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <View style={[styles.container, styles.marginBottom20]}>
                <View style={[styles.paddingHorizontal20, styles.marginTop20]}>
                    <FlatList data={files}
                        contentContainerStyle={{ borderRadius: 10, overflow: 'hidden' }}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        style />
                </View>
            </View>
        </SafeAreaView>
    );
}
