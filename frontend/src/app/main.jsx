import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "../styles/globals.css";
import { StateProvider } from "../context/StateContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <StateProvider>
        <GoogleOAuthProvider clientId="304600798001-d7me0l3ot1v915ootp5su88f22b3ij4b.apps.googleusercontent.com">
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </StateProvider>
    </CookiesProvider>
  </React.StrictMode>
);
