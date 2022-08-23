import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../services/timer";
import "./ExerciseForm.scss";

const ExerciseForm = ({ submitFunction, cancelFunction, data }) => {
  const navigate = useNavigate();
  const [exerciseType, setExerciseType] = useState(
    data && data.reps ? "reps" : "time"
  );
  const [formData, setFormData] = useState(
    data || {
      name: "",
      reps: 0,
      time: 0,
      rest: 20,
    }
  );

  const onToggleExerciseType = () => {
    setExerciseType((oldValue) => {
      return oldValue === "reps" ? "time" : "reps";
    });
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const key = e.target.id;
    setFormData((oldValue) => {
      return { ...oldValue, [key]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) return;
    if (!formData.time && !formData.reps) return;
    submitFunction({
      id: formData.id,
      name: formData.name,
      reps: exerciseType === "reps" ? formData.reps : 0,
      time: exerciseType === "time" ? formData.time : 0,
      rest: formData.rest,
      completionF: new Timer(parseInt(formData.time)),
    });
    navigate("/");
  };

  return (
    <>
      {formData?.name !== undefined && (
        <form className="form">

          <div className="input-block">
            <label htmlFor="name">Exercise Name</label>
            <input
              id="name"
              type="text"
              placeholder="Exercise"
              value={formData.name}
              onChange={handleInput}
            ></input>
          </div>
          <div className="input-block">
            <span
              className={`slider ${
                exerciseType === "time" ? "slider__on" : "slider__off"
              }`}
              onClick={onToggleExerciseType}
            ></span>
          </div>
          {exerciseType === "reps" ? (
            <div className="input-block">
              <label htmlFor="reps">Repetitions</label>
              <input
                id="reps"
                type="number"
                min={0}
                placeholder="Repetitions"
                value={formData.reps}
                onChange={handleInput}
              ></input>
            </div>
          ) : (
            <div className="input-block">
              <label htmlFor="time">Duration (seconds)</label>
              <input
                id="time"
                type="number"
                min={0}
                placeholder="Time"
                value={formData.time}
                onChange={handleInput}
              ></input>
            </div>
          )}

          <div className="input-block">
            <label htmlFor="rest">Rest Time (seconds)</label>
            <input
              id="rest"
              type="number"
              min={0}
              placeholder="Rest Time"
              value={formData.rest}
              onChange={handleInput}
            ></input>
          </div>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={cancelFunction}>Back</button>
        </form>
      )}
    </>
  );
};

export default ExerciseForm;
