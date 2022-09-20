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
  Info,
} from "phosphor-react";
import Beeper from "./core/services/soundService";
import { useNavigate } from "react-router-dom";
import { PlayContext } from "./core/contexts/playContext";
import { UserOptionsContext } from "./core/contexts/userOptionsContext";

const beeper = new Beeper();

function App() {
  const navigate = useNavigate();
  
  const { request, release } = useWakeLock();

  const [currentRoutine, setCurrentRoutine] = useState(0);

  const { modalData, modalDispatcher } = useContext(ModalContext);

  const {playData: {play, pause}, playDispatcher} = useContext(PlayContext);

  const [touchedCard, setTouchedCard] = useState(undefined);

  const [totalTime, setTotalTime] = useState({
    current: 0,
    interval: undefined,
  });

  const { exerciseData, exerciseDispatcher } = useContext(ExerciseContext);

  const {userOptions} = useContext(UserOptionsContext)

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
            playDispatcher({
              type:"play"
            })
            if (userOptions.sound) beeper.beep();
          },
        },
      });
    } else {
      playDispatcher({
        type: "stop"
      })
    }
  };

  const togglePause = () => {
    if (!pause) {
      playDispatcher({
        type:"pause"
      })
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
                  playDispatcher({
                    type:"resume"
                  })
                  if (userOptions.sound) beeper.beep();
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
    request();

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

  const [windowH, setWindowH] = useState(window.innerHeight);
  useEffect(() => {
    const updateWindowH = () => {
      setWindowH(window.innerHeight);
    };

    window.addEventListener("resize", updateWindowH);
    return () => window.removeEventListener("resize", updateWindowH);
  }, []);

  return (
    <main className="App" style={{ height: windowH }}>
      {currentRoutine != undefined && (
        <>
          <section className="routine-container">
            <Routine
              data={exerciseData[currentRoutine]}
              nameMod={currentRoutine}
              endRoutineFunction={() => {
                playDispatcher({
                  type:"stop"
                })
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
                if (
                  exerciseData[currentRoutine].data.length === 0 &&
                  currentRoutine > 0
                ) {
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
                if (play || exerciseData[currentRoutine].data.length === 0) return;
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
        {play ? (
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
        ) : (
          <>
            <DefaultButton
              onClickFunction={() => {
                navigate("/about");
              }}
              style={{
                gridArea: "pause",
              }}
              content={<Info size={"100%"} color="white" weight="fill" />}
            />
            <p
              style={{ gridArea: "time", textAlign: "center", color: "white" }}
              className="routine-code"
              onClick={() => {
                // primero checkeo si hay una rutina creada
                // si es asi la copio al portapapeles

                if (exerciseData[currentRoutine].data.length > 0) {
                  navigator.clipboard.writeText(
                    JSON.stringify({
                      isValid: true,
                      data: { ...exerciseData[currentRoutine] },
                    })
                  );
                  modalDispatcher({
                    type: "set",
                    payload: {
                      text: "Code copied to clipboard!",
                    },
                  });
                } else {
                  // si no hay rutina copiada, saco la que haya
                  // en el portapapeles
                  navigator.clipboard.readText().then((data) => {
                    let parsedData;
                    try {
                      parsedData = JSON.parse(data);
                    } catch (err) {
                      modalDispatcher({
                        type: "set",
                        payload: {
                          text: "The clipboard content does not match the routine format",
                        },
                      });
                      return;
                    }

                    if (!parsedData.isValid) {
                      modalDispatcher({
                        type: "set",
                        payload: {
                          text: "The clipboard content does not match the routine format",
                        },
                      });
                      return;
                    }
                    // si es valida se la paso al dispatcher
                    exerciseDispatcher({
                      type: "newroutine",
                      payload: {
                        ...parsedData.data,
                      },
                    });
                    exerciseDispatcher({
                      type: "remove",
                      idLink: [currentRoutine],
                    });
                    modalDispatcher({
                      type: "set",
                      payload: {
                        text: "Routine added!",
                      },
                    });
                  });
                }
              }}
            >
              {exerciseData[currentRoutine].data.length > 0
                ? "Export"
                : "Import"}
            </p>
          </>
        )}
        <DefaultButton
          onClickFunction={togglePlay}
          style={{
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
