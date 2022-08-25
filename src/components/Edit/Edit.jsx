import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseForm from "../../shared/ExerciseForm/ExerciseForm";
import "./Edit.scss";

const Edit = ({ editExercise, removeExercise, exercises }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <ExerciseForm
        submitFunction={editExercise(id)}
        canDelete={true}
        cancelFunction={() => navigate("/")}
        removeFunction={removeExercise}
        data={exercises[id]}
      />
    </>
  );
};

export default Edit;
