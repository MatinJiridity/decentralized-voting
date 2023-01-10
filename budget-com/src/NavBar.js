import React, { useEffect, useState } from "react";

import { Avatar, Link, Typography, Box, Button, AppBar, Card, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from "@material-ui/core";
import Web3 from "web3";
import voting from './images/voting.png';
import useStyles from './styles';

const ConnectMetamask = ({ accounts, setAccounts, setIsConnected }) => {
    const isConnected = Boolean(accounts[0]);
    const classes = useStyles();

    async function connectAccount() {

        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            const { ethereum } = window;
            await ethereum.request({ method: "eth_requestAccounts" }).then(function (account) {
                setAccounts(account)
                setIsConnected(true)
            });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            setIsConnected(true)
        } else {
            window.alert(" Non-Ethereum browser detected")
        }
    }

    return (
        <>
            <Container maxWidth="lg">
                <AppBar className={classes.appBar} position="static" color="inherit">
                    <div className={classes.brandContainer}>
                        <Typography className={classes.heading} variant="h4" align="center">DeVoting</Typography>
                    </div>
                    <Toolbar className={classes.toolbar}>

                        <Typography  variant="h6" align="right" noWrap >
                            {isConnected ? (accounts) : (<Button color="primary" variant="contained" onClick={connectAccount}>Connect to Metamask</Button>)}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Container>
        </>
    )
}

export default ConnectMetamask;

