import { QuizzEditor } from "./QuizzEditor.js";


// Initialisation du quizz au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const quizz = new QuizzEditor(document.getElementById("quizz"));
});
