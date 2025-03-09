import { saveTemplateAsFile } from "../utils.js";

/**
 * Vue pour afficher l'écran de fin du quizz
 */
export class EndingView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Array<string>} answers - Réponses de l'utilisateur
   * @param {Function} onNewRound - Fonction appelée pour commencer une nouvelle partie
   */
  constructor(container, answers, onNewRound) {
    this.container = container;
    this.answers = answers;
    this.onNewRound = onNewRound;
  }

  /**
   * Affiche la vue de fin
   */
  render() {
    this.clear();

    const questionDiv = document.createElement("div");
    this.container.appendChild(questionDiv);

    const titleElement = document.createElement("h3");
    titleElement.textContent = "Félicitations ! Le quizz est terminé";
    questionDiv.appendChild(titleElement);

    const descElement = document.createElement("p");
    descElement.textContent = "Veuillez sauvegarder vos réponses";
    questionDiv.appendChild(descElement);

    // Bouton pour sauvegarder les réponses
    const saveButton = document.createElement("button");
    questionDiv.appendChild(saveButton);
    saveButton.textContent = "Sauvegarder";

    saveButton.onclick = () => {
      saveTemplateAsFile("answers.json", this.answers);
    };

    // Bouton pour commencer une nouvelle partie
    const resetButton = document.createElement("button");
    questionDiv.appendChild(resetButton);
    resetButton.textContent = "Nouvelle partie";

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
