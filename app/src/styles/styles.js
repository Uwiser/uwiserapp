import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerRow: {
        flexDirection: 'row',
    },
    containerCenter: {
        display: 'flex',
        justifyContent: 'center',
    },
    containerSpaceBetween: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    containerSpaceAround: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    alignCenter: {
        alignItems: 'center',
    },
    width50: {
        width: 50,
    },
    width60: {
        width: 60,
    },
    width80: {
        width: 80,
    },
    width100: {
        width: 100,
    },
    width300: {
        width: 300,
    },
    width360: {
        width: 360,
    },
    width400: {
        width: 400,
    },
    horizontalSeparator: {
        borderColor: '#bbb',
        borderWidth: 1,
        marginHorizontal: 20,
    },
    pickerSelectContainer: {
        width: 300,
        height: 50,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#1c4370',
    },
    pickerSelectContainerCountry: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        color: '#000',
    },
    pickerSelectAmountContainer: {
        height: 50,
        borderRadius: 10,
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#1c4370',
    },
    textLink: {
        //color: '#1c4370',
        color: '#21a6f3',
    },
    textDisabled: {
        color: '#666',
    },
    textWhite: {
        color: '#fff',
    },
    textColor: {
        color: '#1c4370',
    },
    textColorLight: {
        color: '#4AB1B9',
    },
    textRed: {
        color: '#FF0000',
    },
    textGreen: {
        color: 'green',
    },
    textYellow: {
        color: '#fad16e',
    },
    textLight: {
        color: '#000',
        opacity: 0.6,
    },
    textGray: {
        color: '#000',
        opacity: 0.8,
    },
    margin5: {
        margin: 5,
    },
    margin10: {
        margin: 10,
    },
    margin20: {
        margin: 20,
    },
    marginBottom5: {
        marginBottom: 5,
    },
    marginBottom10: {
        marginBottom: 10,
    },
    marginBottom20: {
        marginBottom: 20,
    },
    marginBottom50: {
        marginBottom: 50,
    },
    marginTop5: {
        marginTop: 5,
    },
    marginTop10: {
        marginTop: 10,
    },
    marginTop20: {
        marginTop: 20,
    },
    marginTop50: {
        marginTop: 50,
    },
    marginHorizontal10: {
        marginHorizontal: 10,
    },
    marginHorizontal20: {
        marginHorizontal: 20,
    },
    marginHorizontal40: {
        marginHorizontal: 40,
    },
    marginVertical10: {
        marginVertical: 10,
    },
    padding5: {
        padding: 5,
    },
    padding10: {
        padding: 10,
    },
    padding20: {
        padding: 20,
    },
    padding40: {
        padding: 40,
    },
    paddingBottom0: {
        paddingBottom: 0,
    },
    paddingBottom10: {
        paddingBottom: 10,
    },
    paddingBottom20: {
        paddingBottom: 20,
    },
    paddingTop10: {
        paddingTop: 10,
    },
    paddingTop20: {
        paddingTop: 20,
    },
    paddingHorizontal5: {
        paddingHorizontal: 5,
    },
    paddingHorizontal10: {
        paddingHorizontal: 10,
    },
    paddingHorizontal20: {
        paddingHorizontal: 20,
    },
    paddingHorizontal40: {
        paddingHorizontal: 40,
    },
    paddingHorizontal80: {
        paddingHorizontal: 80,
    },
    paddingVertical5: {
        paddingVertical: 5,
    },
    paddingVertical10: {
        paddingVertical: 10,
    },
    paddingVertical20: {
        paddingVertical: 20,
    },
    marginRight5: {
        marginRight: 5,
    },
    marginRight10: {
        marginRight: 10,
    },
    marginRight20: {
        marginRight: 20,
    },
    marginLeft5: {
        marginLeft: 5,
    },
    marginLeft10: {
        marginLeft: 10,
    },
    marginLeft20: {
        marginLeft: 20,
    },
    height50: {
        height: 50,
    },
    height100: {
        height: 100,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        color: '#000',
    },
    textCenter: {
        textAlign: 'center',
    },
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    interpretersCard: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backgroundWhite: {
        backgroundColor: '#fff',
    },
    backgroundColor: {
        backgroundColor: '#1c4370',
    },
    backgroundGreen: {
        backgroundColor: 'green',
    },
    border10: {
        borderRadius: 10,
    },
    borderRound: {
        borderRadius: 50,
    },
    interpreterDetailsCard: {
        backgroundColor: '#fff',
        display: 'flex',
    },
    interpreterDetailsPriceCard: {
        backgroundColor: '#1E4B77',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    borderRadiusTop: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    borderRadiusBottom: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    fontBold: {
        fontWeight: 'bold',
    },
    fontSmall: {
        fontSize: 10,
    },
    fontMedium: {
        fontSize: 12,
    },
    fontLarge: {
        fontSize: 16,
    },
    fontExtraLarge: {
        fontSize: 20,
    },
    imageBackgroundContainer: {
        height: 320,
        width: 290,
    },
    imageBackgroundContainerSmall: {
        height: 90,
        width: 290,
    },
    callButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        height: 80,
        width: 80,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        height: 60,
        width: 60,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    speakerButton: {
        position: 'absolute',
        bottom: 20,
        right: 30,
        height: 60,
        width: 60,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        height: 80,
        width: 80,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    declineButton: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        height: 80,
        width: 80,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    datePickerHeader: {
        width: '100%',
        padding: 15,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: 'grey',
    },
});

export default styles;