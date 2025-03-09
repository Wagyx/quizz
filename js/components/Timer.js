/**
 * Classe gérant le compte à rebours pour chaque question
 */
export class Timer {
  /**
   * @param {number} timePerQuestion - Temps alloué pour chaque question (ms)
   * @param {Function} onTimeUp - Fonction à appeler quand le temps est écoulé
   */
  constructor(timePerQuestion, onTimeUp) {
    this.timePerQuestion = timePerQuestion;
    this.decrementTime = 100;
    this.remainingTime = timePerQuestion;
    this.interval = null;
    this.onTimeUp = onTimeUp;
    this.timeElement = null;
  }

  /**
   * Ajoute l'élément d'affichage du temps à un conteneur
   * @param {HTMLElement} container - Élément conteneur
   */
  appendTimerToContainer(container) {
    this.timeElement = document.createElement("p");
    this.timeElement.textContent = `Temps restant: ${(
      this.remainingTime / 1000.0
    ).toFixed(1)}s`;
    container.appendChild(this.timeElement);
  }

  /**
   * Démarre le compte à rebours
   */
  start() {
    this.reset();

    this.interval = setInterval(() => {
      this.remainingTime -= this.decrementTime;

      if (this.remainingTime < 0) {
        this.stop();
        if (this.onTimeUp) {
          this.onTimeUp();
        }
      } else if (this.timeElement) {
        this.timeElement.textContent = `Temps restant: ${(
          this.remainingTime / 1000.0
        ).toFixed(1)}s`;
      }
    }, this.decrementTime);
  }

  /**
   * Arrête le compte à rebours
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Réinitialise le temps restant
   */
  reset() {
    this.stop();
    this.remainingTime = this.timePerQuestion;
  }
}
