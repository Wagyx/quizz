import { shuffle } from "../utils.js";

/**
 * Classe responsable de l'affichage et de la gestion des réponses
 */
export class AnswerHandler {
  /**
   * @param {Function} onAnswerChanged - Fonction à appeler quand une réponse est modifiée
   */
  constructor(onAnswerChanged) {
    this.onAnswerChanged = onAnswerChanged;
  }

  /**
   * Crée et affiche l'interface de réponse selon le type
   * @param {Object} question - Objet question
   * @param {HTMLElement} container - Élément conteneur
   * @param {number} questionIndex - Index de la question actuelle
   * @param {string} currentAnswer - Réponse actuelle (si elle existe)
   */
  renderAnswerInterface(
    question,
    container,
    questionIndex,
    currentAnswer = ""
  ) {
    switch (question.answer_type) {
      case "single":
        this.createSingleElement(
          question,
          container,
          questionIndex,
          currentAnswer
        );
        break;
      case "multi":
        this.createMultiElement(
          question,
          container,
          questionIndex,
          currentAnswer
        );
        break;
    }
  }

  /**
   * Crée une interface de réponse texte
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   * @param {number} questionIndex - Index de la question
   * @param {string} currentAnswer - Réponse actuelle (si elle existe)
   */
  createSingleElement(question, parent, questionIndex, currentAnswer) {
    const labelElement = document.createElement("p");
    labelElement.textContent = "Réponse:";
    parent.appendChild(labelElement);

    const answerElement = document.createElement("input");
    answerElement.type = "text";
    answerElement.value = currentAnswer;
    parent.appendChild(answerElement);
    answerElement.focus();

    answerElement.onkeyup = () => {
      if (this.onAnswerChanged) {
        this.onAnswerChanged(questionIndex, answerElement.value);
      }
    };
  }

  /**
   * Crée une interface de réponse à choix multiples
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   * @param {number} questionIndex - Index de la question
   * @param {string} currentAnswer - Réponse actuelle (si elle existe)
   */
  createMultiElement(question, parent, questionIndex, currentAnswer) {
    const labelElement = document.createElement("p");
    labelElement.textContent = "Réponse:";
    parent.appendChild(labelElement);

    const answerElement = document.createElement("div");
    answerElement.className = "btn-group";
    parent.appendChild(answerElement);

    const propositions = [...question.propositions];
    shuffle(propositions);

    const buttons = [];
    for (let proposition of propositions) {
      const button = document.createElement("button");
      button.className =
        proposition === currentAnswer ? "selected" : "unselected";
      button.textContent = proposition;

      button.onclick = () => {
        for (let b of buttons) {
          b.className = "unselected";
        }
        button.className = "selected";

        if (this.onAnswerChanged) {
          this.onAnswerChanged(questionIndex, proposition);
        }
      };

      answerElement.appendChild(button);
      buttons.push(button);
    }
  }
}
