import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

// import GeneralStore from 'redux-general-store';
import GeneralStore from "/home/lisa/Code/recreational-code/ReduxGeneralStore/package/index.js";

export const GS = new GeneralStore("http://localhost:9001", [
  "users",
  "accounts",
  "files",
]);

const reducer = combineReducers({
  /**place non-generic reducers here */ ...GS.reducerBody,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

//Note that no other reducers are linked here. A fully-functional redux store
//that's less than 20 lines, unreal.
