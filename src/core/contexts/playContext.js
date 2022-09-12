import { createContext, useReducer } from "react";

export const PlayContext = createContext();

const INITIAL_STATE = {
  play: false,
  pause: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "play":
      return { pause: false, play: true };
    case "pause":
      return { ...state, pause: true };
      case "resume":
        return { ...state, pause: false };
    case "stop":
      return {
        play: false,
        pause: false,
      };

    case "reset":
      return INITIAL_STATE;
    default:
      return state;
  }
};

const PlayProvider = ({ children }) => {
  const [playData, playDispatcher] = useReducer(reducer, INITIAL_STATE);
  return (
    <PlayContext.Provider
      value={{
        playData,
        playDispatcher,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
};

export default PlayProvider;
