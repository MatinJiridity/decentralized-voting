import * as actionType from '../constants/actionTypes';

// in reducer we add logic for our actions
// Reducers: (they accept state(here is authData by default is null) and action)
// when we have a lot of if hook like if(action.type === FETCH_ALL) use switch syntax

const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case actionType.AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));

      return { ...state, authData: action.data, loading: false, errors: null };
    case actionType.LOGOUT:
      localStorage.clear();

      return { ...state, authData: null, loading: false, errors: null };


    default:
      return state;
  }
};

export default authReducer;
