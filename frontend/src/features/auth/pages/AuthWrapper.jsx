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

  // Common state and handlers
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ general: "" });

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (cookies.jwt) {
      closeModal();
      navigate("/");
    }
  }, [cookies.jwt, navigate]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    html.style.overflowY = "hidden";

    return () => {
      html.style.overflowY = "auto";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const closeModal = useCallback(() => {
    dispatch({
      type:
        type === "login"
          ? reducerCases.TOGGLE_LOGIN_MODAL
          : reducerCases.TOGGLE_SIGNUP_MODAL,
      [type === "login" ? "showLoginModal" : "showSignupModal"]: false,
    });
  }, [type, dispatch]);

  const switchAuthType = () => {
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: type === "signup",
    });
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: type === "login",
    });
  };

  const clearAuthCookies = useCallback(() => {
    const cookieOptions = {
      path: "/",
      secure: !isDevelopment,
      sameSite: isDevelopment ? "lax" : "strict",
    };
    removeCookie("jwt", cookieOptions);
    removeCookie("jwt-refresh", cookieOptions);
  }, [removeCookie]);

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
          errors={errors}
          setErrors={setErrors}
          setLoading={setLoading}
          setCookie={setCookie}
          clearAuthCookies={clearAuthCookies}
          dispatch={dispatch}
          closeModal={closeModal}
          navigate={navigate}
        />
      ) : (
        <SignupForm
          loading={loading}
          errors={errors}
          setErrors={setErrors}
          setLoading={setLoading}
          clearAuthCookies={clearAuthCookies}
          closeModal={closeModal}
          navigate={navigate}
        />
      )}
    </AuthForm>
  );
}

export default AuthWrapper;
