import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./styles/globals.css";
// import { AuthProvider } from "./context/AuthContext";
import { StateProvider } from "./context/StateContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </CookiesProvider>
  </React.StrictMode>
);
