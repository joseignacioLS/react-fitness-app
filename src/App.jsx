import "./App.scss";
import Routine from "./components/Routine/Routine";
import { useContext, useEffect, useState } from "react";
import { useWakeLock } from "react-screen-wake-lock";
import DefaultButton from "./shared/DefaultButton/DefaultButton";
import { ExerciseContext } from "./core/contexts/exerciseContext";
import Modal from "./core/Modal/Modal";
import { ModalContext } from "./core/contexts/modalContext";
import { formatSeconds } from "./core/services/timeService";

function App() {
  const { request, release } = useWakeLock();

  const { modalData, modalDispatcher } = useContext(ModalContext);

  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);

  const [touchedCard, setTouchedCard] = useState(undefined);

  const [totalTime, setTotalTime] = useState({
    current: 0,
    interval: undefined,
  });

  const { exerciseData } = useContext(ExerciseContext);

  const togglePlay = () => {
    if (!play) {
      request();
      modalDispatcher({
        type: "countdown",
        payload: {
          time: 3000,
          cb: () => {
            setPlay(true);
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
    <main className="App">
      <section className="routine-container">
        <Routine
          play={play}
          pause={pause}
          data={exerciseData[0]}
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
          routineId={exerciseData[0].id}
          routineName={exerciseData[0].name}
          idLink={[exerciseData[0].id]}
          selected={true}
        />
      </section>

      <section className="button-bar">
        {play && (
          <>
            <DefaultButton
              onClickFunction={togglePause}
              style={{
                backgroundColor: pause ? "orange" : "grey",
                gridArea: "pause",
              }}
              content={"⏸"}
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
            backgroundColor: play ? "red" : "green",
            gridArea: "play",
          }}
          content={play ? "🛑" : "▶"}
        />
      </section>
      {modalData.visible && <Modal />}
    </main>
  );
}

export default App;
