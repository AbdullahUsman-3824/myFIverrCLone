// context/statecontext.js
import { createContext, useContext, useReducer } from "react";

// Define initial state
const initialState = {
  showLoginModal: false,
  showSignupModal: false,
  isSeller: false,
  userInfo: null,
};

// Define the action types
export const reducerCases = {
  SET_USER: "SET_USER",
  TOGGLE_LOGIN_MODAL: "TOGGLE_LOGIN_MODAL",
  TOGGLE_SIGNUP_MODAL: "TOGGLE_SIGNUP_MODAL",
  SWITCH_MODE: "SWITCH_MODE",
};

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER:
      return { ...state, userInfo: action.userInfo };
    case reducerCases.TOGGLE_LOGIN_MODAL:
      return { ...state, showLoginModal: action.showLoginModal };
    case reducerCases.TOGGLE_SIGNUP_MODAL:
      return { ...state, showSignupModal: action.showSignupModal };
    case reducerCases.SWITCH_MODE:
      return { ...state, isSeller: !state.isSeller };
    default:
      return state;
  }
};

// Create a context
export const StateContext = createContext();

// StateProvider component to wrap the app
export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Custom hook to access the context value
export const useStateProvider = () => useContext(StateContext);
