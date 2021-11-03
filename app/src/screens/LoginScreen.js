'use strict';

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginManager from '../manager/LoginManager';
import RoundedButton from '../components/RoundedButton';
import RoundedOutlinedButton from '../components/RoundedOutlinedButton';
import firebase from 'react-native-firebase';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';

export default class LoginScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: I18n.t('login'),
        };
    };

    constructor(props) {
        super(props);
        this.inputElement = React.createRef();

        this.state = {
            username: '',
            modalText: '',
            email: '',
            password: '',
            emailEmptyError: false,
            passwordEmptyError: false,
            loginError: false,
            loginEnabledError: false,
            loginUserEnabledError: false,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('usernamevox')
            .then((username) => {
                this.setState({ username: username });
            });

        if (Platform.OS === 'android') {
            this.inputElement.current.setNativeProps({
                style: { fontFamily: 'Roboto-Regular' }
            });
        }

        // LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
        LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
        // LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    }

    onLoggedIn(displayName) {
        (async () => {
            await AsyncStorage.setItem('usernamevox', this.state.username);
        })();
    }

    loginWithOneTimeKeyClicked() {
        LoginManager.getInstance().loginWithOneTimeKey(this.state.username + '.voximplant.com', this.state.password);
    }

    loginHandler = async () => {
        this.setState({
            emailEmptyError: false,
            passwordEmptyError: false,
            loginError: false,
            loginEnabledError: false,
            loginUserEnabledError: false,
        });

        if (this.state.email.length == 0) {
            this.setState({ emailEmptyError: true });
        } else if (this.state.password.length == 0) {
            this.setState({ passwordEmptyError: true });
        } else {
            axios.post('http://157.245.2.201:3456/api/uwiser/users/Login',
                {
                    email: this.state.email,
                    password: this.state.password
                }
            ).then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    (async () => {
                        await AsyncStorage.setItem('id', res.data.user.id.toString());
                        AsyncStorage.setItem('token', res.data.token).then(() => {
                            this.props.navigation.navigate('Home');
                        });
                        await AsyncStorage.setItem('name', res.data.user.name);
                        await AsyncStorage.setItem('email', res.data.user.email);
                        await AsyncStorage.setItem('usernamevox', res.data.user.usernamevox);
                        await AsyncStorage.setItem('phone', res.data.user.phone);
                        await AsyncStorage.setItem('idvox', res.data.user.idvox.toString());
                        await AsyncStorage.setItem('user_type_id', res.data.user.user_type_id.toString());
                        await AsyncStorage.setItem('image', res.data.user.image ? res.data.user.image : '');
                        await AsyncStorage.setItem('credits', res.data.user.credits.toString());
                        await AsyncStorage.setItem('balance', res.data.user.balance.toString());

                        if (res.data.user.user_type_id == 1) {
                            const reference1 = firebase.database().ref(`/onlineUsers/${res.data.user.id}`);
                            reference1.set(true).then(() => console.log('Online presence set'));
                        }

                        if (res.data.user.user_type_id == 2) {
                            //const userId = auth().currentUser.uid;
                            const reference2 = firebase.database().ref(`/onlineInterpreters/${res.data.user.id}`);
                            reference2.set(true).then(() => console.log('Online presence set'));

                            await AsyncStorage.setItem('cpf', res.data.user.cpf);
                            await AsyncStorage.setItem('age', res.data.user.age ? res.data.user.age.toString() : '');
                            await AsyncStorage.setItem('city', res.data.user.city ? res.data.user.city : '');
                            await AsyncStorage.setItem('country', res.data.user.country ? res.data.user.country : '');
                            await AsyncStorage.setItem('description', res.data.user.description ? res.data.user.description : '');
                            await AsyncStorage.setItem('specialty', res.data.user.specialty ? res.data.user.specialty : '');
                            await AsyncStorage.setItem('languages', res.data.user.languages ? res.data.user.languages : '');
                            await AsyncStorage.setItem('email_paypal', res.data.user.email_paypal ? res.data.user.email_paypal : '');
                        }
                    })();
                    LoginManager.getInstance().loginWithPassword(res.data.user.usernamevox + '@uwiser.criatec.n2.voximplant.com', this.state.password);
                }
            }).catch(err => {
                console.log(err);

                if (err.toString().indexOf('418') != -1) {
                    this.setState({ loginEnabledError: true });
                } else if (err.toString().indexOf('419') != -1) {
                    this.setState({ loginUserEnabledError: true });
                } else {
                    this.setState({ loginError: true });
                }
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
                <ScrollView style={styles.backgroundWhite}>
                    <View style={[styles.container, styles.containerCenter, styles.backgroundWhite, styles.paddingHorizontal20]}>
                        <View style={styles.alignCenter}>
                            <View style={styles.imageBackgroundContainer}>
                                <ImageBackground source={require('../assets/images/login.png')} resizeMode={'contain'} style={styles.container} />
                            </View>
                        </View>
                        <View style={[styles.marginBottom20, styles.marginHorizontal40]}>
                            <TextInput
                                placeholder={I18n.t('email')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'email'}
                                value={this.state.email}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => { this.setState({ email: value }); }} />
                            {this.state.emailEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                        </View>
                        <View style={[styles.marginBottom20, styles.marginHorizontal40]}>
                            <TextInput
                                placeholder={I18n.t('password')}
                                placeholderTextColor={'#c6c6c6'}
                                name={'password'}
                                value={this.state.password}
                                style={[styles.input, styles.marginBottom5, styles.boxShadow]}
                                onChangeText={value => { this.setState({ password: value }); }}
                                secureTextEntry={true}
                                ref={this.inputElement} />
                            {this.state.passwordEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                            {this.state.loginError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('invalidEmailPassword')}.</Text>}
                            {this.state.loginEnabledError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>Perfil em análise.</Text>}
                            {this.state.loginUserEnabledError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>Conta pendente. Enviamos um e-mail de validação para você.</Text>}
                        </View>
                        <View style={[styles.alignCenter, styles.marginHorizontal40]}>
                            <View style={styles.containerRow}>
                                <RoundedButton title={I18n.t('login')} click={() => this.loginHandler()} />
                            </View>
                            <Text style={styles.textLink} onPress={() => this.props.navigation.navigate('RecoverPassword')}>{I18n.t('forgotPassword')}</Text>
                            <RoundedOutlinedButton title={I18n.t('register')} click={() => this.props.navigation.navigate('Register')} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
