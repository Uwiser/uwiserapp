import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
} from 'react-native';

const pickerSelectDarkStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: '#000',
        fontSize: 16,
        textAlign: 'center'
    },
    placeholder: {
        paddingLeft: 10,
    },
    inputAndroid: {
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: '#000',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default pickerSelectDarkStyles;