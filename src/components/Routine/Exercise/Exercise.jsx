import React, { useEffect, useState } from "react";
import "./Exercise.scss";
import variables from "../../../style/_variables.scss";
import ExerciseForm from "../../../shared/ExerciseForm/ExerciseForm";

const Exercise = ({
  data,
  data: { id, name, reps, time, rest },
  play,
  pause,
  currentExercise,
  nextExercise,
  touchedCard,
  editExercise,
  removeExercise,
  routineId,
  isRight,
  isLeft,
  touch,
  routineLoop,
}) => {
  const [timer, setTimer] = useState({
    current: 0,
    interval: undefined,
  });

  const [restTimer, setRestTimer] = useState({
    current: 0,
    interval: undefined,
  });

  const [isEdit, setIsEdit] = useState(false);
  const selected = currentExercise[0] === routineId && currentExercise[1] === id

  const generateTimerInterval = (setTimer, time, callback = () => {}) => {
    const interval = setInterval(() => {
      setTimer((oldValue) => {
        const newValue = oldValue.current + 100;
        if (newValue / 1000 >= time) {
          clearInterval(oldValue.interval);
          console.log("clearing self interval");
          callback();
          return {
            current: 0,
            interval: undefined,
          };
        }
        return { ...oldValue, current: Math.min(time * 1000, newValue) };
      });
    }, 100);

    setTimer((oldValue) => {
      return { ...oldValue, interval };
    });
  };

  const resetTimers = () => {
    setTimer({
      current: 0,
      interval: undefined,
    });
    setRestTimer({
      current: 0,
      interval: undefined,
    });
  };

  const clearIntervals = () => {
    clearInterval(timer.interval);
    clearInterval(restTimer.interval);
  };

  // gestionar el play
  useEffect(() => {
    setIsEdit(false);
    if (!play) {
      clearIntervals();
      resetTimers();
    }

    if (play) {
      clearIntervals();
      if (selected && time > 0 && !pause) {
        console.log(name, "intervals generated in 1");
        generateTimerInterval(setTimer, time, () => {
          generateTimerInterval(setRestTimer, rest, nextExercise);
        });
      }
    }
    return () => {
      clearIntervals();
    };
  }, [play]);

  useEffect(() => {
    if (!pause) {
      if (!play || !selected) return;

      if (timer.current / 1000 >= time) {
        generateTimerInterval(setRestTimer, rest, nextExercise);
      } else if (restTimer.current === 0) {
        generateTimerInterval(setTimer, time, () => {
          generateTimerInterval(setRestTimer, rest, nextExercise);
        });
      }
    } else {
      clearInterval(timer.interval);
      clearInterval(restTimer.interval);
    }
    return () => {
      clearInterval(timer.interval);
      clearInterval(restTimer.interval);
    };
  }, [pause]);

  useEffect(() => {
    if (play && !pause && selected && time > 0) {
      console.log(name, "intervals generated in 2", routineId, id, currentExercise);
      generateTimerInterval(setTimer, time, () => {
        generateTimerInterval(setRestTimer, rest, nextExercise);
      });
    }
    return () => {
      clearIntervals();
    };
  }, [selected, routineLoop]);

  useEffect(() => {
    if (!touch && reps > 0 && play && selected && !pause) {
      clearInterval(restTimer.interval);
      generateTimerInterval(setRestTimer, rest, nextExercise);
    }
    return () => {
      clearInterval(restTimer.interval);
    };
  }, [touch]);


  useEffect(() => {
    if (!touch) {
      setIsEdit(false);
    }
  }, [touchedCard]);

  useEffect(() => {
    if (isLeft) {
      setIsEdit((oldValue) => !oldValue);
    }
  }, [isLeft, isRight]);

  return (
    <section className="card-container">
      <article
        className={`exercise-card`}
        style={{
          background: play
            ? `linear-gradient(to right,
            lightgrey ${restTimer.current / rest / 10}%,
            orange ${restTimer.current / rest / 10}%,
            orange ${
              time > 0 ? timer.current / time / 10 : selected ? 100 : 0
            }%,
            ${variables.mainColor} ${
                time > 0 ? timer.current / time / 10 : selected ? 100 : 0
              }%)`
            : (selected && play) || isEdit
            ? "lightgreen"
            : "",
        }}
      >
        <section className="card-info">
          <p>{name}</p>
          <p>
            {reps > 0
              ? reps + " reps"
              : `${play ? timer.current / 1000 + " /" : ""} ${time}` + " secs"}
          </p>
        </section>
        {isEdit && (
          <ExerciseForm
            submitFunction={editExercise(id)}
            canDelete={true}
            cancelFunction={() => {
              setIsEdit(false);
            }}
            removeFunction={removeExercise}
            data={data}
            callbackFunction={() => {}}
          />
        )}
      </article>
    </section>
  );
};

export default Exercise;
