///
///  do vote compeletly and fill the result array and then test result box foreach


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Container, Link, Card, Grid, Grow, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core';
import CopyAllIcon from '@material-ui/icons/FileCopy'
import { useDispatch } from 'react-redux';
import { getUser } from '../../actions/auth';
import useStyles from './styles';
import { useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { generateProof, packToSolidityProof, verifyProof } from '@semaphore-protocol/proof';
import { ethers } from "ethers";
import getBlockchain from '../BlockChain/Contract';

const users = [];

const Form = () => {
  const [commit, setCommit] = useState(true);
  const [identity, setIdentity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [vote, setVote] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [contract, setContract] = useState(undefined);
  const firstOption = [];
  const secondOption = [];
  const [firstOptionLenght, setFirstOptionLenght] = useState();
  const [secondOptionLenght, setSecondOptionLenght] = useState();

  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const location = useLocation();

  const getUserInfo = async () => {
    const userData = await axios.get(
      `http://localhost:5000/user/${user?.result._id}/userInfo`
    );
    setLoading(false);
    // console.log(userData.data.hasCommit);
    return (userData);
  };


  const handleCommit = async (e) => {
    e.preventDefault();


    setIsDisabled(true);
    console.log(identity);

    const currentIdentity = new Identity(identity);
    // console.log(currentIdentity)
    const commitment = currentIdentity.commitment.toString();
    //  console.log(currentIdentity, commitment)
    setWaiting(true);
    const newData = await axios.patch(
      `http://localhost:5000/user/${user?.result._id}/commit`,
      { commitment: commitment }
    );
    setWaiting(false);

    return (newData);
  };

  const handleProof = async (e) => {
    e.preventDefault();

    const newData = await axios.get(
      `http://localhost:5000/user/group`,

    );

    console.log(newData)


  };

  const createIdentity = async () => {

    setIdentity(new Identity().toString());
  };

  const refresh = () => {
    window.location.reload();
  }

  const result = async () => {
    if(contract){
      console.log(contract)
      const currentResult = await contract.methods.getResult().call();
      console.log(typeof(currentResult), currentResult)
      if(currentResult) {
        for (let i = 0; i < currentResult.length; i++) {
          if (ethers.utils.formatBytes32String("1") === currentResult[i]) {
            firstOption.push(currentResult[i]);
          } else if(ethers.utils.formatBytes32String("2") === currentResult[i]) {
            secondOption.push(currentResult[i]);
          }       
        }
        console.log(firstOption.length);
        console.log(secondOption.length);
        setFirstOptionLenght(firstOption.length)
        setSecondOptionLenght(secondOption.length)
      }
    }
  }

  useEffect(() => {
    getUserInfo().then((response) => {
      setCommit(response.data.hasCommit);
      console.log(response.data);
    });
    const init = async () => {
      const { contract } = await getBlockchain();
      setContract(contract);
      console.log(contract)
    }
    init();
    createIdentity();
    result();

    console.log(commit);
    console.log(identity);

  }, [location, commit]);


  if (!user?.result?.name) {
    return (
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper}>
          <Typography variant="h6" align="center">
            Please Sign In to create your own Identity. Sign in then go to Identity and create your Identity and then commit that in there.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        {loading ? (
          <>
            loading...
          </>
        ) : (
          <>
            {commit ? (
              <div>
                <Typography variant="h6" align="left">
                  First Option Result: {firstOptionLenght}
                </Typography>
                <Typography variant="h6" align="left">
                  Second Option Result: {secondOptionLenght}
                </Typography>



                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit>
                  <Link href="#" variant='h5' underline="hover">Have Not Voted</Link>
                </form>
              </div>
            ) : (
              <div>
                <Typography variant="h6" align="left">
                  1. Register Certificate, in fact, is your ballot paper, in the next step of voting you need it so after creation keep it safely.                </Typography>
                <br />
                <br /><br />
                {!isDisabled ? (
                  <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleCommit}>
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Create Register Certificate </Button>
                  </form>
                ) : (
                  <div>
                    {waiting ? (
                      <Typography variant="h6" align="center">
                        ...pending
                      </Typography>
                    ) : (
                      <div>
                        <Card className={classes.card} >
                          <Typography variant="body2" color="textSecondary" component="p">{identity}</Typography>
                        </Card>
                        <CopyToClipboard text={identity}>
                          <Button size="small" color="primary" onClick>
                            <CopyAllIcon fontSize="small" /> Copy
                          </Button>
                        </CopyToClipboard>
                        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={refresh}>
                          <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>next</Button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Form;


