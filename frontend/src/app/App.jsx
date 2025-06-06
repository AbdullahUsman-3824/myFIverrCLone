import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <MainLayout />
    </Router>
  );
}

export default App;
