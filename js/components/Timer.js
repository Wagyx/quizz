/**
 * Classe gérant le compte à rebours pour chaque question
 */
export class Timer {
  /**
   * @param {number} timePerQuestion - Temps alloué pour chaque question (ms)
   * @param {Function} onTimeUp - Fonction à appeler quand le temps est écoulé
   */
  constructor(timePerQuestion, onTimeUp) {
    this.timePerQuestion = timePerQuestion; //milliseconds
    this.decrementTime = 1000/25; //milliseconds
    this.startTime = new Date();
    this.interval = null;
    this.onTimeUp = onTimeUp;
    this.timeElement = null;
  }

  /**
   * Ajoute l'élément d'affichage du temps à un conteneur
   * @param {HTMLElement} container - Élément conteneur
   */
  appendTimerToContainer(container) {
    this.timeElement = document.createElement("progress");
    this.timeElement.className="progress is-primary";
    const now = new Date();
    this.timeElement.value = now - this.startTime;
    this.timeElement.max = this.timePerQuestion;
    container.appendChild(this.timeElement);
  }

  /**
   * Démarre le compte à rebours
   */
  start() {
    this.reset();

    this.interval = setInterval(() => {
      const now = new Date();
      const elapsedTime = now - this.startTime
      const remainingTime = this.timePerQuestion - elapsedTime;

      if (remainingTime < 0) {
        this.stop();
        if (this.onTimeUp) {
          this.onTimeUp();
        }
      } else if (this.timeElement) {
        this.timeElement.value = elapsedTime;
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
    this.startTime = new Date();
  }
}
