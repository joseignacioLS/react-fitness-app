import React, { useState } from "react";
import DefaultButton from "../DefaultButton/DefaultButton";
import "./RoutineForm.scss";

const RoutineForm = ({
  submitFunction,
  cancelFunction,
  removeFunction,
  data,
  canDelete,
  callbackFunction = () => {},
}) => {
  const [formData, setFormData] = useState(
    data || {
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
    submitFunction({
      name: formData.name,
      type: formData.type,
      loops: parseInt(formData.loops),
      data: formData.data,
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
            {canDelete && (
              <DefaultButton
                onClickFunction={() => removeFunction(data.id)}
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
