import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import ExerciseProvider from "./core/contexts/exerciseContext";
import ModalProvider from "./core/contexts/modalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ModalProvider>
    <ExerciseProvider>
      <App />
    </ExerciseProvider>
  </ModalProvider>
);
