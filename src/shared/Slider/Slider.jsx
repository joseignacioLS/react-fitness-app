import React from "react";
import "./Slider.scss";

const Slider = ({ handleClick, onCriterium, leftContent, rightContent }) => {
  return (
    <span
      className={`slider ${onCriterium ? "slider__on" : "slider__off"}`}
      onClick={handleClick}
    >
      <span className={`tick ${onCriterium?"tick__on":""}`}>

      {onCriterium ? rightContent : leftContent}
      </span>
    </span>
  );
};

export default Slider;
