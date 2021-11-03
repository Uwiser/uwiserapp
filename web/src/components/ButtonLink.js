import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ButtonLinkContainer = styled(Link)`
    display: flex;
    flex: 1;
    height: 26px;
    margin: 15px 0 15px 0;
    background-color: #1C4370;
    color: #FFFFFF;
    cursor: pointer;
    flex: 0 0 auto;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
    align-items: center;

    &:hover {
        opacity: 0.6;
    }
`;

const ButtonLinkIcon = styled.span`
    margin-right: 10px;
`;

const ButtonLinkTitle = styled.span`
    display: flex;
    font-size: 18px;
`;

export default class ButtonLink extends React.Component {
    render() {
        return (
            <ButtonLinkContainer to={this.props.to} onClick={this.props.click}>
                <ButtonLinkIcon>
                    {this.props.icon}
                </ButtonLinkIcon>
                <ButtonLinkTitle>
                    {this.props.title}
                </ButtonLinkTitle>
            </ButtonLinkContainer>
        )
    }
}