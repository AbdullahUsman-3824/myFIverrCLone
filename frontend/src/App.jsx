import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Navbar from "./components/Navbar";
import Home from "./Home";
import SellerDashboard from "./pages/dummyPages/SellerDashboard";
import DummyGigsPage from "./pages/dummyPages/dummygigpage";
import CreateGigs from "./pages/dummyPages/creategig";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/Home" element={<Home />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/gigIndex" element={<DummyGigsPage />} />
        <Route path="/createGig" element={<CreateGigs />} />
      </Routes>
    </Router>
  );
}

export default App;
