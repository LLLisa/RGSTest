import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const LOAD_USERS = 'LOAD_USERS';

//general store-----------------------------
export const genericLoader = (slice) => {
  return async (dispatch) => {
    const response = await axios({
      url: `/generic/${slice}`,
      baseURL: 'http://localhost:9001',
    });
    dispatch({ type: `LOAD_${slice}`, payload: response.data });
  };
};

const genericReducer = (slice) => {
  return (state = [], action) => {
    if (action.type === `LOAD_${slice}`) return action.payload;
    return state;
  };
};

const reducer = combineReducers({ users: genericReducer('users') });

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
