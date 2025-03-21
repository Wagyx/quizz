import { QuestionRenderer } from "../components/QuestionRenderer.js";
import { CorrectionHandler } from "../components/CorrectionHandler.js";

/**
 * Vue pour afficher une question
 */
export class CorrectionView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Object} question - Question à afficher
   * @param {number} index - Index de la question
   * @param {number} total - Nombre total de questions
   * @param {Array} usersAnswer - Réponses des utilisateurs
   * @param {string} answer - Réponse actuelle (si elle existe)
   * @param {Function} onPrevious - Fonction appelée quand la réponse change
   * @param {Function} onNext - Fonction appelée quand la réponse change
   * @param {Function} onChange - Fonction appelée quand la réponse change
   */
  constructor(
    container,
    question,
    index,
    total,
    usersAnswer,
    onPrevious,
    onNext,
    onChange
  ) {
    this.container = container;
    this.question = question;
    this.index = index;
    this.total = total;
    this.usersAnswer = usersAnswer;
    this.onPrevious = onPrevious;
    this.onNext = onNext;

    this.questionRenderer = new QuestionRenderer();
    this.correctionHandler = new CorrectionHandler(this.question.points, onChange);
  }

  /**
   * Affiche la vue de la question
   */
  render() {
    this.clear();

    const questionDiv = document.createElement("div");
    this.container.appendChild(questionDiv);

    // Affichage de la catégorie
    const catElement = document.createElement("h3");
    catElement.textContent = this.question.category;
    questionDiv.appendChild(catElement);

    // Affichage de la description
    const descElement = document.createElement("p");
    descElement.textContent = `Question ${this.index + 1}/${this.total} : ${
      this.question.description
    }`;
    questionDiv.appendChild(descElement);

    // Rendu de la question (audio, vidéo, image ou texte)
    this.questionRenderer.renderQuestion(this.question, questionDiv);

    // Rendu de l'interface de réponse
    this.correctionHandler.renderInterface( questionDiv, this.usersAnswer, this.question.answer );

    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    questionDiv.appendChild(prevButton);
    prevButton.onclick = ()=>{this.onPrevious()};
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    questionDiv.appendChild(nextButton);
    nextButton.onclick = ()=>{this.onNext()};


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
