export const HOST = "http://127.0.0.1:8000";
export const API_URL = `${HOST}/api`;
export const IMAGES_URL = `${HOST}/uploads`;

export const AUTH_ROUTES = `${API_URL}/auth`;
export const GIG_ROUTES = `${API_URL}/gigs`;
export const ORDERS_ROUTES = `${API_URL}/orders`;
export const MESSAGES_ROUTES = `${API_URL}/messages`;
export const DASHBOARD_DATA_ROUTES = `${API_URL}/dashboard`;

// Authentication Routes
export const LOGIN_ROUTE = "/auth/login/";
export const TOKEN_REFRESH = "/auth/token/refresh/";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/registration/`;
export const LOGGOUT_ROUTE = `${AUTH_ROUTES}/logout/`;
export const REQUEST_PASSWORD_RESET_ROUTE = `${AUTH_ROUTES}/password/reset/`;
export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTES}/password/reset/confirm/`;
export const GOOGLE_LOGIN_ROUTE = `${AUTH_ROUTES}/google/`;

// User Management Routes
export const USER_PROFILE_ROUTE = `${AUTH_ROUTES}/user/`;

export const VERIFY_EMAIL_ROUTE = `${AUTH_ROUTES}/registration/verify-email/`;
export const RESEND_VERIFICATION_EMAIL_ROUTE = `${AUTH_ROUTES}/registration/resend-email/`;

// Seller Routes
export const SWITCH_ROLE_URL = "/accounts/user/switch-role/";
export const SELLER_DETAIL_URL = "/accounts/seller/profile/detail/";
export const SELLER_SETUP_URL = "/accounts/seller/profile/setup/";
export const BECOME_SELLER_URL = "/accounts/seller/become/";

// Gigs Routes
export const GET_ALL_CATEGORIES_URL = "/gigs/categories/";
export const GET_ALL_SUBCATEGORIES_URL = "/gigs/subcategories/";
export const GIG_ROUTE = "/gigs/";
export const GET_MY_GIGS_ROUTE = "/gigs/my-gigs";


export const GET_USER_INFO = `${AUTH_ROUTES}/user/`;
export const GET_BUYER_ORDERS_ROUTE = `${ORDERS_ROUTES}/get-buyer-orders`;
export const ADD_MESSAGE = `${MESSAGES_ROUTES}/add-message`;
export const GET_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
