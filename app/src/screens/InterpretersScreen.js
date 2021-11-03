import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import firebase from 'react-native-firebase';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import LogoutButton from '../components/LogoutButton';
import CheckBox from '@react-native-community/checkbox';
import { Grayscale } from 'react-native-color-matrix-image-filters'
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';
import pickerSelectDarkStyles from '../styles/pickerSelectDarkStyles';

const searchIcon = require('../assets/images/search_icon.png');
const filtersIcon = require('../assets/images/filters_icon.png');
const backIcon = require('../assets/images/back_icon.png');
const arrowIcon = require('../assets/images/arrow_icon.png');
const placeholder = require('../assets/images/placeholder_icon.png');
const fullStar = require('../assets/images/full_star_icon.png');
const emptyStar = require('../assets/images/empty_star_icon.png');

export default function InterpretersScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [englishCheckbox, setEnglishCheckbox] = useState(false);
    const [frenchCheckbox, setFrenchCheckbox] = useState(false);
    const [japaneseCheckbox, setJapaneseCheckbox] = useState(false);
    const [portugueseCheckbox, setPortugueseCheckbox] = useState(false);
    const [spanishCheckbox, setSpanishCheckbox] = useState(false);
    const [languagesDropVisible, setLanguagesDropVisible] = useState(false);
    const [specialty, setSpecialty] = useState('');
    const [ageDropVisible, setAgeDropVisible] = useState(false);
    const [age2030Checkbox, setAge2030Checkbox] = useState(false);
    const [age3040Checkbox, setAge3040Checkbox] = useState(false);
    const [age4050Checkbox, setAge4050Checkbox] = useState(false);
    const [age5060Checkbox, setAge5060Checkbox] = useState(false);
    const [interpreters, setInterpreters] = useState([]);
    const [interpretersAux, setInterpretersAux] = useState([]);
    const [onlineInterpreters, setOnlineInterpreters] = useState({});
    const [busyInterpreters, setBusyInterpreters] = useState({});
    const age20 = new Date();
    const age30 = new Date();
    const age40 = new Date();
    const age50 = new Date();
    const age60 = new Date();
    age20.setUTCFullYear(age20.getUTCFullYear() - 20);
    age30.setUTCFullYear(age30.getUTCFullYear() - 30);
    age40.setUTCFullYear(age40.getUTCFullYear() - 40);
    age50.setUTCFullYear(age50.getUTCFullYear() - 50);
    age60.setUTCFullYear(age60.getUTCFullYear() - 60);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setInterpreters([]);
            getAllInterpreter();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        firebase.database()
            .ref('/onlineInterpreters')
            .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
                if (snapshot.val() != null) {
                    //const list = Object.keys(data);
                    setOnlineInterpreters(snapshot.val());
                } else {
                    setOnlineInterpreters({});
                }
            });

        firebase.database()
            .ref('/busy')
            .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
                if (snapshot.val() != null) {
                    //const list = Object.keys(data);
                    setBusyInterpreters(snapshot.val());
                } else {
                    setBusyInterpreters({});
                }
            });

        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('interpreters'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        getAllInterpreter();
        setLanguage();
    }, []);

    useEffect(() => {
        checkboxLanguageClickHandler();
    }, [englishCheckbox, frenchCheckbox, japaneseCheckbox, portugueseCheckbox, spanishCheckbox]);

    useEffect(() => {
        checkboxAgeClickHandler();
    }, [age2030Checkbox, age3040Checkbox, age4050Checkbox, age5060Checkbox]);

    const getAllInterpreter = async () => {
        AsyncStorage.getItem('token').then((token) => {
            axios.get('http://157.245.2.201:3456/api/uwiser/users/translatoractive',
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setInterpreters(res.data);
                    setInterpretersAux(res.data);
                }
            }).catch(err => {
                console.log(err);
            });
        });
    }

    const cleanFiltersHandler = () => {
        setEnglishCheckbox(false);
        setFrenchCheckbox(false);
        setJapaneseCheckbox(false);
        setPortugueseCheckbox(false);
        setSpanishCheckbox(false);
        setAge2030Checkbox(false);
        setAge3040Checkbox(false);
        setAge4050Checkbox(false);
        setAge5060Checkbox(false);
        setSpecialty('');
    }

    const checkboxLanguageClickHandler = () => {
        if (englishCheckbox || frenchCheckbox || japaneseCheckbox || portugueseCheckbox || spanishCheckbox) {
            setInterpreters(interpretersAux.filter(interpreter => interpreter.languages.toLowerCase().includes(
                englishCheckbox ? I18n.t('english').toLowerCase() : '' ||
                    frenchCheckbox ? I18n.t('french').toLowerCase() : '' ||
                        japaneseCheckbox ? I18n.t('japanese').toLowerCase() : '' ||
                            portugueseCheckbox ? I18n.t('portuguese').toLowerCase() : '' ||
                                spanishCheckbox ? I18n.t('spanish').toLowerCase() : ''
            )));
        } else {
            setInterpreters(interpretersAux);
        }
    }

    const modalVisibleHandler = () => {
        setModalVisible(visible => !visible);
    }

    const searchHandler = (value) => {
        setSearch(value);
        setInterpreters(interpretersAux.filter(interpreter => interpreter.name.toLowerCase().includes(value.toLowerCase())));
    }

    const specialtySearchHandler = (value) => {
        setSpecialty(value);
        setInterpreters(interpretersAux.filter(interpreter => interpreter.specialty.toLowerCase().includes(value.toLowerCase())));
    }

    const checkboxAgeClickHandler = () => {
        if (age2030Checkbox || age3040Checkbox || age4050Checkbox || age5060Checkbox) {
            setInterpreters(interpretersAux.filter(interpreter => {
                let age = new Date(interpreter.age);

                return age2030Checkbox && age <= age20 && age > age30 ||
                    age3040Checkbox && age <= age30 && age > age40 ||
                    age4050Checkbox && age <= age40 && age > age50 ||
                    age5060Checkbox && age <= age50 && age > age60;
            }));
        } else {
            setInterpreters(interpretersAux);
        }
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

    const renderItem = ({ item, i }) => {
        const hasRating = !(item.assessments == null || item.assessments == [] || item.assessments.length == 0);
        const rating = hasRating ? (item.assessments.reduce((a, { value }) => a + value, 0) / item.assessments.length).toFixed(1) : 0;

        return <TouchableOpacity style={i == 8 ? [styles.interpretersCard, styles.boxShadow, styles.padding10] : [styles.interpretersCard, styles.separator, styles.boxShadow, styles.padding10]} key={i} onPress={() => navigation.navigate('InterpreterDetails', { interpreter: item, rating: rating })}>
            {
                busyInterpreters != {} && busyInterpreters[item.id.toString()] == true ?
                    <View key={`image${i}`} style={[styles.containerCenter, styles.padding10, styles.marginRight10]}>
                        <Image source={item.image == null || item.image == '' ? placeholder : { uri: item.image }} style={{ width: 90, height: 90, borderRadius: 50, }} />
                        <View style={{ width: 20, height: 20, borderRadius: 50, borderColor: '#fff', borderWidth: 2, position: 'absolute', bottom: 12, right: 12, backgroundColor: 'red' }} />
                    </View>
                    :
                    onlineInterpreters != {} && onlineInterpreters[item.id.toString()] == true ?
                        <View key={`image${i}`} style={[styles.containerCenter, styles.padding10, styles.marginRight10]}>
                            <Image source={item.image == null || item.image == '' ? placeholder : { uri: item.image }} style={{ width: 90, height: 90, borderRadius: 50, }} />
                            <View style={{ width: 20, height: 20, borderRadius: 50, borderColor: '#fff', borderWidth: 2, position: 'absolute', bottom: 12, right: 12, backgroundColor: 'green' }} />
                        </View>
                        :
                        <View key={`image${i}`} style={[styles.containerCenter, styles.padding10, styles.marginRight10]}>
                            <Grayscale>
                                <Image source={item.image == null || item.image == '' ? placeholder : { uri: item.image }} style={{ width: 90, height: 90, borderRadius: 50, opacity: 0.9 }} />
                            </Grayscale>
                            <View style={{ width: 20, height: 20, borderRadius: 50, borderColor: '#fff', borderWidth: 2, position: 'absolute', bottom: 12, right: 12, backgroundColor: 'gray' }} />
                        </View>
            }
            <View key={`information${i}`} style={[styles.container, styles.containerCenter, styles.marginRight10]}>
                <View style={[styles.containerRow, styles.containerSpaceBetween]}>
                    <Text style={[styles.fontBold, styles.marginBottom5, styles.fontLarge]}>{item.name}</Text>
                    <View style={[styles.containerRow, styles.alignCenter]}>
                        <Image source={hasRating ? fullStar : emptyStar} style={{ width: 16, height: 16, marginRight: 5 }} />
                        <Text style={hasRating ? styles.textYellow : styles.textLight}>{rating}</Text>
                    </View>
                </View>
                <Text>{I18n.t('languages')}: {getLanguages(item.languages)}</Text>
                <Text>{I18n.t('specialty')}: {I18n.t(item.specialty)}</Text>
                <Text>{I18n.t('city')}: {item.city}</Text>
                <Text>{I18n.t('age')}: {ageFormatter(item.age)}</Text>
            </View>
        </TouchableOpacity>;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <View style={[styles.container, styles.padding20, styles.paddingBottom0]}>
                <View style={[styles.marginBottom20, styles.containerRow, styles.containerSpaceBetween, styles.backgroundWhite, styles.input, styles.boxShadow]}>
                    <View style={[styles.container, styles.containerRow, styles.alignCenter]}>
                        <TextInput
                            placeholder={'Search'}
                            placeholderTextColor={'#c6c6c6'}
                            name={'search'}
                            value={search}
                            onChangeText={value => searchHandler(value)}
                            style={{ flex: 1 }} />
                        <Image source={searchIcon} style={{ position: 'absolute', right: 0, padding: 10, height: 20, width: 20, }} />
                    </View>
                    <View style={styles.horizontalSeparator} />
                    <TouchableOpacity onPress={() => modalVisibleHandler()} style={[styles.containerSpaceBetween, styles.containerRow, styles.alignCenter, styles.width80]}>
                        <Text style={[styles.textLight]}>Filters</Text>
                        <Image source={filtersIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, }} />
                    </TouchableOpacity>
                </View>
                {interpreters != null && interpreters.length > 0 ?
                    <View style={[styles.container]}>
                        <FlatList
                            data={interpreters}
                            contentContainerStyle={{ borderRadius: 10, overflow: 'hidden' }}
                            renderItem={renderItem}
                            keyExtractor={item => item.id} />
                    </View>
                    :
                    <View style={[styles.padding20, styles.containerCenter, styles.alignCenter]}>
                        <Text style={styles.textLight}>Loading...</Text>
                    </View>
                }
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => modalVisibleHandler()}
            >
                <TouchableOpacity style={styles.container} activeOpacity={1} onPressOut={() => modalVisibleHandler()}>
                    <View style={[styles.container, styles.containerCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding20]}>
                                <View style={[styles.containerRow, styles.containerSpaceBetween, styles.alignCenter, styles.width300]}>
                                    <TouchableOpacity onPress={() => modalVisibleHandler()}>
                                        <Image source={backIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, tintColor: '#1c4370' }} />
                                    </TouchableOpacity>
                                    <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textColor]}>Filtrar</Text>
                                    <Text style={[styles.fontLarge, styles.textColor]} onPress={() => cleanFiltersHandler()}>Limpar</Text>
                                </View>
                                <View style={[styles.separator, styles.marginTop10, styles.marginBottom10]} />
                                <View>
                                    <TouchableOpacity style={[styles.containerRow, styles.containerSpaceBetween, styles.alignCenter, styles.marginBottom10, styles.width300]} onPress={() => setLanguagesDropVisible(visible => !visible)}>
                                        <Text style={[styles.fontBold, styles.fontLarge, styles.textGray]}>{I18n.t('languages')}</Text>
                                        {languagesDropVisible ?
                                            <Image source={arrowIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, tintColor: '#1c4370', transform: [{ rotate: '180deg' }] }} />
                                            :
                                            <Image source={arrowIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, tintColor: '#1c4370' }} />
                                        }
                                    </TouchableOpacity>
                                    {languagesDropVisible &&
                                        <View style={styles.marginBottom10}>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={englishCheckbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setEnglishCheckbox(value)} />
                                                <Text style={styles.marginLeft10}>{I18n.t('english')}</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={frenchCheckbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setFrenchCheckbox(value)} />
                                                <Text style={styles.marginLeft10}>{I18n.t('french')}</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={japaneseCheckbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setJapaneseCheckbox(value)} />
                                                <Text style={styles.marginLeft10}>{I18n.t('japanese')}</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={portugueseCheckbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setPortugueseCheckbox(value)} />
                                                <Text style={styles.marginLeft10}>{I18n.t('portuguese')}</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={spanishCheckbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setSpanishCheckbox(value)} />
                                                <Text style={styles.marginLeft10}>{I18n.t('spanish')}</Text>
                                            </View>
                                        </View>
                                    }
                                    <View style={styles.marginBottom10}>
                                        <RNPickerSelect
                                            placeholder={{ label: I18n.t('specialty'), value: null }}
                                            value={specialty}
                                            style={pickerSelectDarkStyles}
                                            onValueChange={(value) => specialtySearchHandler(value)}
                                            items={[
                                                { label: I18n.t('administration'), value: 'administration' },
                                                { label: I18n.t('agribusiness_agriculture'), value: 'agribusiness_agriculture' },
                                                { label: I18n.t('architecture_urbanism'), value: 'architecture_urbanism' },
                                                { label: I18n.t('accounting_sciences'), value: 'accounting_sciences' },
                                                { label: I18n.t('law'), value: 'law' },
                                                { label: I18n.t('engineering'), value: 'engineering' },
                                                { label: I18n.t('statistic'), value: 'statistic' },
                                                { label: I18n.t('aesthetics'), value: 'aesthetics' },
                                                { label: I18n.t('gastronomy'), value: 'gastronomy' },
                                                { label: I18n.t('management'), value: 'management' },
                                                { label: I18n.t('logistics'), value: 'logistics' },
                                                { label: I18n.t('marketing'), value: 'marketing' },
                                                { label: I18n.t('dentistry'), value: 'dentistry' },
                                                { label: I18n.t('human_resources'), value: 'human_resources' },
                                                { label: I18n.t('health'), value: 'health' },
                                                { label: I18n.t('technology'), value: 'technology' },
                                                { label: I18n.t('tourism'), value: 'tourism' },
                                            ]} />
                                    </View>
                                    <TouchableOpacity style={[styles.containerRow, styles.containerSpaceBetween, styles.alignCenter, styles.marginBottom10, styles.width300]} onPress={() => setAgeDropVisible(visible => !visible)}>
                                        <Text style={[styles.fontBold, styles.fontLarge, styles.textGray]}>{I18n.t('age')}</Text>
                                        {ageDropVisible ?
                                            <Image source={arrowIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, tintColor: '#1c4370', transform: [{ rotate: '180deg' }] }} />
                                            :
                                            <Image source={arrowIcon} style={{ padding: 10, margin: 5, height: 20, width: 20, tintColor: '#1c4370' }} />
                                        }
                                    </TouchableOpacity>
                                    {ageDropVisible &&
                                        <View style={styles.marginBottom10}>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    value={age2030Checkbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setAge2030Checkbox(value)} />
                                                <Text style={styles.marginLeft10}>20-30</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={age3040Checkbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setAge3040Checkbox(value)} />
                                                <Text style={styles.marginLeft10}>30-40</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={age4050Checkbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setAge4050Checkbox(value)} />
                                                <Text style={styles.marginLeft10}>40-50</Text>
                                            </View>
                                            <View style={[styles.containerRow, styles.alignCenter]}>
                                                <CheckBox
                                                    style={{ width: 25, height: 25 }}
                                                    value={age5060Checkbox}
                                                    tintColors={{ true: '#1c4370' }}
                                                    onValueChange={(value) => setAge5060Checkbox(value)} />
                                                <Text style={styles.marginLeft10}>50-60</Text>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
