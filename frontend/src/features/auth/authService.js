import api from "./apiClient";
import * as ROUTES from "../../utils/constants";

export const login = async (credentials) => {
  return api.post(ROUTES.LOGIN_ROUTE, credentials);
};

export const register = async (userData) => {
  return api.post(ROUTES.SIGNUP_ROUTE, userData);
};

export const verifyEmail = async (key) => {
  return api.post(ROUTES.VERIFY_EMAIL_ROUTE, { key });
};

export const resendVerificationEmail = async (email) => {
  return api.post(ROUTES.RESEND_VERIFICATION_EMAIL_ROUTE, { email });
};

export const logout = async () => {
  return api.post(ROUTES.LOGGOUT_ROUTE);
};

export const requestPasswordReset = async (email) => {
  return api.post(ROUTES.REQUEST_PASSWORD_RESET_ROUTE, { email });
};

export const resetPassword = async (resetData) => {
  return api.post(ROUTES.RESET_PASSWORD_ROUTE, resetData);
};

export const googleLogin = async (accessToken) => {
  return api.post(ROUTES.GOOGLE_LOGIN_ROUTE, { access_token: accessToken });
};
