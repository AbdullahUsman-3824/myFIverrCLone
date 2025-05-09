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

function AuthWrapper({ type }) {
  const [cookies, setCookie] = useCookies(["JWT"]);
  const [state, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const [values, setValues] = useState({
    email: "",
    ...(type === "signup"
      ? { password1: "", password2: "" }
      : { password: "" }),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // Auto-focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
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

  // Redirect if already logged in
  useEffect(() => {
    if (cookies.JWT) {
      closeModal();
      navigate("/dashboard");
    }
  }, [cookies, navigate, closeModal]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    const scrollY = window.scrollY; // Save current position
    const html = document.documentElement;
    html.style.overflowY = "hidden";

    return () => {
      html.style.overflowY = "auto";
      window.scrollTo(0, scrollY); // Restore position
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // Clear field-specific error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      email: "",
      password: "",
      password1: "",
      password2: "",
      general: "",
    });

    // Email validation
    if (!values.email) {
      return setErrors({ ...errors, email: "Email is required." });
    }

    // Signup-specific validation
    if (type === "signup") {
      if (!values.password1 || !values.password2) {
        return setErrors({
          ...errors,
          password1: !values.password1 ? "Password is required." : "",
          password2: !values.password2 ? "Please confirm password." : "",
        });
      }
      if (values.password1 !== values.password2) {
        return setErrors({
          ...errors,
          password2: "Passwords don't match.",
        });
      }
    }
    // Login validation
    else {
      if (!values.password) {
        return setErrors({ ...errors, password: "Password is required." });
      }
    }

    try {
      setLoading(true);
      const route = type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE;

      // Prepare data based on form type
      const requestData =
        type === "login"
          ? { email: values.email, password: values.password }
          : {
              email: values.email,
              password1: values.password1,
              password2: values.password2,
            };

      const { data } = await axios.post(route, requestData, {
        withCredentials: true,
      });

      // Set secure HTTP-only cookie
      setCookie("JWT", data.access, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      dispatch({ type: reducerCases.SET_USER, userInfo: data.user });
      closeModal();
      navigate("/profile");
    } catch (err) {
      if (err.response?.data) {
        const { data } = err.response;
        // Handle django-rest-auth error structure
        if (data.non_field_errors) {
          setErrors({ ...errors, general: data.non_field_errors[0] });
        } else {
          setErrors({
            email: data.email ? data.email[0] : "",
            password: data.password ? data.password[0] : "",
          });
        }
      } else {
        setErrors({ ...errors, general: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render password fields based on type
  const renderPasswordFields = () => {
    if (type === "signup") {
      return (
        <>
          <div>
            <input
              type="password"
              name="password1"
              placeholder="Password"
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
                type="email"
                name="email"
                placeholder="Email"
                className={`border ${
                  errors.email ? "border-red-500" : "border-slate-300"
                } p-3 rounded w-full`}
                onChange={handleChange}
                disabled={loading}
                ref={emailInputRef}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div>{renderPasswordFields()}</div>

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

// Extracted components for better readability
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

export default AuthWrapper;
