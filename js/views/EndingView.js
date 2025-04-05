import { saveAsJsonFile } from "../utils.js";

/**
 * Vue pour afficher l'écran de fin du quizz
 */
export class EndingView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Object} answerData - Réponses de l'utilisateur
   * @param {Function} onNewRound - Fonction appelée pour commencer une nouvelle partie
   */
  constructor(container, answerData, onNewRound) {
    this.container = container;
    this.answerData = answerData;
    this.onNewRound = onNewRound;
  }

  /**
   * Affiche la vue de fin
   */
  render() {
    this.clear();

    const questionDiv = document.createElement("div");
    this.container.appendChild(questionDiv);
    questionDiv.className = "content is-medium has-text-centered"


    const titleElement = document.createElement("h3");
    titleElement.className = "title is-3";
    titleElement.textContent = `Merci d'avoir joué ${this.answerData.userName} !`;
    questionDiv.appendChild(titleElement);


    const descElement = document.createElement("p");
    descElement.innerHTML = "Veuillez <strong>sauvegarder</strong> vos réponses et les transmettre au correcteur";
    questionDiv.appendChild(descElement);

    const buttons = document.createElement("div");
    buttons.className = "buttons is-centered";
    questionDiv.appendChild(buttons);
    
    // Bouton pour sauvegarder les réponses
    const saveButton = document.createElement("button");
    saveButton.className = "button is-primary is-medium"
    saveButton.textContent = "Sauvegarder";
    buttons.appendChild(saveButton);
    saveButton.onclick = () => {
      saveAsJsonFile("answers.json", this.answerData);
    };

    // Bouton pour commencer une nouvelle partie
    const resetButton = document.createElement("button");
    resetButton.className = "button is-dark is-medium"
    resetButton.textContent = "Nouvelle partie";
    buttons.appendChild(resetButton);

    resetButton.onclick = () => {
      if (this.onNewRound) {
        this.onNewRound();
      }
    };
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
