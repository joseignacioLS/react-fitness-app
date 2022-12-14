import React, { useState } from "react";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import RoutineForm from "../../shared/RoutineForm/RoutineForm";
import Slider from "../../shared/Slider/Slider";
import "./New.scss";
import { PersonSimpleRun, Table } from "phosphor-react";

const New = ({ callback, setIsAdd, routineId, idLink }) => {
  const [isLoop, setIsLoop] = useState(false);
  const toggleIsLoop = () => {
    setIsLoop((oldValue) => !oldValue);
  };
  return (
    <>
      <Slider
        handleClick={toggleIsLoop}
        onCriterium={isLoop}
        leftContent={<PersonSimpleRun size={32} />}
        rightContent={<Table size={32} />}
      />
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
