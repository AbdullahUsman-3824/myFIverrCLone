import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
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
import { jwtDecode } from "jwt-decode";

const AuthButtons = ({ authButtons, navFixed, isMobile = false }) => (
  <ul
    className={`flex ${
      isMobile ? "flex-col gap-4" : "gap-4 md:gap-6 lg:gap-10"
    } items-center`}
  >
    {authButtons.map(({ name, handler, type }) => (
      <li
        key={name}
        className={`${
          isMobile ? "text-gray-800" : navFixed ? "text-black" : "text-white"
        } font-medium`}
      >
        {type === "link" ? (
          <Link
            to={handler}
            className={
              isMobile
                ? "block py-3 px-4 rounded-lg hover:bg-gray-100 hover:text-[#1DBF73] transition-all duration-200"
                : ""
            }
          >
            {name}
          </Link>
        ) : (
          <button
            onClick={handler}
            className={
              type === "button2"
                ? `border py-1 px-3 rounded-sm font-semibold ${
                    isMobile
                      ? "text-[#1DBF73] border-[#1DBF73] hover:bg-[#1DBF73] hover:text-white w-full py-3 px-4 rounded-lg transition-all duration-200"
                      : navFixed
                      ? "text-[#1DBF73] border-[#1DBF73]"
                      : "text-white border-white"
                  } transition-all duration-500 ${isMobile ? "w-full" : ""}`
                : `${
                    isMobile
                      ? "text-gray-800 hover:text-[#1DBF73] w-full py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      : navFixed
                      ? "text-black"
                      : "text-white"
                  } ${isMobile ? "w-full" : ""}`
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
  isMobile = false,
}) => (
  <ul
    className={`flex ${
      isMobile ? "flex-col gap-4" : "gap-4 md:gap-6 lg:gap-10"
    } items-center`}
  >
    {userInfo?.is_seller && currentRole === "seller" && (
      <>
        <li
          className={`cursor-pointer ${
            isMobile
              ? "text-gray-800 hover:text-[#1DBF73] w-full text-center py-3 px-4 rounded-lg hover:bg-gray-100"
              : "text-[#1DBF73]"
          } font-medium transition-all duration-200`}
          onClick={() => navigate("/seller")}
        >
          Dashboard
        </li>
        <li
          className={`cursor-pointer ${
            isMobile
              ? "text-gray-800 hover:text-[#1DBF73] w-full text-center py-3 px-4 rounded-lg hover:bg-gray-100"
              : "text-[#1DBF73]"
          } font-medium transition-all duration-200`}
          onClick={() => navigate("/seller/gigs/create")}
        >
          Create Gig
        </li>
      </>
    )}

    {currentRole === "buyer" && (
      <li
        className={`cursor-pointer ${
          isMobile
            ? "text-gray-800 hover:text-[#1DBF73] w-full text-center py-3 px-4 rounded-lg hover:bg-gray-100"
            : "text-[#1DBF73]"
        } font-medium transition-all duration-200`}
        onClick={() => navigate("/buyer")}
      >
        Dashboard
      </li>
    )}

    <li
      className={`cursor-pointer ${
        isMobile
          ? "text-gray-800 hover:text-[#1DBF73] w-full text-center py-3 px-4 rounded-lg hover:bg-gray-100"
          : "text-[#1DBF73]"
      } font-medium transition-all duration-200`}
      onClick={handleOrdersNavigate}
    >
      Orders
    </li>
    <li
      className={`cursor-pointer font-medium ${
        switchLoading ? "opacity-50 pointer-events-none" : ""
      } ${
        isMobile
          ? "w-full text-center py-3 px-4 rounded-lg text-gray-800 hover:text-[#1DBF73] hover:bg-gray-100"
          : ""
      } transition-all duration-200`}
      onClick={switchMode}
    >
      {!userInfo?.is_seller
        ? "Become a Seller"
        : currentRole === "buyer"
        ? "Switch to Seller"
        : "Switch to Buyer"}
    </li>
    <li
      className={`cursor-pointer ${
        isMobile ? "w-full text-center py-3 px-4" : ""
      }`}
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
            {userInfo?.username?.[0]?.toUpperCase()}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = useCallback(() => {
    if (showSignupModal) dispatch(toggleSignupModal(false));
    dispatch(toggleLoginModal(true));
    setIsMobileMenuOpen(false);
  }, [dispatch, showSignupModal]);

  const handleSignup = useCallback(() => {
    if (showLoginModal) dispatch(toggleLoginModal(false));
    dispatch(toggleSignupModal(true));
    setIsMobileMenuOpen(false);
  }, [dispatch, showLoginModal]);

  const handleLogout = useCallback(
    async (e) => {
      e.stopPropagation();
      setIsContextMenuVisible(false);
      setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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
      className={`w-full px-4 md:px-8 lg:px-16 xl:px-24 flex justify-between items-center py-4 md:py-6 top-0 z-30 transition-all duration-300 ${
        navFixed || userInfo
          ? "fixed bg-white border-b border-gray-200"
          : "absolute bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <FiverrLogo
          fillColor={!navFixed && !userInfo ? "#ffffff" : "#404145"}
        />
      </Link>

      {/* Search bar - Hidden on mobile */}
      <div
        className={`hidden md:flex ${
          navFixed || userInfo ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        <input
          type="text"
          placeholder="What service are you looking for today?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-64 lg:w-80 xl:w-[30rem] py-2.5 px-4 border"
        />
        <button
          className="bg-gray-900 py-1.5 text-white w-16 flex justify-center items-center"
          onClick={handleSearch}
        >
          <IoSearchOutline className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Auth buttons or user menu */}
      <div className="hidden md:block">
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
      </div>

      {/* Mobile menu button */}
      <button
        className={`md:hidden ${
          navFixed || userInfo
            ? "text-gray-600 hover:text-gray-900"
            : "text-white hover:text-gray-200"
        } focus:outline-none`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <HiX className="h-6 w-6" />
        ) : (
          <HiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end p-4 border-b border-gray-200">
                <button
                  aria-label="Close menu"
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiX className="h-7 w-7" />
                </button>
              </div>
              {/* Mobile search bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="bg-gray-900 py-2 px-3 text-white rounded-r-md"
                    onClick={handleSearch}
                  >
                    <IoSearchOutline className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile navigation */}
              <div className="flex-1 p-4 overflow-y-auto">
                {!userInfo ? (
                  <AuthButtons
                    authButtons={[
                      { name: "English", handler: "#", type: "link" },
                      { name: "Sign in", handler: handleLogin, type: "button" },
                      { name: "Join", handler: handleSignup, type: "button2" },
                    ]}
                    navFixed={navFixed}
                    isMobile={true}
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
                    isMobile={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
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
          isMobileMenu={isMobileMenuOpen}
        />
      )}
    </nav>
  );
}

export default Navbar;
