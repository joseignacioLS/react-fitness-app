class localStorageService {
  getItem(key) {
    const recovered = JSON.parse(window.localStorage.getItem(key))
    if (!recovered) return null
    return recovered
  }
  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export default localStorageService;