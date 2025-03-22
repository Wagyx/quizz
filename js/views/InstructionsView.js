import { loadLocalJson, secondsToHMS } from "../utils.js"



function questionToHtmlString(quizzData) {
  const maxPoints = quizzData.questions.map((x) => x.points).reduce((x, s) => x + s, 0);
  const duration = quizzData.questions.map((x) => x.time).reduce((x, s) => x + s, 0);
  const hms = secondsToHMS(duration);
  return `<u>Infos du quizz</u></br>
  Nom : ${quizzData.quizzName}</br>
  Date : ${quizzData.date}</br>
  Heure : ${quizzData.time}</br>
  Questions : ${quizzData.questions.length}</br>
  Points : ${maxPoints}</br>
  Durée : ${hms.hours}h${hms.minutes}min${hms.seconds}s`;

}

/**
 * Vue pour afficher les instructions du quizz
 */
export class InstructionsView {
  /**
   * @param {HTMLElement} container - Élément conteneur
   * @param {Function} onStart - Fonction à appeler quand l'utilisateur démarre
   * @param {Function} onQuizzLoaded - Fonction à appeler quand les questions sont chargées
   * @param {Function} onUserName - Fonction à appeler quand l'utilisateur ajoute son nom
   */
  constructor(container, onStart, onQuizzLoaded, onUserName) {
    this.container = container;
    this.onStart = onStart;
    this.onQuizzLoaded = onQuizzLoaded;
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
      const labelElement = document.createElement("label");
      labelElement.htmlFor = "user-name";
      labelElement.textContent = "Veuillez entrer votre pseudo";
      questionDiv.appendChild(labelElement);

      const answerElement = document.createElement("input");
      labelElement.appendChild(answerElement);
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
      labelElement.textContent = "Charger un quizz";
      fileBtnElement.appendChild(labelElement);

      fileBtnElement.onclick = () => {
        labelElement.click();
      };

      const inputElement = document.createElement("input");
      questionDiv.appendChild(inputElement);
      inputElement.type = "file";
      inputElement.id = "file-upload";
      inputElement.accept = "application/json";
      
      const questElement = document.createElement("p");
      questElement.innerHTML = "Pas de quizz chargé"
      questionDiv.appendChild(questElement);

      inputElement.addEventListener("change", () => {
        if (inputElement.files.length == 1) {
          this.loadQuestionsFromFile(inputElement.files[0],(data)=>{
            questElement.innerHTML = questionToHtmlString(data);
          });
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
  async loadQuestionsFromFile(file, onload) {
    loadLocalJson(file, (data) => {
      onload(data);
      if (this.onQuizzLoaded) {
        this.onQuizzLoaded(data);
      }
    });
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
