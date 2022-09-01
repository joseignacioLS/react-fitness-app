class Beeper {
  constructor () {
    this.beepSound = new Audio("/assets/sounds/beep.wav")
  }
  beep() {
    this.beepSound.play()
  }
}

export default Beeper