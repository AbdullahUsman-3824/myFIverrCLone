import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Navbar from "./components/Navbar";
import Home from "./Home";
import AuthWrapper from "./components/AuthWrapper";
import { useStateProvider, StateProvider } from "./context/statecontext";
import ProfilePage from "./pages/ProfilePage";
// import Profile from "./pages/Profile";

function AppContent() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();
  
  return (
    <>
      <Navbar />
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <StateProvider>
        <AppContent />
      </StateProvider>
    </Router>
  );
}

export default App;
