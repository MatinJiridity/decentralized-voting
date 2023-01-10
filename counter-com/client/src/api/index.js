import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

// ... makes post request , 'hey database get me some data '
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const getUserInfo = (id) => API.get(`/user/${id}/userInfo`);

export const commit = (id, commitment) => API.patch(`/user/${id}/commit`, commitment);

