import React, { useState } from "react";
import "./DraggableCard.scss";

const DraggableCard = ({
  touchStartF,
  touchMoveF,
  dragLeftF,
  dragRightF,
  touchEndF,
  style,
  children,
}) => {
  const [click, setClick] = useState(undefined);
  const [drag, setDrag] = useState(0);
  const [touch, setTouch] = useState(false);

  const handleTouchStart = (e) => {
    setTouch(true);
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    const newClick = e.touches[0].clientX;
    setDrag((oldValue) => {
      if (!click) return oldValue;
      const delta = newClick - click;
      const newValue = Math.max(-50, Math.min(50, oldValue + delta));
      return newValue;
    });
    setClick(newClick);
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    setDrag(0);
    setClick(undefined);
    setTouch(false);
    e.stopPropagation();
  };

  return (
    <article
      className="card"
      style={{
        ...style,
        transform: `translateX(${drag > 10 || drag < -10 ? drag : 0}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {React.cloneElement(children, {
        isRight: drag === 50,
        isLeft: drag === -50,
        touch: touch,
      })}
    </article>
  );
};

export default DraggableCard;
