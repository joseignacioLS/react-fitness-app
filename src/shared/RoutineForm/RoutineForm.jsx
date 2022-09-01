import React, { useContext, useState } from "react";
import { ExerciseContext } from "../../core/contexts/exerciseContext";
import DefaultButton from "../DefaultButton/DefaultButton";
import "./RoutineForm.scss";

const RoutineForm = ({
  mode,
  cancelFunction,
  data,
  idLink,
  callbackFunction = () => {},
}) => {
  const { exerciseDispatcher } = useContext(ExerciseContext);
  const [formData, setFormData] = useState(
    data || {
      id: 0,
      type: "routine",
      name: "",
      loops: 1,
      data: [],
    }
  );

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
    if (formData.loops < 1) return;
    exerciseDispatcher({
      type: mode,
      payload: {
        id: formData.id,
        name: formData.name,
        type: formData.type,
        loops: parseInt(formData.loops),
        data: formData.data,
      },
      idLink,
    });
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
            <label htmlFor="loops">Loops</label>
            <input
              id="loops"
              type="number"
              min={0}
              placeholder="Loops"
              value={formData.loops}
              onChange={handleInput}
            ></input>
          </div>

          <section className="form-actions">
           {mode === "add" && <DefaultButton
              onClickFunction={cancelFunction}
              style={{
                width: "4rem",
                height: "2rem",
                fontSize: "1rem",
                borderRadius: ".5rem",
                backgroundColor: "green",
              }}
              content="Close"
            />}
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
                onClickFunction={() => {exerciseDispatcher({
                  type:"remove",
                  idLink
                })}}
                style={{
                  width: "4rem",
                  height: "2rem",
                  fontSize: "1rem",
                  borderRadius: ".5rem",
                  backgroundColor: "red",
                }}
                content="Remove"
              />
            )}
          </section>
        </form>
      )}
    </>
  );
};

export default RoutineForm;
