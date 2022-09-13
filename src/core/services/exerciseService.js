const updateExercisesIds = (exercises) => {
  console.log(exercises)
  return exercises.map((v, id) => {
    if (v.type === "routine") {
      v.data = updateExercisesIds(v.data);
    }
    return { ...v, id };
  });
};

const recursiveSearch = (array, idLink, mode = "", payload = null) => {
  if (idLink.length > 1) {
    array[idLink[0]].data = recursiveSearch(
      array[idLink[0]].data,
      idLink.slice(1),
      mode,
      payload
    );
    return array;
  }
  if (mode === "remove") {
    array.splice(idLink[0], 1);
  }
  if (mode === "edit") {
    array.splice(idLink[0], 1, payload);
  }
  if (mode === "add") {
    array[idLink[0]].data.push(payload);
  }
  return array;
};

export { updateExercisesIds, recursiveSearch };
