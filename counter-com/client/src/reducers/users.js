import * as actionType from '../constants/actionTypes';

const usersReducer = (usres = [], action) => {
    switch (action.type) {
        case actionType.FETCH_USER:
            return action.payload;
        case actionType.COMMIT:
            return action.payload;
        default:
            return usres;
    }
};

export default usersReducer;
