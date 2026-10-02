import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import "@astryxdesign/core/astryx.css";

import App from "./App.jsx";
import Registration from "./Registration.jsx";

/* /register shows the registration page, everything else shows the landing page */
const isRegister = window.location.pathname
  .replace(/\/+$/, "")
  .startsWith("/register");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Theme theme={neutralTheme}>
      {isRegister ? <Registration /> : <App />}
    </Theme>
  </React.StrictMode>
);