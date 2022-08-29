import updateExercisesIds from "./exercisesService";

class localStorageService {
  getItem(key) {
    const recovered = JSON.parse(window.localStorage.getItem(key));
    if (!recovered) return null;
    return updateExercisesIds(recovered);
  }
  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export default localStorageService;
