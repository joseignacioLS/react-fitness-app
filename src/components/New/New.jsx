import React, { useState } from "react";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import RoutineForm from "../../shared/RoutineForm/RoutineForm";
import Slider from "../../shared/Slider/Slider";
import "./New.scss";

const New = ({ addExercise, callback, setIsAdd, routineId }) => {
  const [isLoop, setIsLoop] = useState(false);
  const toggleIsLoop = () => {
    setIsLoop((oldValue) => !oldValue);
  };
  return (
    <>
      <Slider handleClick={toggleIsLoop} onCriterium={isLoop} />
      {routineId !== undefined || !isLoop ? (
        <ExerciseForm
          submitFunction={addExercise}
          cancelFunction={() => setIsAdd(false)}
          callbackFunction={() => setIsAdd(false)}
          routineId={routineId}

        />
      ) : (
        <RoutineForm
          submitFunction={addExercise}
          cancelFunction={() => setIsAdd(false)}
          callbackFunction={() => setIsAdd(false)}
        />
      )}
    </>
  );
};

export default New;
