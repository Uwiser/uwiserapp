import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
} from 'react-native';

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    placeholder: {
        paddingLeft: 30,
    },
    inputAndroid: {
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default pickerSelectStyles;