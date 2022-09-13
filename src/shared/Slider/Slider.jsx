import React from "react";
import "./Slider.scss";

const Slider = ({
  handleClick,
  onCriterium,
  leftContent,
  rightContent,
  colorOn,
  colorOff,
}) => {
  return (
    <span
      className={`slider ${onCriterium ? "slider__on" : "slider__off"}`}
      onClick={handleClick}
    >
      <span
        className={`tick ${onCriterium ? "tick__on" : ""}`}
        style={{
          backgroundColor: onCriterium ? colorOn : colorOff,
        }}
      >
        {onCriterium ? rightContent : leftContent}
      </span>
    </span>
  );
};

export default Slider;
