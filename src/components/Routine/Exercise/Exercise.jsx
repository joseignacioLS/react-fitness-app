import React, { useEffect, useState } from "react";
import "./Exercise.scss";
import variables from "../../../style/_variables.scss";
import ExerciseForm from "../../../shared/ExerciseForm/ExerciseForm";
import Beeper from "../../../core/services/soundService";
import { Pencil } from "phosphor-react";
import { useContext } from "react";
import { PlayContext } from "../../../core/contexts/playContext";
import { UserOptionsContext } from "../../../core/contexts/userOptionsContext";
import Speaker from "../../../core/services/voiceService";

const beeper = new Beeper();
const speaker = new Speaker();

const generateTimerInterval = (setter) => {
  const interval = setInterval(() => {
    setter((oldValue) => {
      const newValue = oldValue.current + 100;
      return { ...oldValue, current: newValue };
    });
  }, 100);

  setter((oldValue) => {
    return { ...oldValue, interval };
  });
};

const Exercise = ({
  data,
  data: { name, reps, time, rest },
  nextExercise,
  touch,
  routineLoop,
  idLink,
  selected,
}) => {
  const {
    playData: { play, pause },
  } = useContext(PlayContext);

  const [timer, setTimer] = useState({
    current: 0,
    limit: time,
    interval: undefined,
    callback: () => generateTimerInterval(setRestTimer),
  });

  const [restTimer, setRestTimer] = useState({
    current: 0,
    limit: rest,
    interval: undefined,
    callback: nextExercise,
  });

  const [isEdit, setIsEdit] = useState(false);

  const {userOptions} = useContext(UserOptionsContext)

  const resetTimers = () => {
    setTimer((oldValue) => {
      return {
        ...oldValue,
        current: 0,
        interval: undefined,
      };
    });
    setRestTimer((oldValue) => {
      return {
        ...oldValue,
        current: 0,
        interval: undefined,
      };
    });
  };

  const clearIntervals = () => {
    clearInterval(timer.interval);
    clearInterval(restTimer.interval);
    setTimer((oldValue) => {
      return { ...oldValue, interval: null };
    });
    setRestTimer((oldValue) => {
      return { ...oldValue, interval: null };
    });
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
        generateTimerInterval(setTimer);
        if (userOptions.voice) speaker.speak(name);
      }
    }
    return () => {
      clearIntervals();
    };
  }, [play]);

  useEffect(() => {
    if (!pause) {
      if (!play || !selected) return;

      if (restTimer.current > 0) {
        generateTimerInterval(setRestTimer);
      } else if (timer.current > 0) {
        generateTimerInterval(setTimer);
      }
    } else {
      clearIntervals();
    }
    return () => {
      clearIntervals();
    };
  }, [pause]);

  useEffect(() => {
    if (play && !pause && selected && time > 0) {
      generateTimerInterval(setTimer);
      if (userOptions.voice) speaker.speak(name);
    }
    return () => {
      clearIntervals();
    };
  }, [selected, routineLoop]);

  useEffect(() => {
    if (!touch && reps > 0 && play && selected && !pause) {
      clearInterval(restTimer.interval);
      generateTimerInterval(setRestTimer);
      if (userOptions.sound) beeper.beep();
    }
  }, [touch]);

  // end of cycle
  useEffect(() => {
    if (timer.limit > 0 && timer.current >= timer.limit * 1000) {
      if (userOptions.sound) beeper.beep();
      clearInterval(timer.interval);
      
      timer.callback();

      console.log("resetting first timer");
      setTimer((oldValue) => {
        return {
          ...oldValue,
          current: 0,
          interval: undefined,
        };
      });
    }
  }, [timer.current]);

  useEffect(() => {
    if (restTimer.current >= restTimer.limit * 1000) {
      if (userOptions.sound) beeper.beep();
      clearInterval(restTimer.interval);
      restTimer.callback();
      setRestTimer((oldValue) => {
        return {
          ...oldValue,
          current: 0,
          interval: undefined,
        };
      });
    }
  }, [restTimer.current]);

  return (
    <section className="card-container">
      <article
        className={`exercise-card`}
        style={{
          background:
            play &&
            `linear-gradient(to right,
            lightgrey ${restTimer.current / rest / 10}%,
            orange ${restTimer.current / rest / 10}%,
            orange ${
              time > 0 ? timer.current / time / 10 : selected ? 100 : 0
            }%,
            ${variables.shadow} ${
              time > 0 ? timer.current / time / 10 : selected ? 100 : 0
            }%)`,
        }}
      >
        <section className="card-info">
          <p
            className="card-info__name"
            onClick={() => {
              if (play) return;
              setIsEdit((oldValue) => !oldValue);
            }}
          >
            {name}
            {!play && <Pencil size={20} />}
          </p>
          <p className="card-info__cond">
            {reps > 0
              ? reps + " reps"
              : `${play ? timer.current / 1000 + " /" : ""} ${time}` + " secs"}
          </p>
        </section>
        {isEdit && (
          <ExerciseForm
            mode="edit"
            cancelFunction={() => {
              setIsEdit(false);
            }}
            idLink={idLink}
            data={data}
            callbackFunction={() => {}}
          />
        )}
      </article>
    </section>
  );
};

export default Exercise;
