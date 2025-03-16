import { InstructionsView } from "./views/InstructionsView.js";
import { QuestionView } from "./views/QuestionView.js";
import { EndingView } from "./views/EndingView.js";
import { fetchJson } from "./utils.js"

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


    //initialize YT
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
    fetchJson(filename,(data)=>{
      this.quizzData = data;
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
        this.quizzData = data;
        this.answers = new Array(this.quizzData.questions.length).fill("");
      },
      (userName) => {this.userName = userName;}
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

    const answerData = {
      "quizzName":this.quizzData.quizzName,
      "userName" : this.userName,
      "date":`${currentdate.getDate()}/${currentdate.getMonth()+1}/${currentdate.getFullYear()}`,
      "time":`${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`,
      "answers":this.answers,
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
