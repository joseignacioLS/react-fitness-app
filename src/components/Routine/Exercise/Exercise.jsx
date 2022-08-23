import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Exercise.scss";

const Exercise = ({
  exercise: { id, name, reps, time, rest },
  play,
  pause,
  removeExercise,
  currentExercise,
  nextExercise,
  changeCurrentExercise,
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

  const handleTouchMove = (e) => {
    if (name === "New") return 0;
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
    if (drag < 50 && drag > -50) setDrag(0);
    if (drag > 50) setDrag(50);
    if (drag < -50) setDrag(-50);

    if (reps > 0 && play) {
      generateTimerInterval(setRestTimer, rest, nextExercise);
    }
    if (!play && name !== "New") {
      changeCurrentExercise(id);
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

    if (!selected) return;

    if (time > 0) {
      generateTimerInterval(setTimer, time, () => {
        generateTimerInterval(setRestTimer, rest, nextExercise);
      });
    }
  }, [play, currentExercise]);

  return (
    <section
      className="card-container"
      style={{
        display: play && currentExercise > id ? "none" : "flex",
      }}
    >
      {name !== "New" && (
        <article className="card-back">
          <span onClick={() => removeExercise(id)}>❌</span>
          <span onClick={() => navigate(`/edit/${id}`)}>✏</span>
        </article>
      )}

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
            orange ${time > 0 ? timer.current / time / 10 : 100}%,
            white ${time > 0 ? timer.current / time / 10 : 100}%)`
            : selected
            ? "lightgreen"
            : "",
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {name !== "New" ? (
          <>
            <p>{name}</p>
            <p>
              {reps > 0
                ? reps + " reps"
                : `${play ? timer.current / 1000 + " /" : ""} ${time}` +
                  " secs"}
            </p>
          </>
        ) : (
          <button
            onClick={() => {
              navigate("/new");
            }}
          >
            +
          </button>
        )}
      </article>
    </section>
  );
};

export default Exercise;
