import "./App.scss";
import Routine from "./components/Routine/Routine";
import { useContext, useEffect, useState } from "react";
import { useWakeLock } from "react-screen-wake-lock";
import DefaultButton from "./shared/DefaultButton/DefaultButton";
import { ExerciseContext } from "./core/contexts/exerciseContext";
import Modal from "./core/Modal/Modal";
import { ModalContext } from "./core/contexts/modalContext";
import { formatSeconds } from "./core/services/timeService";
import {
  Stop,
  PlayCircle,
  Pause,
  ArrowFatLeft,
  ArrowFatRight,
} from "phosphor-react";
import Beeper from "./core/services/soundService";

const beeper = new Beeper();

function App() {
  const { request, release } = useWakeLock();

  const [currentRoutine, setCurrentRoutine] = useState(0);

  const { modalData, modalDispatcher } = useContext(ModalContext);

  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);

  const [touchedCard, setTouchedCard] = useState(undefined);

  const [totalTime, setTotalTime] = useState({
    current: 0,
    interval: undefined,
  });

  const { exerciseData, exerciseDispatcher } = useContext(ExerciseContext);

  const togglePlay = () => {
    if (!play) {
      if (exerciseData[currentRoutine].data.length === 0) {
        modalDispatcher({
          type: "set",
          payload: {
            text: "Empty routine",
          },
        });
        return;
      }

      request();
      modalDispatcher({
        type: "countdown",
        payload: {
          time: 3000,
          cb: () => {
            setPlay(true);
            beeper.beep();
          },
        },
      });
    } else {
      setPlay(false);
    }
  };

  const togglePause = () => {
    if (!pause) {
      setPause(true);
      modalDispatcher({
        type: "set",
        payload: {
          text: "Paused",
          action: () => {
            modalDispatcher({
              type: "countdown",
              payload: {
                time: 5000,
                cb: () => {
                  setPause(false);
                  beeper.beep();
                },
              },
            });
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!play) {
      clearInterval(totalTime.interval);
      setTotalTime({
        current: 0,
        interval: undefined,
      });
      release();
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
    <main
      className="App"
      style={{ height: window.innerHeight }}
    >
      {currentRoutine != undefined && (
        <>
          <section className="routine-container">
            <Routine
              play={play}
              pause={pause}
              data={exerciseData[currentRoutine]}
              nameMod={currentRoutine}
              endRoutineFunction={() => {
                setPlay(false);
                modalDispatcher({
                  type: "set",
                  payload: {
                    text: `Training finished!`,
                  },
                });
              }}
              superChangeCurrentExercise={() => {}}
              touchedCard={touchedCard}
              setTotalTime={setTotalTime}
              idLink={[exerciseData[currentRoutine].id]}
              selected={true}
            />
          </section>
          <section className="manage-bar">
            <DefaultButton
              onClickFunction={() => {
                if (play) return;
                if (exerciseData[currentRoutine].data.length === 0) {
                  exerciseDispatcher({
                    type: "remove",
                    idLink: [currentRoutine],
                  });
                }
                setCurrentRoutine((oldValue) => Math.max(0, oldValue - 1));
              }}
              content={<ArrowFatLeft size={"100%"} />}
              style={{ gridArea: "b1" }}
            />
            <DefaultButton
              onClickFunction={() => {
                if (play) return;
                if (currentRoutine + 1 >= exerciseData.length)
                  exerciseDispatcher({
                    type: "newroutine",
                  });
                setCurrentRoutine((oldValue) => {
                  return oldValue + 1;
                });
              }}
              content={<ArrowFatRight size={"100%"} />}
              style={{ gridArea: "b2" }}
            />
          </section>
        </>
      )}

      <section className="button-bar">
        {play && (
          <>
            <DefaultButton
              onClickFunction={togglePause}
              style={{
                gridArea: "pause",
              }}
              content={<Pause size={"100%"} weight="fill" />}
            />
            <p className="counter" style={{ gridArea: "time" }}>
              {formatSeconds(totalTime.current / 1000)}
            </p>
          </>
        )}
        <DefaultButton
          onClickFunction={togglePlay}
          style={{
            zIndex: 10,
            gridArea: "play",
          }}
          content={
            play ? (
              <Stop size={"100%"} weight="fill" />
            ) : (
              <PlayCircle size={"100%"} weight="fill" />
            )
          }
        />
      </section>
      {modalData.visible && <Modal />}
    </main>
  );
}

export default App;
