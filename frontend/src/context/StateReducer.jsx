import { produce } from "immer";
import { reducerCases } from "./reducerCases";

// Default state
const defaultState = {
  userInfo: undefined,
  sellerInfo: undefined,
  showLoginModal: false,
  showSignupModal: false,
  currentRole: "buyer",
  gigData: undefined,
  hasOrdered: false,
  reloadReviews: false,
};

// Load initial state from localStorage or use default
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");
    return serializedState ? JSON.parse(serializedState) : defaultState;
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return defaultState;
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

// Action creators
export const setUser = (userInfo) => ({
  type: reducerCases.SET_USER,
  userInfo,
});
export const setSellerInfo = (sellerInfo) => ({
  type: reducerCases.SET_SELLER_INFO,
  sellerInfo,
});
export const toggleLoginModal = (showLoginModal) => ({
  type: reducerCases.TOGGLE_LOGIN_MODAL,
  showLoginModal,
});
export const toggleSignupModal = (showSignupModal) => ({
  type: reducerCases.TOGGLE_SIGNUP_MODAL,
  showSignupModal,
});
export const closeAuthModal = () => ({ type: reducerCases.CLOSE_AUTH_MODAL });
export const switchMode = () => ({ type: reducerCases.SWITCH_MODE });
export const setGigData = (gigData) => ({
  type: reducerCases.SET_GIG_DATA,
  gigData,
});
export const hasUserOrderedGig = (hasOrdered) => ({
  type: reducerCases.HAS_USER_ORDERED_GIG,
  hasOrdered,
});
export const addReview = (newReview) => ({
  type: reducerCases.ADD_REVIEW,
  newReview,
});

export const reducer = (state, action) => {
  const newState = produce(state, (draft) => {
    switch (action.type) {
      case reducerCases.SET_USER:
        draft.userInfo = action.userInfo;
        break;
      case reducerCases.SET_SELLER_INFO:
        draft.sellerInfo = action.sellerInfo;
        break;
      case reducerCases.TOGGLE_LOGIN_MODAL:
        draft.showLoginModal = action.showLoginModal;
        break;
      case reducerCases.TOGGLE_SIGNUP_MODAL:
        draft.showSignupModal = action.showSignupModal;
        break;
      case reducerCases.CLOSE_AUTH_MODAL:
        draft.showSignupModal = false;
        draft.showLoginModal = false;
        break;
      case reducerCases.SWITCH_MODE:
        draft.currentRole = draft.currentRole === "buyer" ? "seller" : "buyer";
        break;
      case reducerCases.SET_GIG_DATA:
        draft.gigData = action.gigData;
        break;
      case reducerCases.HAS_USER_ORDERED_GIG:
        draft.hasOrdered = action.hasOrdered;
        break;
      case reducerCases.ADD_REVIEW:
        draft.gigData.reviews = [
          ...(draft.gigData.reviews || []),
          action.newReview,
        ];
        break;
      default:
        return state;
    }
  });

  // Save the new state to localStorage
  saveState(newState);
  return newState;
};
