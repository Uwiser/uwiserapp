import React from 'react'
import styled from 'styled-components'
import { css } from '@emotion/react'
import HashLoader from 'react-spinners/HashLoader'
import axios from 'axios'
import NavbarFixedTop from '../components/NavbarFixedTop'

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
    padding: 124px 50px 50px;
`;

const CardTitle = styled.div`
    font-size: 24px;
    text-align: left;
    line-height: 2rem;
    font-family: 'Roboto', sans-serif;
    padding: 20px;
    background-color: #1C4370;
    border-color: #1C4370;
    border-radius: 6px;
    color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
`;

const CardContainer = styled.div`
    display: flex;
    background-color: #fff;
    border-radius: 4px;
    margin-top: 40px;
    padding: 20px;
    align-items: flex-end;
    flex-wrap: wrap;
`;

const InputLabel = styled.span`
    margin-left: 10px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const GreenLabel = styled.span`
    font-size: 22px;
    font-weight: bold;
    color: #026B0D;
`;

const Row = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 40px 0;
`;

const Spinner = styled.div`
    display: flex;
    justify-content: center;
    margin: 40px 0;
`;

export default class EnabledScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            user: '',
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.handleGet();
    }

    handleGet = () => {
        var URL = `${process.env.REACT_APP_API_URL}/users/enabled/${this.state.id}`;

        axios.get(URL)
            .then(res => {
                console.log(res.data)
                this.setState({
                    user: res.data,
                    loading: false,
                });
            }).catch(err => {
                this.setState({ loading: false });
                console.log(err)
            });
    }

    render() {
        const { loading } = this.state;

        return (
            <Container style={{ background: '#E1E1E1' }}>
                <NavbarFixedTop />
                <Content>
                    <CardContainer>
                        {
                            loading ?
                                <Row>
                                    <Spinner>
                                        <HashLoader css={override} size={100} color={"#1C4370"} loading={this.state.loading} speedMultiplier={1.5} />
                                    </Spinner>
                                </Row>
                                :
                                <Row>
                                    <GreenLabel>{this.state.user.name}, sua conta foi ativada com sucesso!</GreenLabel>
                                </Row>
                        }
                    </CardContainer>
                </Content>
            </Container>
        )
    }
}