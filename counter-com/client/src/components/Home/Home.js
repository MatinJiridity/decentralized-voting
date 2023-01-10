import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Form from '../Form/Form';
import { getUser } from '../../actions/auth';

const Home = () => {

  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const location = useLocation();
  const commited = useSelector((state)=> state.users.hasCommit)
  console.log(commited);

  useEffect(() => {
    dispatch(getUser(user?.result._id));
  }, [location])
  

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>

          {/* <Grid item xs={12} sm={4}> */}
          <Form   />
          {/* </Grid> */}
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
