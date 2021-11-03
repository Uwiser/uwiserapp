import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import ReactModal from 'react-modal'
import axios from 'axios'
import Input from '../components/InputText'
import ButtonRounded from '../components/ButtonRounded'
import banner from '../assets/uwiser_banner.png'
import background from '../assets/home_background.jpg'
import { Close } from '@styled-icons/evaicons-solid/Close'

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-align: center;
    align-items: center;
    align-self: center;
    width: 400px;
`;

const Background = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    object-fit: cover;
`;

const Logo = styled.img`
    height: 150px;
    width: 500px;
    margin-bottom: 100px;
`;

const CloseIcon = styled(Close)`
    color: #1C4370;
    height: 30px;
    width: 30px;
`;

const ButtonRecovery = styled.button`
    margin-top: 10px;
    margin-bottom: 40px;
    cursor: pointer;
    outline: none;
    border: none;
    background-color: transparent;
    color: #1C4370;
`;

const ModalHeader = styled.div`
    flex: 1;
    display: flex;
    background-color: #1C4370;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.span`
    color: #fff;
    font-size: 16px;
    margin-left: 20px;
    text-transform: uppercase;
`;

const ModalBody = styled.form`
    padding: 40px 80px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const ModalBodyText = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        marginTop: '14px',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        maxHeight: 'calc(100vh - 168px)',
        borderRadius: '6px',
    }
};

const Error = styled.span`
    color: #ff0000;
    margin-bottom: 10px;
`;

const Success = styled.span`
    color: #48902D;
    margin-bottom: 10px;
`;

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            emailRecovery: '',
            error: false,
            errorRecovery: false,
            successRecovery: false,
            showModal: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('USER_ID_UWISER')) {
            this.props.history.push('/Dashboard');
        }
    }

    handleLogin = (event) => {
        event.preventDefault();
        this.setState({ error: false })
        var URL = `${process.env.REACT_APP_API_URL}/users/admin/login`;

        axios.post(URL,
            {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                console.log(res.data);
                localStorage.setItem('TOKEN_UWISER', res.data.token);
                localStorage.setItem('USER_ID_UWISER', res.data.admins.id);
                localStorage.setItem('NAME_UWISER', res.data.admins.name);
                localStorage.setItem('EMAIL_UWISER', res.data.admins.email);
                this.props.history.push('/Dashboard');
            }).catch(err => {
                this.setState({ error: true })
                console.log('Erro: ' + err);
            });
    }

    handleRecovery = () => {
        this.setState({
            errorRecovery: false,
            successRecovery: false,
        })

        var URL = `${process.env.REACT_APP_API_URL}/users/Email`

        axios.post(URL,
            {
                email: this.state.emailRecovery,
            })
            .then(res => {
                this.setState({ successRecovery: true })
            }).catch(err => {
                this.setState({ errorRecovery: true })
            });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleOpenModal = () => {
        this.setState({ showModal: true });
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { email, password, emailRecovery, error, errorRecovery, successRecovery } = this.state;

        return (
            <Container>
                <Background src={background} alt='uwiser_home' />
                <Logo src={banner} alt='uwiser' />
                <Input type='email' placeholder='E-mail' name='email' value={email} change={this.handleChange} required='required' />
                <Input type='password' placeholder='Senha' name='password' value={password} change={this.handleChange} required='required' />
                {error && <Error>E-mail ou senha inválidos</Error>}
                <ButtonRecovery onClick={this.handleOpenModal}>Esqueci minha senha</ButtonRecovery>
                <ButtonRounded type='button' title='entrar' click={this.handleLogin} />
                <ReactModal
                    isOpen={this.state.showModal}
                    style={modalStyles}
                    contentLabel='Recuperar senha'
                    onRequestClose={this.handleCloseModal}>
                    <ModalHeader>
                        <ModalTitle>Recuperar Senha</ModalTitle>
                        <ButtonRounded outlined='#1C4370' title={<CloseIcon />} click={this.handleCloseModal} />
                    </ModalHeader>
                    <ModalBody>
                        <ModalBodyText>Insira seu e-mail para lhe enviarmos as novas credenciais</ModalBodyText>
                        <Input type='emailRecovery' placeholder='E-mail' name='emailRecovery' value={emailRecovery} change={this.handleChange} required='required' />
                        {errorRecovery && <Error>E-mail inválido.</Error>}
                        {successRecovery && <Success>E-mail enviado com sucesso.</Success>}
                    </ModalBody>
                    <ModalFooter>
                        <ButtonRounded outlined='#1C4370' type='button' title='cancelar' click={this.handleCloseModal} />
                        <ButtonRounded type='button' title='enviar' click={this.handleRecovery} />
                    </ModalFooter>
                </ReactModal>
            </Container>
        )
    }
}

export default withRouter(LoginScreen);