import React from "react";
import { useNavigate } from "react-router-dom";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import "./New.scss";

const New = ({ addExercise, callback }) => {
  const navigate = useNavigate();
  return (
    <>
      <ExerciseForm
        submitFunction={addExercise}
        cancelFunction={() => navigate("/")}
        callbackFunction = {callback}
      />
    </>
  );
};

export default New;
