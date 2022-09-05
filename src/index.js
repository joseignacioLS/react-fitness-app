import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import ExerciseProvider from "./core/contexts/exerciseContext";
import ModalProvider from "./core/contexts/modalContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./components/About/About";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ModalProvider>
    <ExerciseProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      </BrowserRouter>
    </ExerciseProvider>
  </ModalProvider>
);
