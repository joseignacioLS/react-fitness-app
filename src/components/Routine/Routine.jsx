import React, { useEffect, useState } from "react";
import Exercise from "./Exercise/Exercise";
import "./Routine.scss";
import DefaultButton from "../../shared/DefaultButton/DefaultButton";
import DraggableCard from "../../shared/DraggableCard/DraggableCard";
import New from "../New/New";
import RoutineForm from "../../shared/RoutineForm/RoutineForm";
import { Pencil, PlusCircle } from "phosphor-react";

const playTrackerInitialState = {
  exercise: 0,
  loop: 0,
};

const Routine = ({
  play,
  pause,
  data,
  nameMod,
  endRoutineFunction,
  superChangeCurrentExercise,
  touchedCard,
  setTotalTime,
  idLink = [],
  selected = false,
  isLeft = false,
  isRight = false,
  style = {},
}) => {
  const [isAdd, setIsAdd] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [playTracker, setPlayTracker] = useState(playTrackerInitialState);

  const changeCurrentExercise = (id) => {
    setPlayTracker((oldValue) => {
      return { ...oldValue, exercise: id };
    });
    if (data.name) superChangeCurrentExercise(data.id);
  };

  const nextExercise = () => {
    setPlayTracker((oldValue) => {
      if (oldValue.exercise + 1 < data.data.length) {
        return { ...oldValue, exercise: oldValue.exercise + 1 };
      }
      if (oldValue.loop < data.loops - 1) {
        return { ...oldValue, exercise: 0, loop: oldValue.loop + 1 };
      } else {
        endRoutineFunction();
        return playTrackerInitialState;
      }
    });
  };

  useEffect(() => {
    if (!play) {
      setPlayTracker(playTrackerInitialState);
    }
  }, [play]);

  useEffect(() => {
    if (play) return;
    if (isLeft) setIsEdit((oldValue) => !oldValue);
  }, [isLeft]);

  return (
    <div className="routine" style={style}>
      {data.name && (
        <p
          className="routine__title"
          onClick={() => {
            if (play) return;
            setIsEdit((oldValue) => !oldValue);
          }}
        >
          {data.name + (nameMod !== undefined ? nameMod : "")}{" "}
          {data.loops > 1 &&
            (play
              ? `(${playTracker.loop + 1} / ${data.loops})`
              : `(${data.loops} loops)`)}
          {!play && <Pencil size={20} />}
        </p>
      )}
      {isEdit && (
        <RoutineForm
          cancelFunction={() => setIsEdit(false)}
          idLink={idLink}
          data={data}
          mode="edit"
        />
      )}
      {data.data.map((ele) => {
        return (
          <DraggableCard key={JSON.stringify(ele)}>
            {ele.type === "exercise" ? (
              <Exercise
                play={play}
                pause={pause}
                data={ele}
                touchedCard={touchedCard}
                nextExercise={nextExercise}
                changeCurrentExercise={changeCurrentExercise}
                setTotalTime={setTotalTime}
                routineLoop={playTracker.loop}
                idLink={[...idLink, ele.id]}
                selected={selected && playTracker.exercise === ele.id}
              />
            ) : (
              <Routine
                play={play}
                pause={pause}
                setTotalTime={setTotalTime}
                touchedCard={touchedCard}
                data={ele}
                endRoutineFunction={nextExercise}
                superChangeCurrentExercise={changeCurrentExercise}
                idLink={[...idLink, ele.id]}
                selected={selected && playTracker.exercise === ele.id}
              />
            )}
          </DraggableCard>
        );
      })}
      {!play && isAdd ? (
        <New setIsAdd={setIsAdd} routineId={data.id} idLink={idLink} />
      ) : (
        <>
          {!play && !pause && (
            <DefaultButton
              onClickFunction={() => {
                setIsAdd(true);
              }}
              content={<PlusCircle size={"100%"} weight="fill" />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Routine;
