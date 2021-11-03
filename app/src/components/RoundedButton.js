import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class RoundedButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.click} style={this.props.disabled ? styles.buttonDisabled : styles.button} disabled={this.props.disabled}>
                <Text style={styles.buttonText}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        display: 'flex',
        flex: 1,
        backgroundColor: '#1c4370',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
        borderColor: '#1c4370',
        borderWidth: 1,
    },
    buttonDisabled: {
        height: 50,
        display: 'flex',
        flex: 1,
        backgroundColor: '#1c4370',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
        borderColor: '#1c4370',
        borderWidth: 1,
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
})