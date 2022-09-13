import { updateExercisesIds } from "./exerciseService";

class localStorageService {
  getItem(key) {
    const recovered = JSON.parse(window.localStorage.getItem(key));
    if (!recovered) return null;
    if (key === "routine") {
      return updateExercisesIds(recovered);
    }
    return recovered
  }
  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export default localStorageService;
