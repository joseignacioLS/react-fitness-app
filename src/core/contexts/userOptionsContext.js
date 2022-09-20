import { createContext, useReducer } from "react";
import localStorageService from "../services/localStorageService";

export const UserOptionsContext = createContext();

const localStorage = new localStorageService();

const INITIAL_STATE = localStorage.getItem("userOptions") || {
  sound: true,
  voice: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "modify":
      const newValue = { ...state, ...action.payload };
      localStorage.setItem("userOptions", newValue);
      return newValue;
    default:
      return state;
  }
};

const UserOptionsProvider = ({ children }) => {
  const [userOptions, userOptionsDispatcher] = useReducer(
    reducer,
    INITIAL_STATE
  );
  return (
    <UserOptionsContext.Provider
      value={{
        userOptions,
        userOptionsDispatcher,
      }}
    >
      {children}
    </UserOptionsContext.Provider>
  );
};

export default UserOptionsProvider;
