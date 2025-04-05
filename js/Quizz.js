import { InstructionsView } from "./views/InstructionsView.js";
import { QuestionView } from "./views/QuestionView.js";
import { EndingView } from "./views/EndingView.js";
import { fetchJson, sanitizeQuizzData } from "./utils.js"


/**
 * Classe principale gérant le quizz
 */
export class Quizz {
  /**
   * Initialise un nouveau quizz
   */
  constructor(container, defaultFilename) {
    this.quizzData = [];
    this.answers = [];
    this.userName = "Default";
    this.currentIndex = -1;
    this.container = container;
    this.currentView = null;

    //initialize YT Youtube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.loadInitialQuestions(defaultFilename);
  }

  /**
   * Charge les questions initiales depuis un fichier JSON
   */
  async loadInitialQuestions(filename) {
    fetchJson(filename, (data) => {
      this.quizzData = sanitizeQuizzData(data);
      this.answers = new Array(this.quizzData.questions.length).fill("");
      this.showInstructions();
    })
  }

  /**
   * Affiche les instructions du quizz
   */
  showInstructions() {
    if (this.currentView) {
      this.currentView.stopTimer?.();
    }

    this.currentView = new InstructionsView(
      this.container,
      () => this.next(),
      (data) => {
        this.quizzData = sanitizeQuizzData(data);
        this.answers = new Array(this.quizzData.questions.length).fill("");
      },
      (userName) => { this.userName = userName; }
    );

    this.currentView.render();
  }



  /**
   * Affiche l'écran de fin du quizz
   */
  showEnding() {
    if (this.currentView) {
      this.currentView.stopTimer?.();
    }
    const currentdate = new Date();
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const answerData = {
      quizzName: this.quizzData.quizzName,
      userName: this.userName,
      date: `${zeroPad(currentdate.getDate(), 2)}/${zeroPad(currentdate.getMonth() + 1, 2)}/${zeroPad(currentdate.getFullYear(), 4)}`,
      time: `${zeroPad(currentdate.getHours(), 2)}:${zeroPad(currentdate.getMinutes(), 2)}:${zeroPad(currentdate.getSeconds(), 2)}`,
      answers: this.answers,
    }
    this.currentView = new EndingView(this.container, answerData, () => {
      this.currentIndex = -2;
      this.next();
    });

    this.currentView.render();
  }

  /**
   * Affiche une question
   */
  showQuestion() {
    if (this.currentView) {
      this.currentView.stopTimer?.();
    }

    const question = this.quizzData.questions[this.currentIndex];

    this.currentView = new QuestionView(
      this.container,
      question,
      this.currentIndex,
      this.quizzData.questions.length,
      this.answers[this.currentIndex],
      (index, answer) => {
        this.answers[index] = answer;
      },
      () => this.next()
    );

    this.currentView.render();
  }

  /**
   * Passe à la question suivante ou à l'écran approprié
   */
  next() {
    this.currentIndex += 1;

    if (this.currentIndex < 0) {
      this.showInstructions();
    } else if (this.currentIndex >= this.quizzData.questions.length) {
      this.showEnding();
    } else {
      this.showQuestion();
    }
  }
}
