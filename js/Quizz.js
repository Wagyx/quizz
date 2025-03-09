import { InstructionsView } from "./views/InstructionsView.js";
import { QuestionView } from "./views/QuestionView.js";
import { EndingView } from "./views/EndingView.js";

/**
 * Classe principale gérant le quizz
 */
export class Quizz {
  /**
   * Initialise un nouveau quizz
   */
  constructor(container, defaultFilename) {
    this.questions = [];
    this.answers = [];
    this.userName = "Default";
    this.currentIndex = -1;
    this.container = container;
    this.currentView = null;

    this.loadInitialQuestions(defaultFilename);
  }

  /**
   * Charge les questions initiales depuis un fichier JSON
   */
  async loadInitialQuestions(filename) {
    try {
      const response = await fetch(filename);
      this.questions = await response.json();
      this.answers = new Array(this.questions.length).fill("");
      this.showInstructions();
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
      this.showInstructions();
    }
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
      (questions) => {
        this.questions = questions;
        this.answers = new Array(this.questions.length).fill("");
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

    this.currentView = new EndingView(this.container, this.userName, this.answers, () => {
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

    const question = this.questions[this.currentIndex];

    this.currentView = new QuestionView(
      this.container,
      question,
      this.currentIndex,
      this.questions.length,
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
    } else if (this.currentIndex >= this.questions.length) {
      this.showEnding();
    } else {
      this.showQuestion();
    }
  }
}
