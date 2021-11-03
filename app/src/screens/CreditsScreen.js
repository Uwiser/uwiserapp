import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import axios from 'axios';
import {
    useConfirmPayment,
    initPaymentSheet,
    presentPaymentSheet
} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import LogoutButton from '../components/LogoutButton';
import RoundedButton from '../components/RoundedButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import I18n from '../locales';
import styles from '../styles/styles';
import pickerSelectStyles from '../styles/pickerSelectStyles';

export default function CreditsScreen({ route, navigation }) {
    const [credits, setCredits] = useState('');
    const [balance, setBalance] = useState('');
    const [userType, setUserType] = useState('');
    const [emailPaypal, setEmailPaypal] = useState('');
    const [amount, setAmount] = useState(0);
    const [amountEmptyError, setAmountEmptyError] = useState(false);
    const [parameterPromotion, setParameterPromotion] = useState('0');
    const { loading } = useConfirmPayment();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setCredits(await AsyncStorage.getItem('credits'));
            setBalance(await AsyncStorage.getItem('balance'));
            getParameters();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        function setLanguage() {
            navigation.setOptions({
                title: I18n.t('credits'),
                headerRight: () => (
                    <LogoutButton navigation={navigation} />
                ),
            })
        }

        async function getUser() {
            setUserType(await AsyncStorage.getItem('user_type_id'));
            setCredits(await AsyncStorage.getItem('credits'));
            setBalance(await AsyncStorage.getItem('balance'));
            setEmailPaypal(await AsyncStorage.getItem('email_paypal'));
        }

        getUser();
        setLanguage();
        getParameters();
    }, []);

    const getParameters = async () => {
        const token = await AsyncStorage.getItem('token');

        axios.get(`http://157.245.2.201:3456/api/uwiser/parameters/promotion`,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        ).then((res) => {
            console.log(res.data);
            setParameterPromotion(res.data.parameter_value);
        }).catch(err => {
            console.log(err);
        });
    }

    const fetchPaymentIntent = async () => {
        setAmountEmptyError(false);

        if (amount == '' || amount <= 0) {
            setAmountEmptyError(true);
        } else {
            const token = await AsyncStorage.getItem('token');

            axios.post(`http://157.245.2.201:3456/api/uwiser/users/Payment`,
                {
                    amount: parseInt(amount * 1.1),
                    currency: 'JPY',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then(async (res) => {
                console.log(res.data);
                initializePaymentSheet(res.data.client_secret);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const initializePaymentSheet = async (clientSecret) => {
        const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });

        if (error) {
            console.log(`Error code: ${error.code}`, error.message);
        } else {
            console.log('Success', 'Order confirmed');
            openPaymentSheet(clientSecret);
        }
    }

    const openPaymentSheet = async (clientSecret) => {
        const { error } = await presentPaymentSheet({ clientSecret });

        if (error) {
            console.log(`Error code: ${error.code}`, error.message);
        } else {
            console.log('Success', 'Payment confirmed');
            const token = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('id');

            axios.post(`http://157.245.2.201:3456/api/uwiser/PaymentHistory`,
                {
                    user_id: parseInt(id),
                    seconds: parseInt((amount / 50) * 60),
                    currency: I18n.t('lang'),
                    value: parseInt(amount * 1.1),
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            ).then(async (res) => {
                await AsyncStorage.setItem('credits', (parseInt(credits) + parseInt((amount / 50) * 60)).toString());
                setCredits(parseInt(credits) + parseInt((amount / 50) * 60));
                setAmount(0);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const durationFormatter = (seconds) => {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    const currencyFormatter = (balance) => {
        let aux = (balance / 60) * (50 * 0.6);
        return `${I18n.t('currency')} ${aux.toFixed(2)}`;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} />
            <ScrollView>
                {parameterPromotion == 0 ?
                    <View style={[styles.container, styles.padding20]}>
                        {userType == 1 ?
                            <View style={[styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20]}>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom5]}>{I18n.t('currentBalance')}</Text>
                                <Text style={[styles.fontBold, styles.textGreen, styles.fontExtraLarge]}>{durationFormatter(credits)}</Text>
                            </View>
                            :
                            <View style={[styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20]}>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom5]}>{I18n.t('grossTotal')}</Text>
                                <Text style={[styles.fontBold, styles.textGreen, styles.fontExtraLarge]}>{currencyFormatter(balance)}</Text>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom5]}>{I18n.t('totalTaxes')}</Text>
                                <Text style={[styles.fontBold, styles.textGreen, styles.fontExtraLarge]}>{currencyFormatter(balance * 0.1021)}</Text>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom5]}>{I18n.t('currentBalance')}</Text>
                                <Text style={[styles.fontBold, styles.textGreen, styles.fontExtraLarge]}>{currencyFormatter(balance * 0.8979)}</Text>
                            </View>
                        }
                        {userType == 1 ?
                            <View>
                                <View style={[styles.marginTop20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20]}>
                                    <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>{I18n.t('buyCredits')}</Text>
                                    <View style={styles.pickerSelectAmountContainer}>
                                        <RNPickerSelect
                                            placeholder={{ label: I18n.t('amount'), value: null }}
                                            value={amount}
                                            style={pickerSelectStyles}
                                            onValueChange={(value) => setAmount(value)}
                                            items={[
                                                { label: '¥' + '500', value: 500 },
                                                { label: '¥' + '1000', value: 1000 },
                                                { label: '¥' + '1500', value: 1500 },
                                                { label: '¥' + '2000', value: 2000 },
                                                { label: '¥' + '3000', value: 3000 },
                                                { label: '¥' + '4500', value: 4500 },
                                            ]} />
                                    </View>
                                    <Text style={[styles.textLight, styles.fontMedium]}>{I18n.t('purchaseCreditsMessage')}</Text>
                                    {amountEmptyError && <Text style={[styles.textRed, styles.fontSmall, styles.marginLeft5]}>{I18n.t('requiredField')}</Text>}
                                </View>
                                {amount != null && amount != '' &&
                                    <View style={[styles.marginTop20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20]}>
                                        <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>{I18n.t('purchaseTotal')}</Text>
                                        <Text style={[styles.textLight, styles.marginBottom5]}>{I18n.t('credits')} ¥ {amount}</Text>
                                        <Text style={[styles.textLight, styles.marginBottom10]}>{I18n.t('taxes')} ¥ {amount * 0.1}</Text>
                                        <Text style={[styles.textColor, styles.fontBold, styles.fontLarge]}>{I18n.t('totalCost')} ¥ {parseInt(amount * 1.1)}</Text>
                                        <View style={styles.containerRow}>
                                            <RoundedButton click={() => fetchPaymentIntent()} title='Buy' disabled={loading} />
                                        </View>
                                    </View>
                                }
                            </View>
                            :
                            <View style={[styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20]}>
                                <Text style={[styles.fontBold, styles.fontLarge, styles.marginBottom10]}>Dados para transferência</Text>
                                <View style={[styles.containerRow, styles.containerSpaceBetween]}>
                                    <Text style={[styles.textLight, styles.fontMedium]}>{emailPaypal}</Text>
                                    <Text style={styles.textLink} onPress={() => navigation.navigate('Profile')}>Alterar</Text>
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <View style={[styles.container, styles.padding20]}>
                        <View style={[styles.marginTop20, styles.boxShadow, styles.interpreterDetailsCard, styles.border10, styles.padding20, styles.alignCenter]}>
                            <Text style={[styles.fontBold, styles.fontLarge]}>{I18n.t('creditsPromotion')}</Text>
                        </View>
                    </View>
                }
            </ScrollView>
        </SafeAreaView >
    );
}
