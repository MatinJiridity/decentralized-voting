import { AUTH, COMMIT, FETCH_USER, IDENTITY } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    // ..when you dispatch signin action makes another call to api
    // ....got these data from database

    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
    alert('Somthing went wrong')
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const addCommitment = () => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  console.log(user);
  try {
    const { data } = await api.commit();

    dispatch({ type: COMMIT, payload:data })
  } catch (error) {
    console.log(error.message);
    alert('Register Certificate cereation failed')
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    const { data } = await api.getUserInfo(id);

    dispatch({ type: FETCH_USER, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};