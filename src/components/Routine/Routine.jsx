import React, { useEffect, useState } from "react";
import Exercise from "./Exercise/Exercise";
import "./Routine.scss";
import { useWakeLock } from "react-screen-wake-lock";
import DefaultButton from "../../shared/DefaultButton/DefaultButton";
import { useNavigate } from "react-router-dom";

const playTrackerInitialState = {
  exercise: 0,
};

const Routine = ({ exercises, removeExercise, editExercise }) => {
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();

  const [touchedCard, setTouchedCard] = useState(undefined);

  const [playTracker, setPlayTracker] = useState(playTrackerInitialState);

  const [totalTime, setTotalTime] = useState({
    current: 0,
    interval: null,
  });

  const { request, release } = useWakeLock();

  const togglePause = () => {
    setPause((oldValue) => !oldValue);
  };

  const togglePlay = () => {
    if (playTracker.exercise >= exercises.length) {
      setPlay(false);
      release();
      return;
    }

    if (play) {
      setPlay(false);
      setPlayTracker(playTrackerInitialState);
      release();
    } else {
      setPlay(true);
      setPause(false);
      request();
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
      release();
    }
  }, [playTracker.exercise]);

  useEffect(() => {
    if (!play) {
      clearInterval(totalTime.interval);
      setTotalTime({
        current: 0,
        interval: null,
      });
      return;
    }
    if (pause) {
      clearInterval(totalTime.interval);
    } else {
      const interval = setInterval(() => {
        setTotalTime((oldValue) => {
          return { ...oldValue, current: oldValue.current + 100 };
        });
      }, 100);
      setTotalTime((oldValue) => {
        return { ...oldValue, interval };
      });
    }
  }, [play, pause]);

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
            editExercise={editExercise}
            currentExercise={playTracker.exercise}
            nextExercise={nextExercise}
            changeCurrentExercise={changeCurrentExercise}
            touchedCard={touchedCard}
            setTouchedCard={setTouchedCard}
            setTotalTime={setTotalTime}
          />
        );
      })}
      {!play && (
        <DefaultButton
          onClickFunction={() => {
            navigate("/new");
          }}
          content="+"
        />
      )}
      {play && (
        <>
          <DefaultButton
            onClickFunction={togglePause}
            style={{
              backgroundColor: pause ? "orange" : "grey",
              position: "fixed",
              bottom: "2rem",
              right: "8rem",
            }}
            content={"⏸"}
          />
          <p className="counter">{totalTime.current / 1000}</p>
        </>
      )}
      <DefaultButton
        onClickFunction={togglePlay}
        style={{
          zIndex:10,
          backgroundColor: play ? "red" : "green",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        content={play ? "🛑" : "▶"}
      />
    </div>
  );
};

export default Routine;
