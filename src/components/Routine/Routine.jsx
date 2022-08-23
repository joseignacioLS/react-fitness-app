import React, { useEffect, useState } from "react";
import Exercise from "./Exercise/Exercise";
import "./Routine.scss";
import { useWakeLock } from "react-screen-wake-lock";

const playTrackerInitialState = {
  exercise: 0,
};

const Routine = ({ exercises, removeExercise }) => {
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);

  const [playTracker, setPlayTracker] = useState(playTrackerInitialState);

  const {request, release} = useWakeLock()

  const togglePause = () => {
    setPause((oldValue) => !oldValue);
  };

  const togglePlay = () => {
    if (playTracker.exercise >= exercises.length) {
      setPlay(false);
      release()
      return;
    }

    if (play) {
      setPlay(false);
      setPlayTracker(playTrackerInitialState); 
      release()
    } else {
      setPlay(true);
      setPause(false);
      request()
    }
  };

  const changeCurrentExercise = (id) => {
    setPlayTracker((oldValue) => {
      return { ...oldValue, exercise: id };
    });
  };

  const nextExercise = () => {
    setPlayTracker((oldValue) => {
      return { ...oldValue, exercise: oldValue.exercise + 1 };
    });
  };

  useEffect(() => {
    if (playTracker.exercise >= exercises.length) {
      setPlay(false);
      setPlayTracker(playTrackerInitialState);
      release()
    }
  }, [playTracker.exercise]);


  return (
    <div className="routine">
      {exercises.map((exercise) => {
        return (
          <Exercise
            key={JSON.stringify(exercise)}
            play={play}
            pause={pause}
            exercise={exercise}
            removeExercise={removeExercise}
            currentExercise={playTracker.exercise}
            nextExercise={nextExercise}
            changeCurrentExercise={changeCurrentExercise}
          />
        );
      })}
      {!play && (
        <Exercise
          exercise={{ name: "New" }}
          currentExercise={playTracker.exercise}
        />
      )}
      <button
        className="play"
        style={{ backgroundColor: play ? "red" : "green" }}
        onClick={togglePlay}
      >
        {play ? "⏸" : "▶"}
      </button>
    </div>
  );
};

export default Routine;
