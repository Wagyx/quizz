import { QuizzCorrector } from "./QuizzCorrector.js";


// Initialisation du quizz au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const quizz = new QuizzCorrector(document.getElementById("quizz"));
});
