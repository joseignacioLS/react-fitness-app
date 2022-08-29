import React from "react";
import "./Slider.scss";

const Slider = ({handleClick, onCriterium}) => {
  return (
    <span
      className={`slider ${
        onCriterium ? "slider__on" : "slider__off"
      }`}
      onClick={handleClick}
    ></span>
  );
};

export default Slider;
