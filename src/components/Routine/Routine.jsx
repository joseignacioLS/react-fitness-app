import React, { useEffect, useState } from "react";
import Exercise from "./Exercise/Exercise";
import "./Routine.scss";
import DefaultButton from "../../shared/DefaultButton/DefaultButton";
import DraggableCard from "../../shared/DraggableCard/DraggableCard";
import New from "../New/New";
import RoutineForm from "../../shared/RoutineForm/RoutineForm";

const playTrackerInitialState = {
  exercise: 0,
  loop: 0,
};

const Routine = ({
  play,
  pause,
  data,
  addExercise,
  removeExercise,
  editExercise,
  setTotalTime,
  endRoutineFunction,
  superChangeCurrentExercise,
  routineId = undefined,
  routineName = undefined,
  routineLoops = 1,
  touchedCard,
  currentRoutine = undefined,
  isLeft,
  isRight
}) => {
  const [isAdd, setIsAdd] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [playTracker, setPlayTracker] = useState(playTrackerInitialState);

  const changeCurrentExercise = (id) => {
    setPlayTracker((oldValue) => {
      return { ...oldValue, exercise: id };
    });
    if (routineName) superChangeCurrentExercise(routineId);
  };

  const nextExercise = () => {
    console.log("next exercise");
    setPlayTracker((oldValue) => {
      if (oldValue.exercise + 1 < data.length) {
        console.log("    routine not ended");
        return { ...oldValue, exercise: oldValue.exercise + 1 };
      }
      if (oldValue.loop < routineLoops - 1) {
        console.log("    loop not ended");
        return { ...oldValue, exercise: 0, loop: oldValue.loop + 1 };
      } else {
        console.log("    loop ended");
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
    if (isLeft) setIsEdit((oldValue) => !oldValue);
  }, [isLeft]);

  return (
    <div className="routine">
      {routineName && (
        <p>
          {routineName}{" "}
          {play ? `${playTracker.loop + 1} / ${routineLoops}` : ""}
        </p>
      )}
      {isEdit && (
        <RoutineForm
          submitFunction={editExercise()(routineId)}
          cancelFunction={() => setIsEdit(false)}
          removeFunction={removeExercise()}
          data={{
            id: routineId,
            name: routineName,
            loops: routineLoops,
            data: data,
          }}
          canDelete={true}
        />
      )}
      {data.map((ele) => {
        return (
          <DraggableCard key={JSON.stringify(ele)}>
            {ele.type === "exercise" ? (
              <Exercise
                play={play}
                pause={pause}
                data={ele}
                removeExercise={removeExercise(routineId)}
                editExercise={editExercise(routineId)}
                currentExercise={[currentRoutine, playTracker.exercise]}
                touchedCard={touchedCard}
                nextExercise={nextExercise}
                changeCurrentExercise={changeCurrentExercise}
                setTotalTime={setTotalTime}
                routineLoop={playTracker.loop}
                routineId={routineId}
              />
            ) : (
              <Routine
                play={play}
                pause={pause}
                data={ele.data}
                addExercise={addExercise}
                removeExercise={removeExercise}
                editExercise={editExercise}
                setTotalTime={setTotalTime}
                touchedCard={touchedCard}
                routineId={ele.id}
                routineName={ele.name}
                routineLoops={ele.loops}
                endRoutineFunction={nextExercise}
                currentRoutine={playTracker.exercise}
                superChangeCurrentExercise={changeCurrentExercise}
              />
            )}
          </DraggableCard>
        );
      })}
      {!play && isAdd ? (
        <New
          addExercise={addExercise(routineId)}
          setIsAdd={setIsAdd}
          routineId={routineId}
        />
      ) : (
        <>
          {!play && !pause && (
            <DefaultButton
              onClickFunction={() => {
                setIsAdd(true);
              }}
              content="+"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Routine;
