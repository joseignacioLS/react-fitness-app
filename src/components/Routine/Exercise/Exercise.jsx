import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Exercise.scss";
import variables from "../../../style/_variables.scss";
import ExerciseForm from "../../../shared/ExerciseForm/ExerciseForm";

const Exercise = ({
  exercise,
  exercise: { id, name, reps, time, rest },
  play,
  pause,
  currentExercise,
  nextExercise,
  changeCurrentExercise,
  touchedCard,
  setTouchedCard,
  editExercise,
  removeExercise,
}) => {
  const navigate = useNavigate();

  const [click, setClick] = useState(undefined);
  const [drag, setDrag] = useState(0);

  const [timer, setTimer] = useState({
    current: 0,
    interval: null,
  });

  const [restTimer, setRestTimer] = useState({
    current: 0,
    interval: null,
  });

  const [isEdit, setIsEdit] = useState(false);

  const selected = currentExercise === id;

  const generateTimerInterval = (setTimer, time, callback = () => {}) => {
    const interval = setInterval(() => {
      setTimer((oldValue) => {
        const newValue = oldValue.current + 100;
        if (newValue / 1000 >= time) {
          clearInterval(oldValue.interval);
          callback();
        }
        return { ...oldValue, current: Math.min(time * 1000, newValue) };
      });
    }, 100);

    setTimer((oldValue) => {
      return { ...oldValue, interval };
    });
  };

  const handleTouchStart = (e) => {
    if (!play) changeCurrentExercise(id);
  };

  const handleTouchMove = (e) => {
    if (play) return setDrag(0);

    const newClick = e.touches[0].clientX;
    setDrag((oldValue) => {
      if (!click) return oldValue;
      const delta = newClick - click;
      const newValue = Math.max(-50, Math.min(50, oldValue + delta));
      return newValue;
    });
    setClick(newClick);
  };

  const handleTouchEnd = (e) => {
    setClick(undefined);

    setTouchedCard(id);
    if (drag < 50 && drag > -50) setDrag(0);
    if (drag >= 50) {
      setDrag(0);
    }
    if (drag <= -50) {
      setDrag(0);
      setIsEdit((oldValue) => !oldValue);
    }

    if (reps > 0 && play && selected && !pause) {
      generateTimerInterval(setRestTimer, rest, nextExercise);
    }
  };

  useEffect(() => {
    if (!play) {
      clearInterval(timer.interval);
      clearInterval(restTimer.interval);
      if (currentExercise === 0 || currentExercise > id) {
        setTimer({
          current: 0,
          interval: null,
        });
        setRestTimer({
          current: 0,
          interval: null,
        });
      }
      return;
    }

    setIsEdit(false);

    if (!selected) return;

    if (time > 0 && !pause) {
      generateTimerInterval(setTimer, time, () => {
        generateTimerInterval(setRestTimer, rest, nextExercise);
      });
    }
  }, [play, currentExercise]);

  useEffect(() => {
    if (touchedCard !== id) {
      setDrag(0);
      setIsEdit(false);
    }
  }, [touchedCard]);

  useEffect(() => {
    if (pause) {
      clearInterval(timer.interval);
      clearInterval(restTimer.interval);
    } else {
      if (!play || !selected) return;

      if (timer.current / 1000 >= time) {
        generateTimerInterval(setRestTimer, rest, nextExercise);
        return;
      }
      if (restTimer.current === 0) {
        generateTimerInterval(setTimer, time, () => {
          generateTimerInterval(setRestTimer, rest, nextExercise);
        });
        return;
      }
    }
  }, [pause]);

  return (
    <section
      className="card-container"
      style={{
        display: play && currentExercise > id ? "none" : "flex",
      }}
    >
      <article
        className={`exercise-card ${
          name === "New" ? "exercise-card__new" : ""
        }`}
        style={{
          transform: `translateX(${drag}px)`,
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
            : selected
            ? "lightgreen"
            : "",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            cancelFunction={() => navigate("/")}
            removeFunction={removeExercise}
            data={exercise}
            callbackFunction={() => {
              setIsEdit(false);
            }}
          />
        )}
      </article>
    </section>
  );
};

export default Exercise;
