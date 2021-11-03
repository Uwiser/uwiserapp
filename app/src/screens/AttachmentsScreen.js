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

export default function AttachmentsScreen({ route, navigation }) {
    const [files, setFiles] = useState([]);
    const [userType, setUserType] = useState();

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
        const id = await AsyncStorage.getItem('id');
        const user_type_id = await AsyncStorage.getItem('user_type_id');
        setUserType(user_type_id);

        if (user_type_id == 2) {
            axios.get(`http://157.245.2.201:3456/api/uwiser/files/userbyinterpreter/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setFiles(res.data);
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            axios.get(`http://157.245.2.201:3456/api/uwiser/files/interpreterbyuser/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setFiles(res.data);
                }
            }).catch(err => {
                console.log(err);
            });
        }
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
        <TouchableOpacity style={index == files.length - 1 ? [styles.interpretersCard, styles.containerSpaceBetween, styles.padding20] : [styles.interpretersCard, styles.containerSpaceBetween, styles.separator, styles.padding20]} key={item.id} onPress={() => navigation.navigate('AttachmentsUsers', { userId: item.user_id })}>
            <View style={[styles.marginHorizontal10]}>
                <Image source={item.interpreterObject.image == null || item.image == '' ? placeholder : { uri: item.interpreterObject.image }} style={{ width: 90, height: 90, borderRadius: 50, }} />
            </View>
            <View style={[styles.container]}>
                <Text style={[styles.fontBold, styles.fontLarge, styles.marginLeft20]}>{item.interpreterObject.name}</Text>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{dateFormatter(item.created_at)}</Text>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{timeFormatter(item.created_at)}</Text>
            </View>
        </TouchableOpacity>;

    const renderItemUser = ({ item, index }) =>
        <TouchableOpacity style={index == files.length - 1 ? [styles.interpretersCard, styles.containerSpaceBetween, styles.padding20] : [styles.interpretersCard, styles.containerSpaceBetween, styles.separator, styles.padding20]} key={item.id} onPress={() => navigation.navigate('AttachmentsInterpreters', { interpreterId: item.interpreter_id })}>
            <View style={[styles.marginHorizontal10]}>
                <Image source={item.userObject.image == null || item.image == '' ? placeholder : { uri: item.userObject.image }} style={{ width: 90, height: 90, borderRadius: 50, }} />
            </View>
            <View style={[styles.container]}>
                <Text style={[styles.fontBold, styles.fontLarge, styles.marginLeft20]}>{item.userObject.name}</Text>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{dateFormatter(item.created_at)}</Text>
                <Text style={[styles.fontLarge, styles.marginLeft20, styles.textLight]}>{timeFormatter(item.created_at)}</Text>
            </View>
        </TouchableOpacity>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            {userType == 2 ?
                <View style={[styles.container, styles.marginBottom50]}>
                    {files != null && files.length > 0 ?
                        <View style={[styles.paddingHorizontal20, styles.marginBottom50, styles.marginTop20]}>
                            <FlatList data={files}
                                contentContainerStyle={{ borderRadius: 10, overflow: 'hidden' }}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                style />
                        </View>
                        :
                        <View style={[styles.padding20, styles.containerCenter, styles.alignCenter]}>
                            <Text style={styles.textLight}>No files.</Text>
                        </View>
                    }
                </View>
                :
                <View style={[styles.container, styles.marginBottom50]}>
                    {files != null && files.length > 0 ?
                        <View style={[styles.paddingHorizontal20, styles.marginBottom50, styles.marginTop20]}>
                            <FlatList data={files}
                                contentContainerStyle={{ borderRadius: 10, overflow: 'hidden' }}
                                renderItem={renderItemUser}
                                keyExtractor={item => item.id}
                                style />
                        </View>
                        :
                        <View style={[styles.padding20, styles.containerCenter, styles.alignCenter]}>
                            <Text style={styles.textLight}>No files.</Text>
                        </View>
                    }
                </View>
            }
        </SafeAreaView>
    );
}
