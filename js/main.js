import { Quizz } from "./Quizz.js";

// Initialisation du quizz au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const quizz = new Quizz(document.getElementById("quizz"),"questions/quizz-test.json");
});
