import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import RoundedButton from '../components/RoundedButton';
import LogoutButton from '../components/LogoutButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';
import pickerSelectDarkStyles from '../styles/pickerSelectDarkStyles';

const placeholder = require('../assets/images/placeholder_icon.png');

export default function ProfileScreen({ route, navigation }) {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState(1);
    const [languages, setLanguages] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');
    const [emailPaypal, setEmailPaypal] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profileImage64, setProfileImage64] = useState('');
    const [nameEmptyError, setNameEmptyError] = useState(false);
    const [emailEmptyError, setEmailEmptyError] = useState(false);
    const [cpfEmptyError, setCpfEmptyError] = useState(false);
    const [phoneEmptyError, setPhoneEmptyError] = useState(false);
    const [languagesEmptyError, setLanguagesEmptyError] = useState(false);
    const [ageEmptyError, setAgeEmptyError] = useState(false);
    const [cityEmptyError, setCityEmptyError] = useState(false);
    const [countryEmptyError, setCountryEmptyError] = useState(false);
    const [specialtyEmptyError, setSpecialtyEmptyError] = useState(false);
    const [emailPaypalEmptyError, setEmailPaypalEmptyError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [languageEnglishCheckbox, setLanguageEnglishCheckbox] = useState(false);
    const [languageFrenchCheckbox, setLanguageFrenchCheckbox] = useState(false);
    const [languageJapaneseCheckbox, setLanguageJapaneseCheckbox] = useState(false);
    const [languagePortugueseCheckbox, setLanguagePortugueseCheckbox] = useState(false);
    const [languageSpanishCheckbox, setLanguageSpanishCheckbox] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('profile'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        async function getUser() {
            const token = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('id');

            axios.get(`http://157.245.2.201:3456/api/uwiser/users/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setId(res.data.id);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setCpf(res.data.cpf);
                    setPhone(res.data.phone);
                    setProfileImage(res.data.image);

                    if (res.data.user_type_id == 2) {
                        let birthday = new Date(res.data.age);
                        setAge(birthday.toLocaleDateString());
                        setDate(birthday);
                        setCity(res.data.city);
                        setCountry(res.data.country);
                        setSpecialty(res.data.specialty);
                        setDescription(res.data.description);
                        setLanguages(res.data.languages);

                        setLanguageEnglishCheckbox(res.data.languages.toLowerCase().includes('english'));
                        setLanguageFrenchCheckbox(res.data.languages.toLowerCase().includes('french'));
                        setLanguageJapaneseCheckbox(res.data.languages.toLowerCase().includes('japanese'));
                        setLanguagePortugueseCheckbox(res.data.languages.toLowerCase().includes('portuguese'));
                        setLanguageSpanishCheckbox(res.data.languages.toLowerCase().includes('spanish'));

                        setUserType(res.data.user_type_id);
                        setEmailPaypal(res.data.email_paypal);
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        }

        getUser();
        setLanguage();
    }, []);

    const updateHandler = async () => {
        const token = await AsyncStorage.getItem('token');
        var langs = languages;

        setNameEmptyError(false);
        setEmailEmptyError(false);
        setCpfEmptyError(false);
        setPhoneEmptyError(false);
        setLanguagesEmptyError(false);
        setAgeEmptyError(false);
        setCityEmptyError(false);
        setCountryEmptyError(false);
        setSpecialtyEmptyError(false);
        setEmailPaypalEmptyError(false);

        if (languageEnglishCheckbox || languageFrenchCheckbox || languageJapaneseCheckbox || languagePortugueseCheckbox || languageSpanishCheckbox) {
            langs = (languageEnglishCheckbox ? 'english; ' : '') + (languageFrenchCheckbox ? 'french; ' : '') + (languageJapaneseCheckbox ? 'japanese; ' : '') + (languagePortugueseCheckbox ? 'portuguese; ' : '') + (languageSpanishCheckbox ? 'spanish; ' : '');
            setLanguages(langs);
        }

        if (name.length == 0) {
            setNameEmptyError(true);
        } else if (email.length == 0) {
            setEmailEmptyError(true);
        } else if (phone.length == 0) {
            setPhoneEmptyError(true);
        } else {
            if (userType == 1) {
                setLoading(true);

                if (profileImage64 != '') {
                    var URL = `https://api.imgbb.com/1/upload?key=8ae6fb5043b2cd29437b4a8d955c1ae3`

                    var data = new FormData();
                    data.append('image', profileImage64.replace('data:image/png;base64,', ''));

                    axios.post(URL, data,
                        {
                            headers: {
                                Accept: 'application/json',
                            }
                        })
                        .then(async (res) => {
                            await AsyncStorage.setItem('image', res.data.data.url);
                            setProfileImage(res.data.data.url);

                            axios.put('http://157.245.2.201:3456/api/uwiser/users',
                                {
                                    id: parseInt(id),
                                    name: name,
                                    email: email,
                                    cpf: cpf,
                                    phone: phone,
                                    image: res.data.data.url,
                                    user_type_id: parseInt(userType)
                                },
                                {
                                    headers: {
                                        Authorization: 'Bearer ' + token
                                    }
                                }
                            ).then((res) => {
                                if (res.status == 200) {
                                    console.log(res);
                                    setModalVisible(true);
                                    setLoading(false);
                                    (async () => {
                                        await AsyncStorage.setItem('name', name);
                                        await AsyncStorage.setItem('cpf', cpf);
                                        await AsyncStorage.setItem('email', email);
                                        await AsyncStorage.setItem('phone', phone);
                                        await AsyncStorage.setItem('image', res.data.data.url);
                                        await AsyncStorage.setItem('user_type_id', userType.toString());
                                    })();
                                }
                            }).catch(err => {
                                console.log(err);
                                setLoading(false);
                            });
                        }).catch(err => {
                            console.log(err);
                            setLoading(false);
                        });
                } else {
                    axios.put('http://157.245.2.201:3456/api/uwiser/users',
                        {
                            id: parseInt(id),
                            name: name,
                            email: email,
                            phone: phone,
                            user_type_id: parseInt(userType)
                        },
                        {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        }
                    ).then((res) => {
                        if (res.status == 200) {
                            console.log(res);
                            setModalVisible(true);
                            setLoading(true);
                            (async () => {
                                await AsyncStorage.setItem('name', name);
                                await AsyncStorage.setItem('email', email);
                                await AsyncStorage.setItem('phone', phone);
                                await AsyncStorage.setItem('user_type_id', userType.toString());
                            })();
                        }
                    }).catch(err => {
                        console.log(err);
                        setLoading(false);
                    });
                }
            } else {
                if (langs.length == 0) {
                    setLanguagesEmptyError(true);
                } else if (age.length == 0) {
                    setAgeEmptyError(true);
                    // } else if (cpf.length == 0) {
                    //     setCpfEmptyError(true);
                } else if (city.length == 0) {
                    setCityEmptyError(true);
                } else if (country.length == 0) {
                    setCountryEmptyError(true);
                } else if (specialty.length == 0) {
                    setSpecialtyEmptyError(true);
                } else if (emailPaypal.length == 0) {
                    setEmailPaypalEmptyError(true);
                } else {
                    setLoading(true);

                    if (profileImage64 != '') {
                        var URL = `https://api.imgbb.com/1/upload?key=8ae6fb5043b2cd29437b4a8d955c1ae3`

                        var data = new FormData();
                        data.append('image', profileImage64.replace('data:image/png;base64,', ''));

                        axios.post(URL, data,
                            {
                                headers: {
                                    Accept: 'application/json',
                                }
                            })
                            .then(async (res) => {
                                await AsyncStorage.setItem('image', res.data.data.url);
                                setProfileImage(res.data.data.url);
                                let birthday = new Date(age);

                                axios.put('http://157.245.2.201:3456/api/uwiser/users',
                                    {
                                        id: parseInt(id),
                                        name: name,
                                        email: email,
                                        cpf: cpf,
                                        age: birthday,
                                        city: city,
                                        country: country,
                                        specialty: specialty,
                                        description: description,
                                        languages: langs,
                                        phone: phone,
                                        image: res.data.data.url,
                                        email_paypal: emailPaypal,
                                        language_app: I18n.t('lang'),
                                        user_type_id: parseInt(userType)
                                    },
                                    {
                                        headers: {
                                            Authorization: 'Bearer ' + token
                                        }
                                    }
                                ).then((res) => {
                                    if (res.status == 200) {
                                        console.log(res);
                                        setModalVisible(true);
                                        setLoading(false);
                                        (async () => {
                                            await AsyncStorage.setItem('name', name);
                                            await AsyncStorage.setItem('age', age);
                                            await AsyncStorage.setItem('city', city);
                                            await AsyncStorage.setItem('country', country);
                                            await AsyncStorage.setItem('cpf', cpf);
                                            await AsyncStorage.setItem('email', email);
                                            await AsyncStorage.setItem('phone', phone);
                                            await AsyncStorage.setItem('description', description);
                                            await AsyncStorage.setItem('specialty', specialty);
                                            await AsyncStorage.setItem('languages', langs);
                                            await AsyncStorage.setItem('email_paypal', emailPaypal);
                                            await AsyncStorage.setItem('image', res.data.data.url);
                                            await AsyncStorage.setItem('user_type_id', userType.toString());
                                        })();
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    setLoading(false);
                                });
                            }).catch(err => {
                                console.log(err);
                                setLoading(false);
                            });
                    } else {
                        let birthday = new Date(age);

                        axios.put('http://157.245.2.201:3456/api/uwiser/users',
                            {
                                id: parseInt(id),
                                name: name,
                                email: email,
                                cpf: cpf,
                                age: birthday,
                                city: city,
                                country: country,
                                specialty: specialty,
                                description: description,
                                languages: langs,
                                phone: phone,
                                email_paypal: emailPaypal,
                                language_app: I18n.t('lang'),
                                user_type_id: parseInt(userType)
                            },
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            }
                        ).then((res) => {
                            if (res.status == 200) {
                                console.log(res);
                                setModalVisible(true);
                                setLoading(false);
                                (async () => {
                                    await AsyncStorage.setItem('name', name);
                                    await AsyncStorage.setItem('age', age);
                                    await AsyncStorage.setItem('city', city);
                                    await AsyncStorage.setItem('country', country);
                                    await AsyncStorage.setItem('cpf', cpf);
                                    await AsyncStorage.setItem('email', email);
                                    await AsyncStorage.setItem('phone', phone);
                                    await AsyncStorage.setItem('description', description);
                                    await AsyncStorage.setItem('specialty', specialty);
                                    await AsyncStorage.setItem('languages', langs);
                                    await AsyncStorage.setItem('email_paypal', emailPaypal);
                                    await AsyncStorage.setItem('user_type_id', userType.toString());
                                })();
                            }
                        }).catch(err => {
                            console.log(err);
                            setLoading(false);
                        });
                    }
                }
            }
        }
    }

    const photoHandler = () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true
        }, (data) => {
            if (!data.didCancel) {
                setProfileImage64('data:image/png;base64,' + data.base64)
                console.log(data.uri)
            }
        })
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setAge(currentDate.toLocaleDateString());
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const onCloseDatePicker = () => {
        setShow(false);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView>
                <View style={[styles.container, styles.padding20]}>
                    <View style={[styles.padding20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.marginBottom20]}>
                        <TouchableOpacity style={styles.alignCenter} onPress={photoHandler}>
                            <Image source={
                                (profileImage == null || profileImage == '') && profileImage64 == '' ? placeholder : { uri: profileImage64 == '' ? profileImage : profileImage64 }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }} />
                            <Text style={[styles.textCenter, styles.fontLarge, styles.textLink]}>{I18n.t('addProfileImage')}</Text>
                            {/* {profileImageEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginTop5]}>{I18n.t('requiredField')}</Text>} */}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.container, styles.padding20, styles.containerCenter, styles.backgroundWhite, styles.border10, styles.boxShadow]}>
                        <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>{I18n.t('registrationData')}</Text>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('name')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'name'}
                                value={name}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setName(value)} />
                            {nameEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        </View>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('email')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'email'}
                                value={email}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setEmail(value)}
                                editable={false} />
                            {emailEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        </View>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('phone')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'phone'}
                                value={phone}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setPhone(value)}
                                keyboardType={'phone-pad'} />
                            {phoneEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        </View>

                        {userType == 2 &&
                            <View>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>Dados para seu perfil</Text>
                                {/* <View style={styles.marginBottom20}>
                                    <TextInput
                                        placeholder={I18n.t('identification')}
                                        placeholderTextColor={'#c6c6c6'}
                                        name={'cpf'}
                                        value={cpf}
                                        style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                        onChangeText={value => setCpf(value)} />
                                    {cpfEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View> */}
                                <View style={styles.marginBottom20}>
                                    <Text style={[styles.fontBold, styles.marginBottom10]}>{I18n.t('languages')}</Text>
                                    <View style={[styles.marginBottom10, styles.containerRow, styles.alignCenter]}>
                                        <CheckBox
                                            style={{ width: 25, height: 25 }}
                                            value={languageEnglishCheckbox}
                                            onValueChange={(value) => setLanguageEnglishCheckbox(value)} />
                                        <Text style={styles.marginLeft10}>{I18n.t('english')}</Text>
                                    </View>
                                    <View style={[styles.marginBottom10, styles.containerRow, styles.alignCenter]}>
                                        <CheckBox
                                            style={{ width: 25, height: 25 }}
                                            value={languageFrenchCheckbox}
                                            onValueChange={(value) => setLanguageFrenchCheckbox(value)} />
                                        <Text style={styles.marginLeft10}>{I18n.t('french')}</Text>
                                    </View>
                                    <View style={[styles.marginBottom10, styles.containerRow, styles.alignCenter]}>
                                        <CheckBox
                                            style={{ width: 25, height: 25 }}
                                            value={languageJapaneseCheckbox}
                                            onValueChange={(value) => setLanguageJapaneseCheckbox(value)} />
                                        <Text style={styles.marginLeft10}>{I18n.t('japanese')}</Text>
                                    </View>
                                    <View style={[styles.marginBottom10, styles.containerRow, styles.alignCenter]}>
                                        <CheckBox
                                            style={{ width: 25, height: 25 }}
                                            value={languagePortugueseCheckbox}
                                            onValueChange={(value) => setLanguagePortugueseCheckbox(value)} />
                                        <Text style={styles.marginLeft10}>{I18n.t('portuguese')}</Text>
                                    </View>
                                    <View style={[styles.marginBottom10, styles.containerRow, styles.alignCenter]}>
                                        <CheckBox
                                            style={{ width: 25, height: 25 }}
                                            value={languageSpanishCheckbox}
                                            onValueChange={(value) => setLanguageSpanishCheckbox(value)} />
                                        <Text style={styles.marginLeft10}>{I18n.t('spanish')}</Text>
                                    </View>
                                    {languagesEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                <View style={styles.marginBottom20}>
                                    <TouchableOpacity onPress={showDatepicker} activeOpacity={1}>
                                        <TextInput
                                            placeholder={I18n.t('age')}
                                            placeholderTextColor={'#c6c6c6'}
                                            name={'age'}
                                            value={age}
                                            style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                            onChangeText={value => setAge(value)}
                                            editable={false}
                                            pointerEvents={'none'} />
                                    </TouchableOpacity>
                                    {ageEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                <View style={styles.marginBottom20}>
                                    <TextInput
                                        placeholder={I18n.t('city')}
                                        placeholderTextColor={'#c6c6c6'}
                                        name={'city'}
                                        value={city}
                                        style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                        onChangeText={value => setCity(value)} />
                                    {cityEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                <View style={styles.marginBottom20}>
                                    <TextInput
                                        placeholder={I18n.t('country')}
                                        placeholderTextColor={'#c6c6c6'}
                                        name={'country'}
                                        value={country}
                                        style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                        onChangeText={value => setCountry(value)} />
                                    {countryEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                <View style={[styles.pickerSelectContainerCountry, styles.marginBottom20]}>
                                    <RNPickerSelect
                                        placeholder={{ label: I18n.t('specialty'), value: null }}
                                        value={specialty}
                                        style={pickerSelectDarkStyles}
                                        onValueChange={(value) => setSpecialty(value)}
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
                                        ]}
                                    />
                                    {specialtyEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                <View style={styles.marginBottom20}>
                                    <TextInput
                                        placeholder={I18n.t('about')}
                                        placeholderTextColor={'#c6c6c6'}
                                        name={'description'}
                                        value={description}
                                        style={[styles.input, styles.marginBottom5, styles.boxShadow, styles.height100]}
                                        onChangeText={value => setDescription(value)}
                                        multiline={true} />
                                </View>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>PayPal</Text>
                                <View style={styles.marginBottom10}>
                                    <TextInput
                                        placeholder={'E-mail PayPal'}
                                        placeholderTextColor={'#c6c6c6'}
                                        name={'emailPaypal'}
                                        value={emailPaypal}
                                        style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                        onChangeText={value => setEmailPaypal(value)} />
                                    {emailPaypalEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                            </View>
                        }

                        <Text onPress={() => navigation.navigate('ChangePassword')} style={[styles.textLink, styles.margin5]}>{I18n.t('changePassword')}</Text>
                        <View style={styles.alignCenter}>
                            <View style={styles.containerRow}>
                                <RoundedButton title={I18n.t('update')} click={() => updateHandler()} disabled={loading} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {show && (
                <View>
                    {Platform.OS === 'ios' && (
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity onPress={onCloseDatePicker}>
                                <Text>Done</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <DateTimePicker
                        style={{ width: '100%' }}
                        testID='dateTimePicker'
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChange} />
                </View>
            )}
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(visible => !visible);
                }}>
                <View style={[styles.container, styles.containerCenter, styles.alignCenter, styles.padding40, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.border10, styles.backgroundWhite, styles.containerCenter, styles.alignCenter, styles.padding40]}>
                        <View style={[styles.containerCenter, styles.alignCenter, styles.paddingBottom20, styles.separator]}>
                            <View style={[styles.containerCenter, styles.backgroundGreen, styles.borderRound, styles.padding10]}>
                                <Image source={require('../assets/images/check_icon.png')} style={{ width: 40, height: 40 }} />
                            </View>
                            <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>{I18n.t('profileUpdated')}</Text>
                        </View>
                        <Text onPress={() => { setModalVisible(false); }} style={[styles.fontLarge, styles.textGreen, styles.fontBold, styles.marginTop20]}>{I18n.t('next')}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
