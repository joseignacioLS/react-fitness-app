const updateExercisesIds = (exercises) => {
  return exercises.map((v, id) => {
    if (v.type === "routine") {
      v.data = updateExercisesIds(v.data);
    }
    return { ...v, id };
  });
};

export default updateExercisesIds;
