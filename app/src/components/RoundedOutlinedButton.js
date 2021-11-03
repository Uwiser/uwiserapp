import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class RoundedOutlinedButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.click} style={styles.button}>
                <Text style={styles.buttonText}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        display: 'flex',
        width: 240,
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginVertical: 20,
        alignItems: 'center',
        borderColor: '#1c4370',
        borderWidth: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#1c4370',
    },
})