import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
    display: inline-flex;
    height: 36px;
    padding: ${props => props.padding ? props.padding : '24px'};
    margin: 10px;
    background-color: ${props => props.outlined ? '#FFFFFF' : props.color ? props.color : '#1C4370'};
    color:  ${props => props.outlined ? props.outlined : '#FFFFFF'};
    caret-color: ${props => props.outlined ? props.outlined : '#FFFFFF'};
    cursor: pointer;
    box-shadow: ${props => props.outlined ? 'none' : '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'};
    align-items: center;
    border-radius: 6px;
    flex: 0 0 auto;
    letter-spacing: 1px;
    justify-content: center;
    position: relative;
    text-decoration: none;
    outline: none;
    border: ${props => props.outlined ? `1px solid ${props.outlined}` : 'none'};
    transition-duration: 0.15s;
    transition-property: box-shadow, transform, opacity, -webkit-box-shadow, -webkit-transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    ${props => props.disabled && 'opacity: 0.6;'}

    &:before {
        border-radius: inherit;
        bottom: 0;
        color: inherit;
        content: '';
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        -webkit-transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    }

    &:active {
        ${props => !props.disabled && 'box-shadow: none;'}
    }

    &:hover {
        ${props => !props.disabled && `opacity: ${props => props.outlined ? '1' : '0.9'};`}
        ${props => !props.disabled && `background-color: ${props => props.outlined ? '#f2f2f2' : props.color ? props.color : '#1C4370'};`}
    }
`;

const ButtonTitle = styled.span`
    display: flex;
    align-items: center;
    font-size: 16px;
`;

export default class ButtonRounded extends React.Component {
    render() {
        return (
            <Button type={this.props.type} onClick={this.props.click} padding={this.props.padding} outlined={this.props.outlined} color={this.props.color} disabled={this.props.disabled && true} >
                <ButtonTitle>
                    {this.props.title}
                </ButtonTitle>
            </Button>
        )
    }
}