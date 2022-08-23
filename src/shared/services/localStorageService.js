import Timer from "./timer"

class localStorageService {
  getItem(key) {
    const recovered = JSON.parse(window.localStorage.getItem(key))
    if (!recovered) return null
    const parsedTimers = recovered.map(ele => {
      ele.completionF = new Timer(ele.completionF.time/1000)
      return ele
    })
    return parsedTimers
  }
  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export default localStorageService;