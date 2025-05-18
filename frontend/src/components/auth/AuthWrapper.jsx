import { useCookies } from "react-cookie";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constants";
import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";

const isDevelopment = process.env.NODE_ENV === "development";

// Extracted components
const SocialAuthButton = ({
  icon: Icon,
  text,
  bgColor = "",
  textColor = "",
  border = "",
}) => (
  <button
    type="button"
    className={`${bgColor} ${textColor} ${border} p-3 font-medium flex items-center justify-center relative`}
  >
    <Icon className="absolute left-4 text-2xl" />
    {text}
  </button>
);

const AuthDivider = () => (
  <div className="relative w-full text-center my-4">
    <div className="border-t border-slate-300 w-full absolute top-1/2 left-0 transform -translate-y-1/2"></div>
    <span className="bg-white relative z-10 px-2 text-sm">OR</span>
  </div>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

function AuthWrapper({ type }) {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "jwt-refresh"]);
  const [state, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  // Initialize all possible fields with empty strings
  const [values, setValues] = useState({
    email: "",
    password1: "",
    password2: "",
    login_identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password1: "",
    password2: "",
    login_identifier: "",
    password: "",
    general: "",
  });

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (cookies.jwt) {
      closeModal();
      navigate("/dashboard");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value || "" }); // Ensure no undefined values
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const clearAuthCookies = useCallback(() => {
    const cookieOptions = {
      path: "/",
      secure: !isDevelopment,
      sameSite: isDevelopment ? "lax" : "strict",
    };

    removeCookie("jwt", cookieOptions);
    removeCookie("jwt-refresh", cookieOptions);

    const expires = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `jwt=; expires=${expires}; path=/; ${
      !isDevelopment ? "secure;" : ""
    } samesite=${cookieOptions.sameSite}`;
    document.cookie = `jwt-refresh=; expires=${expires}; path=/; ${
      !isDevelopment ? "secure;" : ""
    } samesite=${cookieOptions.sameSite}`;
  }, [removeCookie]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resetErrors = {
      email: "",
      password1: "",
      password2: "",
      login_identifier: "",
      password: "",
      general: "",
    };
    setErrors(resetErrors);

    if (type === "signup") {
      if (!values.email) {
        return setErrors((prev) => ({
          ...prev,
          email: "This field is required.",
        }));
      }
      if (!values.password1 || !values.password2) {
        return setErrors((prev) => ({
          ...prev,
          password1: !values.password1 ? "Password is required." : "",
          password2: !values.password2 ? "Please confirm password." : "",
        }));
      }
      if (values.password1 !== values.password2) {
        return setErrors((prev) => ({
          ...prev,
          password2: "Passwords don't match.",
        }));
      }
    } else {
      if (!values.login_identifier) {
        return setErrors((prev) => ({
          ...prev,
          login_identifier: "This field is required.",
        }));
      }
      if (!values.password) {
        return setErrors((prev) => ({
          ...prev,
          password: "Password is required.",
        }));
      }
    }

    try {
      setLoading(true);
      const route = type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE;
      const requestData =
        type === "login"
          ? {
              login_identifier: values.login_identifier,
              password: values.password,
            }
          : {
              email: values.email,
              password1: values.password1,
              password2: values.password2,
            };

      const { data } = await axios.post(route, requestData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (type === "signup") {
        // For registration, redirect to email verification page
        closeModal();
        navigate("/verify-email", {
          state: { email: values.email },
          replace: true,
        });
      } else {
        // For login, handle as before
        if (data.access) {
          setCookie("jwt", data.access, {
            path: "/",
            secure: !isDevelopment,
            sameSite: isDevelopment ? "lax" : "strict",
          });
        }

        dispatch({ type: reducerCases.SET_USER, userInfo: data.user });
        closeModal();
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data) {
        const { data } = err.response;
        setErrors({
          login_identifier:
            type === "login"
              ? data.login_identifier?.[0] ??
                data.username?.[0] ??
                data.email?.[0] ??
                ""
              : "",
          email: type === "signup" ? data.email?.[0] || "" : "",
          password: data.password?.[0] || "",
          password1: data.password1?.[0] || "",
          password2: data.password2?.[0] || "",
          general: data.non_field_errors?.[0] || "",
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "An unexpected error occurred.",
        }));
      }
      clearAuthCookies();
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordFields = () => {
    if (type === "signup") {
      return (
        <>
          <div>
            <input
              type="password"
              name="password1"
              placeholder="Password"
              value={values.password1 || ""}
              className={`border ${
                errors.password1 ? "border-red-500" : "border-slate-300"
              } p-3 rounded w-full`}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password1 && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password1}
              </span>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={values.password2 || ""}
              className={`border ${
                errors.password2 ? "border-red-500" : "border-slate-300"
              } p-3 rounded w-full`}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password2 && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password2}
              </span>
            )}
          </div>
        </>
      );
    }
    return (
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password || ""}
          className={`border ${
            errors.password ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password}</span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed top-0 left-0 z-[100] h-screen w-screen">
      <div
        className="fixed inset-0 backdrop-blur-md"
        onClick={closeModal}
      ></div>
      <div className="h-full w-full flex justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg shadow-lg z-[101] relative w-96"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
            disabled={loading}
          >
            <FiX className="text-xl text-gray-500" />
          </button>

          <h3 className="text-2xl font-semibold text-center mb-6">
            {type === "login" ? "Login to Fiverr" : "Sign up to Fiverr"}
          </h3>

          <div className="flex flex-col gap-4 mb-4">
            <SocialAuthButton
              icon={MdFacebook}
              text="Continue with Facebook"
              bgColor="bg-blue-500"
              textColor="text-white"
            />
            <SocialAuthButton
              icon={FcGoogle}
              text="Continue with Google"
              border="border border-slate-300"
            />
          </div>

          <AuthDivider />

          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                name={type === "login" ? "login_identifier" : "email"}
                placeholder={type === "login" ? "Email or Username" : "Email"}
                value={
                  (type === "login" ? values.login_identifier : values.email) ||
                  ""
                }
                className={`border ${
                  (type === "login" ? errors.login_identifier : errors.email)
                    ? "border-red-500"
                    : "border-slate-300"
                } p-3 rounded w-full`}
                onChange={handleChange}
                disabled={loading}
                ref={emailInputRef}
              />
              {(type === "login" ? errors.login_identifier : errors.email) && (
                <span className="text-red-500 text-xs mt-1">
                  {type === "login" ? errors.login_identifier : errors.email}
                </span>
              )}
            </div>

            {renderPasswordFields()}

            {errors.general && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              className="bg-[#1DBF73] text-white p-3 font-semibold rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Processing...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <div className="mt-6 text-sm text-center">
            {type === "login" ? (
              <>
                Not a member?{" "}
                <button
                  type="button"
                  onClick={switchAuthType}
                  className="text-[#1DBF73] cursor-pointer font-medium"
                  disabled={loading}
                >
                  Join Now
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  onClick={switchAuthType}
                  className="text-[#1DBF73] cursor-pointer font-medium"
                  disabled={loading}
                >
                  Login Now
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthWrapper;
