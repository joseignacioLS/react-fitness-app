import React, { useContext, useState } from "react";
import { ExerciseContext } from "../../core/contexts/exerciseContext";
import DefaultButton from "../DefaultButton/DefaultButton";
import Slider from "../Slider/Slider";
import "./ExerciseForm.scss";
import { Repeat, Timer } from "phosphor-react";
const ExerciseForm = ({
  mode,
  cancelFunction,
  idLink,
  data,
  callbackFunction = () => {},
}) => {
  const [exerciseType, setExerciseType] = useState(
    data && data.reps ? "reps" : "time"
  );

  const { exerciseDispatcher } = useContext(ExerciseContext);

  const [formData, setFormData] = useState(
    data || {
      id: 0,
      type: "exercise",
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
    if (formData.rest < 1) return;
    exerciseDispatcher({
      type: mode,
      payload: {
        id: formData.id,
        name: formData.name,
        type: formData.type,
        reps: exerciseType === "reps" ? parseInt(formData.reps) : 0,
        time: exerciseType === "time" ? parseInt(formData.time) : 0,
        rest: parseInt(formData.rest),
      },
      idLink,
    });

    cancelFunction();
    callbackFunction();
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
            <Slider
              handleClick={onToggleExerciseType}
              onCriterium={exerciseType === "time"}
              rightContent={<Timer size={32} weight="fill" />}
              leftContent={<Repeat size={32} />}
            />
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
              min={1}
              placeholder="Rest Time"
              value={formData.rest}
              onChange={handleInput}
            ></input>
          </div>
          <section className="form-actions">
            {mode === "add" && (
              <DefaultButton
                onClickFunction={cancelFunction}
                style={{
                  width: "4rem",
                  height: "2rem",
                  fontSize: "1rem",
                  borderRadius: ".5rem",
                  backgroundColor: "green",
                }}
                content="Close"
              />
            )}
            <DefaultButton
              onClickFunction={handleSubmit}
              style={{
                width: "4rem",
                height: "2rem",
                fontSize: "1rem",
                borderRadius: ".5rem",
                backgroundColor: "green",
              }}
              content="Save"
            />
            {mode === "edit" && (
              <DefaultButton
                onClickFunction={() => {
                  exerciseDispatcher({
                    type: "remove",
                    idLink,
                  });
                }}
                style={{
                  width: "4rem",
                  height: "2rem",
                  fontSize: "1rem",
                  borderRadius: ".5rem",
                  backgroundColor: "red",
                }}
                content="Delete"
              />
            )}
          </section>
        </form>
      )}
    </>
  );
};

export default ExerciseForm;
