import React, { useState } from "react";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import RoutineForm from "../../shared/RoutineForm/RoutineForm";
import Slider from "../../shared/Slider/Slider";
import "./New.scss";

const New = ({ callback, setIsAdd, routineId, idLink }) => {
  const [isLoop, setIsLoop] = useState(false);
  const toggleIsLoop = () => {
    setIsLoop((oldValue) => !oldValue);
  };
  return (
    <>
      <Slider handleClick={toggleIsLoop} onCriterium={isLoop} />
      {!isLoop ? (
        <ExerciseForm
          mode="add"
          cancelFunction={() => setIsAdd(false)}
          callbackFunction={() => setIsAdd(false)}
          routineId={routineId}
          idLink={idLink}
        />
      ) : (
        <RoutineForm
        mode="add"
          cancelFunction={() => setIsAdd(false)}
          callbackFunction={() => setIsAdd(false)}
          idLink={idLink}
        />
      )}
    </>
  );
};

export default New;
