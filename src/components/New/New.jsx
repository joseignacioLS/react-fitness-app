import React from "react";
import { useNavigate } from "react-router-dom";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import "./New.scss";

const New = ({ addExercise }) => {
  const navigate = useNavigate();
  return (
    <>
      <ExerciseForm
        submitFunction={addExercise}
        cancelFunction={() => navigate("/")}
      />
    </>
  );
};

export default New;
