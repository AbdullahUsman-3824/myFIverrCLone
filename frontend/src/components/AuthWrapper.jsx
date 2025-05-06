import { useCookies } from "react-cookie";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../context/statecontext";
import { reducerCases } from "../context/constants";

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useStateProvider();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: "", password: "" });

  const handleClose = useCallback(() => {
    if (type === "login") {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false
      });
    } else {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false
      });
    }
  }, [type, dispatch]);

  useEffect(() => {
    if (cookies.jwt) {
      handleClose();
      navigate("/dashboard");
    }
  }, [cookies, navigate, handleClose]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    
    dispatch({ type: reducerCases.SET_USER});
    navigate("/profile");
    try {
      const { email, password } = values;
      if (email && password) {
        const {
          data: { user, jwt },
        } = await axios.post(
          type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        setCookies("jwt", { jwt: jwt });
        handleClose();

        if (user) {
            navigate("/profile");
          dispatch({ type: reducerCases.SET_USER, userInfo: user });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.overflowY = "hidden";
    }

    return () => {
      if (html) {
        html.style.overflowY = "initial";
      }
    };
  }, []);

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        onClick={handleClose}
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] h-max w-max bg-white flex flex-col justify-center items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col justify-center items-center p-8 gap-7 relative">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6 text-gray-500" />
            </button>
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Login" : "Sign in"} to Fiverr
            </h3>
            <div className="flex flex-col gap-5">
              <button className="text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <MdFacebook className="absolute left-4 text-2xl" />
                Continue with Facebook
              </button>
              <button className="border border-slate-300 p-3 font-medium w-80 flex items-center justify-center relative">
                <FcGoogle className="absolute left-4 text-2xl" />
                Continue with Google
              </button>
            </div>
            <div className="relative w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="email"
                placeholder="Email / Username"
                className="border border-slate-300 p-3 w-80"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-slate-300 p-3 w-80"
                name="password"
                onChange={handleChange}
              />
              <button
                className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
                onClick={handleClick}
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: true,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: false,
                      });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: false,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: true,
                      });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;