class Speaker {
  constructor() {
    this.speaker = window.speechSynthesis;
  }

  speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = .75;
    utter.lang  ="es-ES";
    this.speaker.speak(utter);
  }
}

export default Speaker;