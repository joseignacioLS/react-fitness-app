import { createContext, useReducer } from "react";

export const ModalContext = createContext();

const INITIAL_STATE = {
  visible: false,
  text: "",
  action: undefined,
  countdown: {
    current: 0,
    time: 0,
    interval: undefined,
    cb: () => {},
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "action":
      if (state.action) state.action();
      return {
        text: "",
        visible: false,
        action: undefined,
        countdown: {
          current: 0,
          time: 0,
          interval: undefined,
          cb: () => {},
        },
      };
    case "set":
      console.log("set");
      return {
        ...INITIAL_STATE,
        ...action.payload,
        visible: true,
      };
    case "countdown":
      clearInterval(state.countdown.interval);
      const newState = {
        ...state,
        visible: true,
        countdown: {
          ...action.payload,
          current: 0,
          interval: undefined,
        },
      };
      return newState;

    case "reset":
      return INITIAL_STATE;
    default:
      return state;
  }
};

const ModalProvider = ({ children }) => {
  const [modalData, modalDispatcher] = useReducer(reducer, INITIAL_STATE);
  return (
    <ModalContext.Provider
      value={{
        modalData,
        modalDispatcher,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
