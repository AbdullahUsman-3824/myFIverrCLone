import { useCookies } from "react-cookie";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/reducerCases";
import AuthForm from "../components/AuthForm";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const isDevelopment = process.env.NODE_ENV === "development";

function AuthWrapper({ type }) {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "jwt-refresh"]);
  const [state, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ general: "" });

  // Common handlers
  const closeModal = useCallback(() => {
    dispatch({
      type: type === "login" 
        ? reducerCases.TOGGLE_LOGIN_MODAL 
        : reducerCases.TOGGLE_SIGNUP_MODAL,
      [type === "login" ? "showLoginModal" : "showSignupModal"]: false,
    });
  }, [type, dispatch]);

  const switchAuthType = useCallback(() => {
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: type === "signup",
    });
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: type === "login",
    });
  }, [type, dispatch]);

  const clearAuthCookies = useCallback(() => {
    const cookieOptions = {
      path: "/",
      secure: !isDevelopment,
      sameSite: isDevelopment ? "lax" : "strict",
    };
    removeCookie("jwt", cookieOptions);
    removeCookie("jwt-refresh", cookieOptions);
  }, [removeCookie]);

  // Effects
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cookies.jwt) {
      closeModal();
      navigate("/");
    }
  }, [cookies.jwt, navigate, closeModal]);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.documentElement.style.overflowY = "auto";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <AuthForm
      type={type}
      loading={loading}
      errors={errors}
      onClose={closeModal}
      onSwitchType={switchAuthType}
      emailInputRef={emailInputRef}
    >
      {type === "login" ? (
        <LoginForm
          loading={loading}
          setLoading={setLoading}
          errors={errors}
          setErrors={setErrors}
          setCookie={setCookie}
          clearAuthCookies={clearAuthCookies}
          dispatch={dispatch}
          closeModal={closeModal}
          navigate={navigate}
        />
      ) : (
        <SignupForm
          loading={loading}
          setLoading={setLoading}
          errors={errors}
          setErrors={setErrors}
          clearAuthCookies={clearAuthCookies}
          closeModal={closeModal}
          navigate={navigate}
        />
      )}
    </AuthForm>
  );
}

export default AuthWrapper;