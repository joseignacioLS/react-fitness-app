import "./App.scss";
import Routine from "./components/Routine/Routine";
import { useEffect, useState } from "react";
import localStorageService from "./shared/services/localStorageService";
import { useWakeLock } from "react-screen-wake-lock";
import DefaultButton from "./shared/DefaultButton/DefaultButton";

function App() {
  const { request, release } = useWakeLock();

  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);

  const [data, setData] = useState([]);

  const localStorage = new localStorageService();

  
  const [touchedCard, setTouchedCard] = useState(undefined);

  const [totalTime, setTotalTime] = useState({
    current: 0,
    interval: undefined,
  });

  const togglePlay = () => {
    setPlay((oldValue) => {
      if (!oldValue) {
        request()
      }
      return !oldValue});
  };

  const togglePause = () => {
    setPause((oldValue) => !oldValue);
  };

  const addExercise = (where = undefined) => {
    return (data) => {
      setData((oldValue) => {
        let newValue = [...oldValue, data];
        if (where === undefined) {
          newValue = [...oldValue, data];
        } else {
          let tempValue = [...oldValue];
          tempValue[where].data = [...tempValue[where].data, data];
          newValue = [...tempValue];
        }
        const updatedValue = newValue.map((v, id) => {
          if (v.type === "routine") {
            v.data = v.data.map((v, id) => {
              return { ...v, id };
            });
          }
          return { ...v, id };
        });
        localStorage.setItem("routine", updatedValue);
        return updatedValue;
      });
    };
  };

  const editExercise = (where = undefined) => {
    return (id) => {
      return (values) => {
        console.log(where, id, values)
        setData((oldValue) => {
          let updatedValue;
          if (where === undefined) {
            updatedValue = oldValue.map((v) => {
              return v.id === id ? values : v;
            });
          } else {
            updatedValue = [...oldValue];
            updatedValue[where].data[id] = values;
          }

          localStorage.setItem("routine", updatedValue);
          return updatedValue;
        });
      };
    };
  };

  const removeExercise = (where = undefined) => {
    return (id) => {
      setData((oldValue) => {
        let newValue;
        if (where === undefined) {
          newValue = oldValue.filter((v) => {
            return v.id !== id;
          });
        } else {
          newValue = [...oldValue];
          newValue[where].data = newValue[where].data.filter((v) => {
            return v.id !== id;
          });
        }
        const updatedValue = newValue.map((v, id) => {
          if (v.type === "routine") {
            v.data = v.data.map((v, id) => {
              return { ...v, id };
            });
          }
          return { ...v, id };
        });

        localStorage.setItem("routine", updatedValue);
        return updatedValue;
      });
    };
  };

    useEffect(() => {
    const routine = localStorage.getItem("routine");
    setData(routine || []);
  }, []);

  useEffect(() => {
    if (!play) {
      clearInterval(totalTime.interval);
      setTotalTime({
        current: 0,
        interval: undefined,
      });
      release()
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
    <div className="App">
      <Routine
        play={play}
        pause={pause}
        data={data}
        addExercise={addExercise}
        removeExercise={removeExercise}
        editExercise={editExercise}
        setTotalTime={setTotalTime}
        endRoutineFunction={() => {setPlay(false)}}
        touchedCard={touchedCard}
      />

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
          zIndex: 10,
          backgroundColor: play ? "red" : "green",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        content={play ? "🛑" : "▶"}
      />
    </div>
  );
}

export default App;
