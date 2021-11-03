import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { css } from '@emotion/react'
import HashLoader from 'react-spinners/HashLoader'
import DataTable from 'react-data-table-component'
import ReactModal from 'react-modal'
import axios from 'axios'
import NavbarFixedTop from '../components/NavbarFixedTop'
import NavbarLeft from '../components/NavbarLeft'
import ButtonRounded from '../components/ButtonRounded'
import Input from '../components/InputText'
import { Plus } from '@styled-icons/boxicons-regular/Plus'
import { Close } from '@styled-icons/evaicons-solid/Close'
import { Pencil } from '@styled-icons/octicons/Pencil'
import { Trash } from '@styled-icons/bootstrap/Trash'
import { CircleFill } from '@styled-icons/bootstrap/CircleFill'
import firebase from 'firebase/app'
import 'firebase/database'

var database = firebase.database();

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const Container = styled.div`
    flex: 1;
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 280px;
    padding: 124px 50px 50px;
`;

const CardTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    text-align: center;
    line-height: 2rem;
    font-family: 'Roboto', sans-serif;
    padding: 0 30px;
    width: 100%;
    background-color: #1C4370;
    border-color: #1C4370;
    border-radius: 6px;
    color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
`;

const CardContainer = styled.div`
    background-color: #fff;
    border-radius: 6px;
    margin-top: 40px;
    padding: 20px;
`;

const Row = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const PencilIcon = styled(Pencil)`
    color: #1C4370;
    height: 20px;
    width: 20px;
`;

const TrashIcon = styled(Trash)`
    color: #C1272D;
    height: 20px;
    width: 20px;
`;

const CircleFillIconGreen = styled(CircleFill)`
    color: #118504;
    height: 10px;
    width: 10px;
`;

const CircleFillIconGrey = styled(CircleFill)`
    color: #000;
    opacity: 0.2;
    height: 10px;
    width: 10px;
`;

const PlusIcon = styled(Plus)`
    color: #fff;
    height: 24px;
    width: 24px;
`;

const CloseIcon = styled(Close)`
    color: #1C4370;
    height: 20px;
    width: 20px;
`;

const Spinner = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
    margin-bottom: 100px;
`;

const customStyles = {
    rows: {
        style: {
            minHeight: '60px',
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '18px',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '16px',
        },
    },
};

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
        maxHeight: 'calc(100vh - 168px)'
    }
};

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

const ModalBody = styled.div`
    padding: 40px 80px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

const Error = styled.span`
    color: #ff0000;
    margin-bottom: 10px;
`;

const PasswordInfo = styled.span`
    font-size: 12px;
    width: 100%;
    margin-left: 20px;
`;

const Grow = styled.div`
    flex-grow: 1 !important;
`;

ReactModal.setAppElement('#root');
export default class UsersScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: localStorage.getItem('TOKEN_UWISER') == null,
            showModal: false,
            showConfirmationModal: false,
            create: null,
            loading: false,
            id: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            users: [],
            usersAux: [],
            error: false,
            search: '',
            onlineUsers: [],
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        database
            .ref('/onlineUsers')
            .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
                if (snapshot.val() != null) {
                    this.setState({ onlineUsers: snapshot.val() });
                } else {
                    this.setState({ onlineUsers: 0 });
                }
            });

        this.handleGet();
    }

    handleRequest = (event) => {
        event.preventDefault();

        if (this.state.create) {
            this.handleCreate();
        } else {
            this.handleUpdate();
        }
    }

    handleGet = () => {
        var URL = `${process.env.REACT_APP_API_URL}/users/commom`;

        axios.get(URL,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('TOKEN_UWISER')
                }
            })
            .then(res => {
                this.setState({
                    users: res.data,
                    usersAux: res.data,
                    loading: false,
                });
            }).catch(err => {
                this.setState({ loading: false });
            });
    }

    handleCreate = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/users`,
            {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                password: this.state.password,
                user_type_id: 1,
                enabled: 0,
            }
        ).then((res) => {
            console.log(res)
            this.handleGet();
            this.setState({ error: false, loading: false });
            this.handleCloseModal();
        }).catch(err => {
            this.setState({ error: true, loading: false });
            console.log(err)
        });
    }

    handleUpdate = () => {
        axios.put(`${process.env.REACT_APP_API_URL}/users`,
            {
                id: this.state.id,
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                user_type_id: 1,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('TOKEN_UWISER')
                }
            }).then((res) => {
                console.log(res)
                this.handleGet();
                this.setState({ error: false, loading: false });
                this.handleCloseModal();
            }).catch(err => {
                this.setState({ error: true, loading: false });
                console.log(err)
            });
    }

    handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/users/remove?id=${this.state.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('TOKEN_UWISER')
                }
            }).then((res) => {
                this.handleGet();
                this.setState({ error: false, loading: false });
                this.handleCloseConfirmationModal();
            }).catch(err => {
                this.setState({ error: true, loading: false });
                this.handleCloseConfirmationModal();
                console.log(err)
            });
    }

    handleOpenModal = (row) => {
        this.setState({ showModal: true });
        console.log(row)

        if (row != null) {
            this.setState({
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                password: '',
                error: false,
                create: false,
            })
        } else {
            this.setState({
                id: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                error: false,
                create: true,
            })
        }
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleOpenConfirmationModal = (row) => {
        this.setState({
            showConfirmationModal: true,
            id: row.id,
            name: row.name,
        })
    }

    handleCloseConfirmationModal = () => {
        this.setState({ showConfirmationModal: false });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSearch = (event) => {
        this.handleChange(event);
        this.setState({ users: event.target.value.length > 0 ? this.state.usersAux.filter(user => user.name.toUpperCase().includes(event.target.value.toUpperCase())) : this.state.usersAux })
    }

    render() {
        const { onlineUsers, users, name, email, phone, password, create, search, loading, redirect, error } = this.state;

        const columns = ([
            {
                width: '30px',
                selector: 'online',
                cell: row => onlineUsers[row.id.toString()] == true ? <CircleFillIconGreen /> : <CircleFillIconGrey />,
                center: true,
            },
            {
                name: 'Nome',
                selector: 'name',
            },
            {
                name: 'E-mail',
                selector: 'email',
            },
            {
                name: 'Telefone',
                selector: 'phone',
            },
            {
                width: '60px',
                selector: 'edit',
                cell: row => <ButtonRounded padding='10px' outlined='#1C4370' title={<PencilIcon />} click={() => this.handleOpenModal(row)} />,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
            {
                width: '60px',
                selector: 'remove',
                cell: row => <ButtonRounded padding='10px' outlined='#C1272D' title={<TrashIcon />} click={() => this.handleOpenConfirmationModal(row)} />,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            }
        ]);

        if (redirect) {
            return <Redirect to="/" />
        } else {
            return (
                <Container style={{ background: '#E1E1E1' }}>
                    <NavbarFixedTop />
                    <NavbarLeft />
                    <Content>
                        <Row>
                            <CardTitle>
                                <span>USUÁRIOS</span>
                                <Grow />
                                <Input type='text' placeholder='&#128269; Buscar' name='search' value={search} change={this.handleSearch} />
                                <ButtonRounded type='button' title={<PlusIcon />} color={'#5CB5E9'} click={() => this.handleOpenModal()} />
                            </CardTitle>
                        </Row>
                        <CardContainer>
                            {
                                loading ?
                                    <Spinner>
                                        <HashLoader css={override} size={100} color={"#1C4370"} loading={this.state.loading} speedMultiplier={1.5} />
                                    </Spinner>
                                    :
                                    <DataTable
                                        noHeader={true}
                                        columns={columns}
                                        data={users}
                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                        paginationPerPage={10}
                                        pagination={true}
                                        noDataComponent={''}
                                        customStyles={customStyles}
                                        style={{}} />
                            }
                        </CardContainer>
                    </Content>
                    <ReactModal
                        isOpen={this.state.showModal}
                        style={modalStyles}
                        contentLabel='USUÁRIO'
                        onRequestClose={this.handleCloseModal}>
                        <ModalHeader>
                            <ModalTitle>USUÁRIO</ModalTitle>
                            <ButtonRounded outlined='#1C4370' title={<CloseIcon />} click={this.handleCloseModal} />
                        </ModalHeader>
                        <ModalBody>
                            <Input type='text' placeholder='Nome' name='name' value={name} change={this.handleChange} required='required' />
                            <Input type='email' placeholder='E-mail' name='email' value={email} change={this.handleChange} required='required' />
                            <Input type='text' placeholder='Telefone' name='phone' value={phone} change={this.handleChange} required='required' />
                            {create && <Input type='password' placeholder='Senha' name='password' value={password} change={this.handleChange} required='required' />}
                            {error && <Error>E-mail já cadastrado.</Error>}
                            <PasswordInfo>* Senha será enviada por e-mail</PasswordInfo>
                            <ButtonRounded title='salvar' click={this.handleRequest} />
                        </ModalBody>
                    </ReactModal>
                    <ReactModal
                        isOpen={this.state.showConfirmationModal}
                        style={modalStyles}
                        contentLabel='Remover Usuário'
                        onRequestClose={this.handleCloseConfirmationModal}>
                        <ModalHeader>
                            <ModalTitle>Remover Usuário</ModalTitle>
                            <ButtonRounded outlined='#1C4370' title={<CloseIcon />} click={this.handleCloseConfirmationModal} />
                        </ModalHeader>
                        <ModalBody>
                            <h3>Você deseja realmente remover o usuário {name}</h3>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonRounded type='button' title='cancelar' outlined='#1C4370' click={this.handleCloseConfirmationModal} />
                            <ButtonRounded type='submit' title='remover' color='#C1272D' click={this.handleDelete} />
                        </ModalFooter>
                    </ReactModal>
                </Container>
            )
        }
    }
}