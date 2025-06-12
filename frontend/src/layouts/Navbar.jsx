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
import { HOST } from "../utils/constants";
import useSwitchUserMode from "../features/profiles/hooks/useSwitchUserMode";
import useFetchUser from "../features/profiles/hooks/useFetchUser";
import useAuth from "../features/auth/hooks/useAuth";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

const AuthButtons = ({ authButtons, navFixed }) => (
  <ul className="flex gap-10 items-center">
    {authButtons.map(({ name, handler, type }) => (
      <li
        key={name}
        className={`${navFixed ? "text-black" : "text-white"} font-medium`}
      >
        {type === "link" ? (
          <Link to={handler}>{name}</Link>
        ) : (
          <button
            onClick={handler}
            className={
              type === "button2"
                ? `border py-1 px-3 rounded-sm font-semibold ${
                    navFixed
                      ? "text-[#1DBF73] border-[#1DBF73]"
                      : "text-white border-white"
                  } hover:bg-[#1DBF73] hover:text-white transition-all duration-500`
                : ""
            }
          >
            {name}
          </button>
        )}
      </li>
    ))}
  </ul>
);

const UserMenu = ({
  userInfo,
  handleOrdersNavigate,
  switchMode,
  switchLoading,
  currentRole,
  setIsContextMenuVisible,
  navigate,
}) => (
  <ul className="flex gap-10 items-center">
    {userInfo?.is_seller && currentRole === "seller" && (
      <>
        <li
          className="cursor-pointer text-[#1DBF73] font-medium"
          onClick={() => navigate("/seller")}
        >
          Dashboard
        </li>
        <li
          className="cursor-pointer text-[#1DBF73] font-medium"
          onClick={() => navigate("/seller/gigs/create")}
        >
          Create Gig
        </li>
      </>
    )}

    {currentRole === "buyer" && (
      <li
        className="cursor-pointer text-[#1DBF73] font-medium"
        onClick={() => navigate("/buyer")}
      >
        Dashboard
      </li>
    )}

    <li
      className="cursor-pointer text-[#1DBF73] font-medium"
      onClick={handleOrdersNavigate}
    >
      Orders
    </li>
    <li
      className={`cursor-pointer font-medium ${
        switchLoading ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={switchMode}
    >
      {!userInfo?.is_seller
        ? "Become a Seller"
        : currentRole === "buyer"
        ? "Switch to Seller"
        : "Switch to Buyer"}
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
);

function Navbar() {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [{ showLoginModal, showSignupModal, currentRole, userInfo }, dispatch] =
    useStateProvider();
  const { switchMode, loading: switchLoading } = useSwitchUserMode();

  const [navFixed, setNavFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isTokenValid = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000;
    } catch (err) {
      return false;
    }
  };

  const shouldFetchUser = isTokenValid() && !userInfo;
  const { user, loading } = useFetchUser(shouldFetchUser);

  useEffect(() => {
    if (loading) {
      setIsLoaded(false);
      return;
    }

    if (shouldFetchUser && user && !userInfo) {
      const projectedUserInfo = {
        ...user,
        imageName: user?.image ? `${HOST}/${user.image}` : undefined,
      };
      delete projectedUserInfo.image;
      dispatch(setUser(projectedUserInfo));
    }
    setIsLoaded(true);
  }, [shouldFetchUser, user, userInfo, loading, dispatch]);

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

  const handleLogin = useCallback(() => {
    if (showSignupModal) dispatch(toggleSignupModal(false));
    dispatch(toggleLoginModal(true));
  }, [dispatch, showSignupModal]);

  const handleSignup = useCallback(() => {
    if (showLoginModal) dispatch(toggleLoginModal(false));
    dispatch(toggleSignupModal(true));
  }, [dispatch, showLoginModal]);

  const handleLogout = useCallback(
    async (e) => {
      e.stopPropagation();
      setIsContextMenuVisible(false);
      try {
        await logout();
        toast.success("Logged out successfully");
      } catch (err) {
        console.error("Logout failed:", err);
        toast.error("Logout failed. Please try again.");
      }
    },
    [logout]
  );
  const handleOrdersNavigate = useCallback(() => {
    navigate(currentRole === "seller" ? "/seller/orders" : "/buyer/orders");
  }, [currentRole, navigate]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  }, [navigate, searchQuery]);

  if (!isLoaded) return null;

  return (
    <nav
      className={`w-full px-24 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
        navFixed || userInfo
          ? "fixed bg-white border-b border-gray-200"
          : "absolute bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <FiverrLogo
          fillColor={!navFixed && !userInfo ? "#ffffff" : "#404145"}
        />
      </Link>

      {/* Search bar */}
      <div
        className={`flex ${
          navFixed || userInfo ? "opacity-100" : "opacity-0"
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

      {/* Auth buttons or user menu */}
      {!userInfo ? (
        <AuthButtons
          authButtons={[
            { name: "English", handler: "#", type: "link" },
            { name: "Sign in", handler: handleLogin, type: "button" },
            { name: "Join", handler: handleSignup, type: "button2" },
          ]}
          navFixed={navFixed}
        />
      ) : (
        <UserMenu
          userInfo={userInfo}
          handleOrdersNavigate={handleOrdersNavigate}
          switchMode={switchMode}
          switchLoading={switchLoading}
          currentRole={currentRole}
          setIsContextMenuVisible={setIsContextMenuVisible}
          navigate={navigate}
        />
      )}
      {isContextMenuVisible && (
        <ContextMenu
          data={[
            {
              name: "Profile",
              callback: (e) => {
                e.stopPropagation();
                navigate("/profile");
              },
            },
            {
              name:
                currentRole === "seller" ? "Seller Profile" : "Buyer Profile",
              callback: (e) => {
                e.stopPropagation();
                navigate(
                  currentRole === "seller"
                    ? "/seller/profile"
                    : "/buyer/profile"
                );
              },
            },
            {
              name: "Logout",
              callback: handleLogout,
            },
          ]}
        />
      )}
    </nav>
  );
}

export default Navbar;
