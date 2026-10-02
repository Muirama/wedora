import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/jost/wght.css";
import "lenis/dist/lenis.css";

import "./styles/variables.css";
import "./styles/global.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);