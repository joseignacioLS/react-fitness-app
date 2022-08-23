import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import "./Edit.scss";

const Edit = ({ editExercise, exercises }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  return (
    <>
      <ExerciseForm
        submitFunction={editExercise(id)}
        cancelFunction={() => navigate("/")}
        data={exercises[id]}
      />
    </>
  );
};

export default Edit;
