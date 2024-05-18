import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    
});

const store = configureStore({
    reducer: rootReducer
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;