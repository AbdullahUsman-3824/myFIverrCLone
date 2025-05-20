import { reducerCases } from "./reducerCases";

// Load initial state from localStorage or use default
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");
    if (serializedState === null) {
      return {
        userInfo: undefined,
        showLoginModal: false,
        showSignupModal: false,
        isSeller: false,
        gigData: undefined,
        hasOrdered: false,
        reloadReviews: false,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return {
      userInfo: undefined,
      showLoginModal: false,
      showSignupModal: false,
      isSeller: false,
      gigData: undefined,
      hasOrdered: false,
      reloadReviews: false,
    };
  }
};

export const initialState = loadState();

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("appState", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

export const reducer = (state, action) => {
  let newState;

  switch (action.type) {
    case reducerCases.SET_USER:
      newState = {
        ...state,
        userInfo: action.userInfo,
      };
      break;
    case reducerCases.TOGGLE_LOGIN_MODAL:
      newState = {
        ...state,
        showLoginModal: action.showLoginModal,
      };
      break;
    case reducerCases.TOGGLE_SIGNUP_MODAL:
      newState = {
        ...state,
        showSignupModal: action.showSignupModal,
      };
      break;
    case reducerCases.CLOSE_AUTH_MODAL:
      newState = {
        ...state,
        showSignupModal: false,
        showLoginModal: false,
      };
      break;
    case reducerCases.SWITCH_MODE:
      newState = {
        ...state,
        isSeller: !state.isSeller,
      };
      break;
    case reducerCases.SET_GIG_DATA:
      newState = {
        ...state,
        gigData: action.gigData,
      };
      break;
    case reducerCases.HAS_USER_ORDERED_GIG:
      newState = {
        ...state,
        hasOrdered: action.hasOrdered,
      };
      break;
    case reducerCases.ADD_REVIEW:
      newState = {
        ...state,
        gigData: {
          ...state.gigData,
          reviews: [...state.gigData.reviews, action.newReview],
        },
      };
      break;
    default:
      return state;
  }

  // Save the new state to localStorage
  saveState(newState);
  return newState;
};
