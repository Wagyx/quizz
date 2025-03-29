import { QuestionRenderer } from "../components/QuestionRenderer.js";
import { AnswerHandler } from "../components/AnswerHandler.js";
import { Timer } from "../components/Timer.js";

/**
 * Vue pour afficher une question
 */
export class QuestionView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Object} question - Question à afficher
   * @param {number} index - Index de la question
   * @param {number} total - Nombre total de questions
   * @param {string} currentAnswer - Réponse actuelle (si elle existe)
   * @param {Function} onAnswerChanged - Fonction appelée quand la réponse change
   * @param {Function} onTimeUp - Fonction appelée quand le temps est écoulé
   */
  constructor(
    container,
    question,
    index,
    total,
    currentAnswer,
    onAnswerChanged,
    onTimeUp
  ) {
    this.container = container;
    this.question = question;
    this.index = index;
    this.total = total;
    this.currentAnswer = currentAnswer;

    this.questionRenderer = new QuestionRenderer();
    this.answerHandler = new AnswerHandler(onAnswerChanged);
    this.timer = new Timer(this.question.time * 1000, onTimeUp);
  }

  /**
   * Affiche la vue de la question
   */
  render() {
    this.clear();

    const questionDiv = document.createElement("div");
    this.container.appendChild(questionDiv);
    questionDiv.className = "content is-medium has-text-centered"

    // Affichage de la catégorie
    const catElement = document.createElement("h3");
    catElement.className = "title is-3";
    catElement.textContent = this.question.category;
    questionDiv.appendChild(catElement);

    // Affichage de la description
    const descElement = document.createElement("p");
    descElement.innerHTML = `<em>Question ${this.index + 1}/${this.total} pour ${this.question.points} point${this.question.points>1?"s":""}</em> </br>\ 
    <strong>${this.question.description}</strong>`;
    questionDiv.appendChild(descElement);

    // Rendu de la question (audio, vidéo, image ou texte)
    this.questionRenderer.renderQuestion(this.question, questionDiv);

    // Rendu de l'interface de réponse
    this.answerHandler.renderAnswerInterface(
      this.question,
      questionDiv,
      this.index,
      this.currentAnswer
    );

    // Ajout et démarrage du timer
    this.timer.appendTimerToContainer(questionDiv);
    this.timer.start();
  }

  /**
   * Arrête le timer
   */
  stopTimer() {
    this.timer.stop();
  }

  /**
   * Nettoie le conteneur
   */
  clear() {
    if (this.container.firstElementChild) {
      this.container.removeChild(this.container.firstElementChild);
    }
  }
}
