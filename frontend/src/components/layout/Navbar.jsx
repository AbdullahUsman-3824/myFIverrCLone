import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useCookies } from "react-cookie";

import FiverrLogo from "../auth/FiverrLogo";
import ContextMenu from "../auth/ContextMenu";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";
import { GET_USER_INFO, HOST } from "../../utils/constants";
import useFetchUser from "../../hooks/useFetchUser";

function Navbar() {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const location = useLocation();

  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider();

  const [navFixed, setNavFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Only fetch user data if we have a JWT and no user info
  const shouldFetchUser = Boolean(cookies.JWT) && !userInfo;
  const { user, loading, error } = useFetchUser(shouldFetchUser);

  useEffect(() => {
    const handleUserData = async () => {
      if (loading) {
        setIsLoaded(false);
        return;
      }

      if (shouldFetchUser && user && !userInfo) {
        try {
          let projectedUserInfo = { ...user };
          if (user?.image) {
            projectedUserInfo.imageName = `${HOST}/${user.image}`;
          }
          delete projectedUserInfo.image;
          dispatch({
            type: reducerCases.SET_USER,
            userInfo: projectedUserInfo,
          });

          if (!user.isProfileSet) {
            navigate("/profile");
          }
        } catch (err) {
          console.error("Error processing user data:", err);
        }
      }

      setIsLoaded(true);
    };

    handleUserData();
  }, [shouldFetchUser, user, userInfo, loading, error, dispatch, navigate]);

  // Auth buttons
  const handleLogin = () => {
    if (showSignupModal)
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  };

  const handleSignup = () => {
    if (showLoginModal)
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  // Fix navbar on scroll or on routes other than "/"
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setNavFixed(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setNavFixed(true);
    }
  }, [location.pathname]);

  const handleOrdersNavigate = () => {
    navigate(isSeller ? "/seller/orders" : "/buyer/orders");
  };

  const handleModeSwitch = () => {
    dispatch({ type: reducerCases.SWITCH_MODE });
    navigate(isSeller ? "/buyer/orders" : "/seller");
  };

  // Hide context menu on outside click
  useEffect(() => {
    const closeContextMenu = (e) => {
      e.stopPropagation();
      setIsContextMenuVisible(false);
    };

    if (isContextMenuVisible) {
      window.addEventListener("click", closeContextMenu);
      return () => window.removeEventListener("click", closeContextMenu);
    }
  }, [isContextMenuVisible]);

  const ContextMenuData = [
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        navigate("/profile");
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        navigate("/logout");
      },
    },
  ];

  const searchBarVisible = navFixed || userInfo;
  const navClass = `w-full px-24 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
    navFixed || userInfo
      ? "fixed bg-white border-b border-gray-200"
      : "absolute bg-transparent"
  }`;

  return (
    isLoaded && (
      <nav className={navClass}>
        <Link to="/">
          <FiverrLogo
            fillColor={!navFixed && !userInfo ? "#ffffff" : "#404145"}
          />
        </Link>

        <div
          className={`flex ${
            searchBarVisible ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <input
            type="text"
            placeholder="What service are you looking for today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[30rem] py-2.5 px-4 border"
          />
          <button
            className="bg-gray-900 py-1.5 text-white w-16 flex justify-center items-center"
            onClick={() => {
              navigate(`/search?q=${searchQuery}`);
              setSearchQuery("");
            }}
          >
            <IoSearchOutline className="h-6 w-6" />
          </button>
        </div>

        {!userInfo ? (
          <ul className="flex gap-10 items-center">
            {[
              { name: "English", handler: "#", type: "link" },
              { name: "Become a Seller", handler: "#", type: "link" },
              { name: "Sign in", handler: handleLogin, type: "button" },
              { name: "Join", handler: handleSignup, type: "button2" },
            ].map(({ name, handler, type }) => (
              <li
                key={name}
                className={`${
                  navFixed ? "text-black" : "text-white"
                } font-medium`}
              >
                {type === "link" && <Link to={handler}>{name}</Link>}
                {type === "button" && <button onClick={handler}>{name}</button>}
                {type === "button2" && (
                  <button
                    onClick={handler}
                    className={`border py-1 px-3 rounded-sm font-semibold ${
                      navFixed
                        ? "text-[#1DBF73] border-[#1DBF73]"
                        : "text-white border-white"
                    } hover:bg-[#1DBF73] hover:text-white transition-all duration-500`}
                  >
                    {name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex gap-10 items-center">
            {isSeller && (
              <li
                className="cursor-pointer text-[#1DBF73] font-medium"
                onClick={() => navigate("/seller/gigs/create")}
              >
                Create Gig
              </li>
            )}
            <li
              className="cursor-pointer text-[#1DBF73] font-medium"
              onClick={handleOrdersNavigate}
            >
              Orders
            </li>
            <li
              className="cursor-pointer font-medium"
              onClick={handleModeSwitch}
            >
              Switch To {isSeller ? "Buyer" : "Seller"}
            </li>
            <li
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsContextMenuVisible(true);
              }}
            >
              {userInfo?.imageName ? (
                <img
                  src={userInfo.imageName}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-green-500 h-10 w-10 flex items-center justify-center rounded-full">
                  <span className="text-xl text-white">
                    {userInfo?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </li>
          </ul>
        )}
        {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
      </nav>
    )
  );
}

export default Navbar;
