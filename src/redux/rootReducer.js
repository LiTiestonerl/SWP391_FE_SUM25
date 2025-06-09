import { combineReducers } from "@reduxjs/toolkit";
import  useReducer  from "./features/userSlice";

const rootReducer = combineReducers({
    user: useReducer
})
export default rootReducer;