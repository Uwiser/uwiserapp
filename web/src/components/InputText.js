import React from 'react'
import styled from 'styled-components'

const Input = styled.input`
    width: 300px;
    height: 26px;
    font-size: 16px;
    border-radius: 6px;
    padding: 10px;
    margin: 10px;
    border-width: 1px;
    border-style: solid;
    border-color: #00000066;
    color: #444;
    ::-webkit-clear-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        display: none;
    }

    ::placeholder {
        color: #00000080;
    }

    &:hover {
        border-color: #000000CC;
    }

    &:focus,
    &:active {
        outline: none;
        border-color: #009fc2;
        box-shadow: inset 0px 0px 0px 1px #009fc2;
        caret-color: #009fc2;
    }
`;

export default class InputText extends React.Component {
    render() {
        return (
            <Input {...this.props} onChange={this.props.change} />
        )
    }
}