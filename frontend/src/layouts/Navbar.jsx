import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useCookies } from "react-cookie";
import FiverrLogo from "../components/shared/FiverrLogo";
import ContextMenu from "../features/auth/components/ContextMenu";
import { useStateProvider } from "../context/StateContext";
import {
  setUser,
  toggleLoginModal,
  toggleSignupModal,
} from "../context/StateReducer";
import { reducerCases } from "../context/reducerCases";
import { HOST } from "../utils/constants";
import useFetchUser from "../hooks/useFetchUser";
import useAuth from "../features/auth/hooks/useAuth";
import axios from "axios";

function Navbar() {
  // Hooks and state
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const location = useLocation();
  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider();

  const [navFixed, setNavFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { logout } = useAuth();

  // User data fetching
  const shouldFetchUser = Boolean(cookies.jwt) && !userInfo;
  const { user, loading } = useFetchUser(shouldFetchUser);

  // Effects
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
          dispatch(setUser(projectedUserInfo));
        } catch (err) {
          console.error("Error processing user data:", err);
        }
      }
      setIsLoaded(true);
    };

    handleUserData();
  }, [shouldFetchUser, user, userInfo, loading, dispatch, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setNavFixed(location.pathname !== "/" || window.scrollY > 0);
    };

    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setNavFixed(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const closeContextMenu = (e) => {
      if (isContextMenuVisible) {
        e.stopPropagation();
        setIsContextMenuVisible(false);
      }
    };

    window.addEventListener("click", closeContextMenu);
    return () => window.removeEventListener("click", closeContextMenu);
  }, [isContextMenuVisible]);

  // Handlers
  const handleLogin = useCallback(() => {
    if (showSignupModal) {
      dispatch(toggleSignupModal(false));
    }
    dispatch(toggleLoginModal(true));
  }, [dispatch, showSignupModal]);

  const handleSignup = useCallback(() => {
    if (showLoginModal) {
      dispatch(toggleLoginModal(false));
    }
    dispatch(toggleSignupModal(true));
  }, [dispatch, showLoginModal]);

  const handleOrdersNavigate = useCallback(() => {
    navigate(isSeller ? "/seller/orders" : "/buyer/orders");
  }, [isSeller, navigate]);

  const handleModeSwitch = useCallback(async () => {
    try {
      setIsSwitchingMode(true); // Add loading state if needed
      const response = await axios.post(
        `${HOST}/api/accounts/switch-mode`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt}`, // Assuming you have access to cookies
          },
        }
      );
      dispatch(setUser(response.data.user));

      // Clear any errors if successful
      setModeSwitchError(null);

      // Navigate to the appropriate dashboard
      navigate(isSeller ? "/buyer" : "/seller");
    } catch (err) {
      console.error("Mode switch failed:", err);

      // Handle different error cases
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to switch modes. Please try again.";

      setModeSwitchError(errorMessage);

      // If unauthorized, consider redirecting to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSwitchingMode(false); // Reset loading state
    }
  }, [dispatch, isSeller, navigate, cookies.jwt]); // Add all dependencies

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  }, [navigate, searchQuery]);

  // Constants
  const searchBarVisible = navFixed || userInfo;
  const navClass = `w-full px-24 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
    navFixed || userInfo
      ? "fixed bg-white border-b border-gray-200"
      : "absolute bg-transparent"
  }`;

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
      callback: async (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        // navigate("/logout");
        await logout();
      },
    },
  ];

  const authButtons = [
    { name: "English", handler: "#", type: "link" },
    { name: "Sign in", handler: handleLogin, type: "button" },
    { name: "Join", handler: handleSignup, type: "button2" },
  ];

  // Render
  if (!isLoaded) return null;

  return (
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-[30rem] py-2.5 px-4 border"
        />
        <button
          className="bg-gray-900 py-1.5 text-white w-16 flex justify-center items-center"
          onClick={handleSearch}
        >
          <IoSearchOutline className="h-6 w-6" />
        </button>
      </div>

      {!userInfo ? (
        <ul className="flex gap-10 items-center">
          {authButtons.map(({ name, handler, type }) => (
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
          <li className="cursor-pointer font-medium" onClick={handleModeSwitch}>
            Switch To {isSeller ? "Buyer" : "Seller"}
          </li>
          <li
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsContextMenuVisible(true);
            }}
          >
            {userInfo?.profile_picture ? (
              <img
                src={userInfo.profile_picture}
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
  );
}

export default Navbar;
