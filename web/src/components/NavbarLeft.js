import React from 'react'
import styled from 'styled-components'
import ButtonLink from './ButtonLink'
import Dashboard from '../assets/dashboard_icon.png'
import Calls from '../assets/calls_icon.png'
import Interpreters from '../assets/interpreters_icon.png'
import Users from '../assets/users_icon.png'
import Admins from '../assets/admins_icon.png'
import Exit from '../assets/logout_icon.png'

const Navbar = styled.div`
    height: 100vh;
    background-color: #1C4370;
    flex: 1 1 auto;
    width: 240px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    padding-left: 40px;
    padding-top: 130px;
    margin: 0;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    align-items: flex-start;
`;

const Icon = styled.img`
    color: #fff;
    height: 24px;
    width: 24px;
`;


export default class NavbarLeft extends React.Component {
    render() {
        return (
            <Navbar>
                <ButtonLink to='/Dashboard' title='Dashboard' icon={<Icon src={Dashboard} />} />
                <ButtonLink to='/Calls' title='Ligações' icon={<Icon src={Calls} />} />
                <ButtonLink to='/Interpreters' title='Intérpretes' icon={<Icon src={Interpreters} />} />
                <ButtonLink to='/Users' title='Usuários' icon={<Icon src={Users} />} />
                <ButtonLink to='/Admins' title='Administradores' icon={<Icon src={Admins} />} />
                <ButtonLink to='/' title='Sair' icon={<Icon src={Exit} />} click={() => {
                    localStorage.removeItem('TOKEN_UWISER');
                    localStorage.removeItem('USER_ID_UWISER');
                    localStorage.removeItem('NAME_UWISER');
                    localStorage.removeItem('EMAIL_UWISER');
                }} />
            </Navbar>
        )
    }
}