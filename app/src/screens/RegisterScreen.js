import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
    Linking,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import RoundedButton from '../components/RoundedButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';
import pickerSelectDarkStyles from '../styles/pickerSelectDarkStyles';

const placeholder = require('../assets/images/placeholder_icon.png');

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(1);
    const [languages, setLanguages] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');
    const [emailPaypal, setEmailPaypal] = useState('');
    const [profileImage64, setProfileImage64] = useState('');
    const [termsCheckbox, setTermsCheckbox] = useState(false);
    const [nameEmptyError, setNameEmptyError] = useState(false);
    const [emailEmptyError, setEmailEmptyError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [cpfEmptyError, setCpfEmptyError] = useState(false);
    const [phoneEmptyError, setPhoneEmptyError] = useState(false);
    const [languagesEmptyError, setLanguagesEmptyError] = useState(false);
    const [ageEmptyError, setAgeEmptyError] = useState(false);
    const [cityEmptyError, setCityEmptyError] = useState(false);
    const [countryEmptyError, setCountryEmptyError] = useState(false);
    const [specialtyEmptyError, setSpecialtyEmptyError] = useState(false);
    const [emailPaypalEmptyError, setEmailPaypalEmptyError] = useState(false);
    const [profileImageEmptyError, setProfileImageEmptyError] = useState(false);
    const [passwordEmptyError, setPasswordEmptyError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordConfirmationEmptyError, setPasswordConfirmationEmptyError] = useState(false);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [termsCheckboxError, setTermsCheckboxError] = useState(false);
    const [age, setAge] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [languageEnglishCheckbox, setLanguageEnglishCheckbox] = useState(false);
    const [languageFrenchCheckbox, setLanguageFrenchCheckbox] = useState(false);
    const [languageJapaneseCheckbox, setLanguageJapaneseCheckbox] = useState(false);
    const [languagePortugueseCheckbox, setLanguagePortugueseCheckbox] = useState(false);
    const [languageSpanishCheckbox, setLanguageSpanishCheckbox] = useState(false);
    const [parameterPromotion, setParameterPromotion] = useState('0');

    const inputElement = useRef(null);
    const inputElement2 = useRef(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            inputElement.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
            inputElement2.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
        }

        async function setLanguage() {
            navigation.setOptions({ title: I18n.t('register') })
        }

        async function getParameters() {
            axios.get(`http://157.245.2.201:3456/api/uwiser/parameters/promotion`).then((res) => {
                console.log(res.data);
                setParameterPromotion(res.data.parameter_value);
            }).catch(err => {
                console.log(err);
            });
        }

        setLanguage();
        getParameters();
    }, []);

    const registerHandler = async () => {
        setNameEmptyError(false);
        setEmailEmptyError(false);
        setEmailExistsError(false);
        setCpfEmptyError(false);
        setPhoneEmptyError(false);
        setLanguagesEmptyError(false);
        setAgeEmptyError(false);
        setCityEmptyError(false);
        setCountryEmptyError(false);
        setSpecialtyEmptyError(false);
        setEmailPaypalEmptyError(false);
        setProfileImageEmptyError(false);
        setPasswordEmptyError(false);
        setPasswordLengthError(false);
        setPasswordConfirmationEmptyError(false);
        setPasswordConfirmationError(false);
        setTermsCheckboxError(false);

        let langs = '';

        if (languageEnglishCheckbox || languageFrenchCheckbox || languageJapaneseCheckbox || languagePortugueseCheckbox || languageSpanishCheckbox) {
            langs = (languageEnglishCheckbox ? 'english; ' : '') + (languageFrenchCheckbox ? 'french; ' : '') + (languageJapaneseCheckbox ? 'japanese; ' : '') + (languagePortugueseCheckbox ? 'portuguese; ' : '') + (languageSpanishCheckbox ? 'spanish; ' : '');
            setLanguages(langs);
            console.log(langs)
        }

        if (name.length == 0) {
            setNameEmptyError(true);
        } else if (email.length == 0) {
            setEmailEmptyError(true);
            // } else if (phone.length == 0) {
            //     setPhoneEmptyError(true);
        } else if (password.length == 0) {
            setPasswordConfirmationEmptyError(true);
        } else if (confirmPassword.length == 0) {
            setPasswordConfirmationEmptyError(true);
        } else if (password.length < 8) {
            setPasswordLengthError(true);
        } else if (password != confirmPassword) {
            setPasswordConfirmationError(true);
        } else if (!termsCheckbox) {
            setTermsCheckboxError(true);
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
                            console.log(res.data.data.url);
                            await AsyncStorage.setItem('image', res.data.data.url);

                            createUser(res.data.data.url);
                        }).catch(err => {
                            console.log(err);
                        });
                } else {
                    createUser('');
                }
            } else {
                if (langs == '') {
                    setLanguagesEmptyError(true);
                    // } else if (cpf.length == 0) {
                    //     setCpfEmptyError(true);
                } else if (age.length == 0) {
                    setAgeEmptyError(true);
                } else if (city.length == 0) {
                    setCityEmptyError(true);
                } else if (country.length == 0) {
                    setCountryEmptyError(true);
                } else if (specialty.length == 0) {
                    setSpecialtyEmptyError(true);
                } else if (emailPaypal.length == 0) {
                    setEmailPaypalEmptyError(true);
                } else {
                    if (profileImage64 == '') {
                        setProfileImageEmptyError(true);
                    } else {
                        setLoading(true);
                        var URL = `https://api.imgbb.com/1/upload?key=8ae6fb5043b2cd29437b4a8d955c1ae3`;
                        var birthday = new Date(age);

                        var data = new FormData();
                        data.append('image', profileImage64.replace('data:image/png;base64,', ''));

                        axios.post(URL, data,
                            {
                                headers: {
                                    Accept: 'application/json',
                                }
                            })
                            .then(async (res) => {
                                console.log(res)
                                await AsyncStorage.setItem('image', res.data.data.url);

                                axios.post('http://157.245.2.201:3456/api/uwiser/users',
                                    {
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
                                        password: password,
                                        email_paypal: emailPaypal,
                                        user_type_id: parseInt(userType),
                                        language_app: I18n.t('lang'),
                                        enabled: 0,
                                    }
                                ).then((res) => {
                                    if (res.status == 200) {
                                        console.log(res.data)
                                        setModalVisible(true);
                                        setLoading(false);
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    setLoading(false);

                                    const error = err.toString();

                                    if (error.indexOf('409') != -1) {
                                        setEmailExistsError(true);
                                    }
                                });
                            }).catch(err => {
                                console.log(err);
                            });
                    }
                }
            }
        }
    }

    const createUser = async (image) => {
        axios.post('http://157.245.2.201:3456/api/uwiser/users',
            {
                name: name,
                email: email,
                phone: phone,
                image: image,
                password: password,
                user_type_id: parseInt(userType),
                enabled: 0,
                credits: parameterPromotion == 0 ? 0 : 999999,
            }
        ).then((res) => {
            if (res.status == 200) {
                console.log(res.data)
                setModalVisible(true);
                setLoading(false);
            }
        }).catch(err => {
            console.log(err);
            setLoading(false);

            const error = err.toString();

            if (error.indexOf('409') != -1) {
                setEmailExistsError(true);
            }
        });
    }

    const photoHandler = () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        }, (data) => {
            if (!data.didCancel) {
                setProfileImage64('data:image/png;base64,' + data.base64)
                console.log(data.uri)
            }
        })
    }

    const changeUserType1Handler = () => {
        setUserType(1);
    }

    const changeUserType2Handler = () => {
        setUserType(2);
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
                    <View style={[styles.containerRow, styles.paddingVertical20, styles.paddingHorizontal5, styles.containerSpaceAround, styles.backgroundWhite, styles.border10, styles.boxShadow, styles.marginBottom20]}>
                        <TouchableOpacity onPress={() => changeUserType1Handler()}><Text style={userType == 1 ? styles.fontBold : []}>{I18n.t('personalRegistration')}</Text></TouchableOpacity>
                        <Text>{I18n.t('or')}</Text>
                        <TouchableOpacity onPress={() => changeUserType2Handler()}><Text style={userType == 2 ? styles.fontBold : []}>{I18n.t('interpreterRegistration')}</Text></TouchableOpacity>
                    </View>
                    <View style={[styles.padding20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.marginBottom20]}>
                        <TouchableOpacity style={styles.alignCenter} onPress={photoHandler}>
                            <Image source={profileImage64 == '' ? placeholder : { uri: profileImage64 }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }} />
                            <Text style={[styles.textCenter, styles.fontLarge, styles.textLink]}>{I18n.t('addProfileImage')}</Text>
                            {profileImageEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginTop5]}>{I18n.t('requiredField')}</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.container, styles.padding20, styles.containerCenter, styles.backgroundWhite, styles.border10, styles.boxShadow]}>
                        {
                            userType == 1 ?
                                <Text style={[styles.textCenter, styles.fontLarge, styles.marginBottom20]}>{I18n.t('registerMessage')}</Text>
                                :
                                <Text style={[styles.textCenter, styles.fontLarge, styles.marginBottom20]}>{I18n.t('registerMessageInterpreter')}</Text>
                        }
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
                                onChangeText={value => setEmail(value)} />
                            {emailEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {emailExistsError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('emailAlreadyExists')}</Text>}
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
                                    <View style={[styles.containerRow, styles.alignCenter]}>
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
                                        ]} />
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
                                <Text style={[styles.fontMedium, styles.marginBottom20]}>{I18n.t('registerPaypalMessage1')}
                                    <Text onPress={async () => await Linking.openURL('https://www.paypal.com/br/webapps/mpp/account-selection')} style={[styles.fontMedium, styles.textLink]}> {I18n.t('registerPaypalMessage2')}</Text>
                                </Text>
                            </View>
                        }
                        <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>{I18n.t('password')}</Text>
                        <View style={styles.marginBottom20}>
                            <TextInput
                                placeholder={I18n.t('password')}
                                name={'password'}
                                value={password}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setPassword(value)}
                                secureTextEntry={true}
                                ref={inputElement} />
                            {passwordEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {passwordLengthError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>A senha deve possuir ao menos 8 caracteres.</Text>}
                        </View>
                        <View style={styles.marginBottom10}>
                            <TextInput
                                placeholder={I18n.t('repeatPassword')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'confirmPassword'}
                                value={confirmPassword}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => setConfirmPassword(value)}
                                secureTextEntry={true}
                                ref={inputElement2} />
                            {passwordConfirmationEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {passwordConfirmationError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('invalidPasswordConfirmation')}</Text>}
                        </View>
                        <View style={[styles.marginBottom10, styles.containerRow, styles.marginRight20, styles.alignCenter]}>
                            <CheckBox
                                style={{ width: 25, height: 25 }}
                                value={termsCheckbox}
                                onValueChange={(value) => setTermsCheckbox(value)} />
                            <Text style={[styles.fontMedium, styles.marginLeft10]}>{I18n.t('privacyTerms1')}
                                <Text onPress={async () => await Linking.openURL('https://www.uwiser.jp/termo-de-uso-e-privacidade-uwiser/')} style={[styles.textLink, styles.fontMedium]}> {I18n.t('privacyTerms2')}</Text>
                            </Text>
                        </View>
                        {termsCheckboxError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>Por favor aceite os Termos de uso para prosseguir.</Text>}
                        <View style={styles.containerRow}>
                            <RoundedButton title={I18n.t('register')} click={() => registerHandler()} disabled={loading} />
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
                            {userType == 1 ?
                                <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>{I18n.t('registrationSuccessful')}</Text>
                                :
                                <Text style={[styles.fontExtraLarge, styles.fontBold, styles.textCenter, styles.marginBottom10, styles.marginTop20, styles.textLight]}>{I18n.t('registrationAnalyze')}</Text>
                            }
                        </View>
                        <Text onPress={() => { setModalVisible(false); navigation.navigate('Login'); }} style={[styles.fontLarge, styles.textGreen, styles.fontBold, styles.marginTop20]}>{I18n.t('login')}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
