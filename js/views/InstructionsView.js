/**
 * Vue pour afficher les instructions du quizz
 */
export class InstructionsView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Function} onStart - Fonction à appeler quand l'utilisateur démarre
   * @param {Function} onQuestionsLoaded - Fonction à appeler quand les questions sont chargées
   * @param {Function} onUserName - Fonction à appeler quand l'utilisateur ajoute son nom
   */
  constructor(container, onStart, onQuestionsLoaded, onUserName) {
    this.container = container;
    this.onStart = onStart;
    this.onQuestionsLoaded = onQuestionsLoaded;
    this.onUserName = onUserName;
  }

  /**
   * Affiche la vue des instructions
   */
  render() {
    this.clear();

    const questionDiv = document.createElement("div");
    this.container.appendChild(questionDiv);

    const titleElement = document.createElement("h3");
    titleElement.textContent = "Instructions";
    questionDiv.appendChild(titleElement);

    const descElement = document.createElement("p");
    descElement.innerHTML =
      "Vous avez un temps limité pour répondre à chaque question. <br> Veuillez ne pas quitter ou recharger la page pendant un tour.";
    questionDiv.appendChild(descElement);

    // champ pour entrer le nom de l'utilisateur
    {
      const labelElement2 = document.createElement("label");
      labelElement2.htmlFor = "user-name";
      labelElement2.textContent = "Veuillez entrer votre nom d'utilisateur";
      questionDiv.appendChild(labelElement2);

      const answerElement = document.createElement("input");
      questionDiv.appendChild(answerElement);
      answerElement.type = "text";
      answerElement.id = "user-name";

      answerElement.onkeyup = () => {
        if (this.onUserName) {
          this.onUserName(answerElement.value);
        }
      };
    }

    // Bouton pour charger des questions
    {
      const fileBtnElement = document.createElement("button");
      questionDiv.appendChild(fileBtnElement);

      const labelElement = document.createElement("label");
      labelElement.htmlFor = "file-upload";
      labelElement.textContent = "Charger des questions";
      fileBtnElement.appendChild(labelElement);

      fileBtnElement.onclick = () => {
        labelElement.click();
      };

      const inputElement = document.createElement("input");
      questionDiv.appendChild(inputElement);
      inputElement.type = "file";
      inputElement.id = "file-upload";
      inputElement.accept = "application/json";

      inputElement.addEventListener("change", () => {
        if (inputElement.files.length == 1) {
          this.loadQuestionsFromFile(inputElement.files[0]);
        }
      });

      // Bouton pour démarrer
      const startButton = document.createElement("button");
      questionDiv.appendChild(startButton);
      startButton.textContent = "Commencer";

      startButton.onclick = () => {
        if (this.onStart) {
          this.onStart();
        }
      };
    }

  }

  /**
   * Charge les questions depuis un fichier
   * @param {File} file - Fichier JSON contenant les questions
   */
  async loadQuestionsFromFile(file) {
    try {
      const fileContent = await file.text();
      const questions = JSON.parse(fileContent);

      if (this.onQuestionsLoaded) {
        this.onQuestionsLoaded(questions);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
    }
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
