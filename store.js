import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

import GeneralStore from '/home/lisa/Code/recreational-code/ReduxGeneralStore/index.js';
// console.log(GeneralStore);

const GS = new GeneralStore('http://localhost:9001', [
  'users',
  'accounts',
  'files',
]);
console.log(GS.reducerBody);

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

const reducer = combineReducers({ ...GS.reducerBody });

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
