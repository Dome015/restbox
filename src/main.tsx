import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setAppMenu } from "./lib/app-menu/app-menu";

setAppMenu();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
