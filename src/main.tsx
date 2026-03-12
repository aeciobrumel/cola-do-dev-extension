import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const POPUP_WIDTH = "420px";
const POPUP_HEIGHT = "560px";

document.documentElement.style.width = POPUP_WIDTH;
document.documentElement.style.minWidth = POPUP_WIDTH;
document.documentElement.style.maxWidth = POPUP_WIDTH;
document.documentElement.style.height = POPUP_HEIGHT;
document.documentElement.style.minHeight = POPUP_HEIGHT;
document.documentElement.style.maxHeight = POPUP_HEIGHT;

document.body.style.width = POPUP_WIDTH;
document.body.style.minWidth = POPUP_WIDTH;
document.body.style.maxWidth = POPUP_WIDTH;
document.body.style.height = POPUP_HEIGHT;
document.body.style.minHeight = POPUP_HEIGHT;
document.body.style.maxHeight = POPUP_HEIGHT;
document.body.style.margin = "0";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
