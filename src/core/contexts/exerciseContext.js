import React, { createContext, useReducer } from "react";
import localStorageService from "../services/localStorageService";
import {
  recursiveSearch,
  updateExercisesIds,
} from "../services/exerciseService";

export const ExerciseContext = createContext();

const localStorage = new localStorageService();

const INITIAL_STATE = localStorage.getItem("routine") || [
  { id: 0, name: "routine", type: "routine", loops: 1, data: [] },
];

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "newroutine":
      newState = updateExercisesIds([
        ...state,
        {
          id: 0,
          name: "routine",
          type: "routine",
          loops: 1,
          data: [],
        },
      ]);
      localStorage.setItem("routine", newState);
      return newState;
    case "add":
      newState = updateExercisesIds([
        ...recursiveSearch(state, action.idLink, "add", action.payload),
      ]);

      localStorage.setItem("routine", newState);
      return newState;
    case "edit":
      newState = updateExercisesIds([
        ...recursiveSearch(state, action.idLink, "edit", action.payload),
      ]);
      localStorage.setItem("routine", newState);
      return newState;
    case "remove":
      newState = updateExercisesIds([
        ...recursiveSearch(state, action.idLink, "remove"),
      ]);
      localStorage.setItem("routine", newState);
      return newState;
    default:
      return state;
  }
};

const ExerciseProvider = ({ children }) => {
  const [exerciseData, exerciseDispatcher] = useReducer(reducer, INITIAL_STATE);

  return (
    <ExerciseContext.Provider
      value={{
        exerciseData,
        exerciseDispatcher,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseProvider;
