

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Container } from '@material-ui/core';
import CircularProgress from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getUser } from '../../actions/auth';
import useStyles from './styles';
import { useLocation } from 'react-router-dom';


const Form = () => {
  const [commit, setCommit] = useState(true)
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const location = useLocation();

  const getUserInfo = async () => {
    const userData = await axios.get(
      `http://localhost:5000/user/${user?.result._id}/userInfo`
    );
    // console.log(userData.data.hasCommit);
    return (userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  useEffect(async () => {
    await getUserInfo().then((response) => {
      setCommit(response.data.hasCommit);
      console.log(response.data);
    });
    console.log(commit);

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
        {commit ? (
          <Typography variant="h6" align="center">
            You have commited
          </Typography>
        ) : (
          <Typography variant="h6" align="center">
            Please Commit your Identity
          </Typography>
        )}
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
          <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Form;

