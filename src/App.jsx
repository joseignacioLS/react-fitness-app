import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Routine from "./components/Routine/Routine";
import New from "./components/New/New";
import { useEffect, useState } from "react";
import Edit from "./components/Edit/Edit";
import localStorageService from "./shared/services/localStorageService";

function App() {
  const [exercises, setExercises] = useState([]);

  const localStorage = new localStorageService();

  const addExercise = (exercise) => {
    setExercises((oldValue) => {
      const newValue = [...oldValue, exercise];
      const updatedValue = newValue.map((v, id) => {
        return { ...v, id };
      });
      localStorage.setItem("routine", updatedValue);
      return updatedValue;
    });
  };

  const editExercise = (id) => {
    return (values) => {
      setExercises((oldValue) => {
        const updatedValue = oldValue.map((v) => {
          return v.id.toString() === id ? values : v;
        });

        localStorage.setItem("routine", updatedValue);
        return updatedValue;
      });
    };
  };

  const removeExercise = (id) => {
    setExercises((oldValue) => {
      const newValue = oldValue.filter((v) => v.id !== id);
      const updatedValue = newValue.map((v, id) => {
        return { ...v, id };
      });

      localStorage.setItem("routine", updatedValue);
      return updatedValue;
    });
  };

  useEffect(() => {
    const routine = localStorage.getItem("routine");
    setExercises(routine || []);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Routine exercises={exercises} removeExercise={removeExercise} />
          }
        />
        <Route path="/new" element={<New addExercise={addExercise} />} />
        <Route
          path="/edit/:id"
          element={<Edit editExercise={editExercise} exercises={exercises} />}
        />
        <Route path="*" element={<Routine />} />
      </Routes>
    </div>
  );
}

export default App;
