/**
 * Classe responsable de l'affichage des différents types de questions
 */
export class QuestionRenderer {
  /**
   * Crée et affiche un élément selon le type de question
   * @param {Object} question - Objet question à afficher
   * @param {HTMLElement} container - Élément conteneur
   */
  renderQuestion(question, container) {
    switch (question.question_type) {
      case "audio":
        this.createAudioElement(question, container);
        break;
      case "video":
        this.createVideoElement(question, container);
        break;
      case "image":
        this.createImageElement(question, container);
        break;
      case "text":
        this.createTextElement(question, container);
        break;
    }
  }

  /**
   * Crée un élément audio
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   */
  createAudioElement(question, parent) {
    const element = document.createElement("p");
    element.textContent = "🎶  Music is on play  🎶";
    parent.appendChild(element);

    if (question.link.includes("youtube.com")) {
      const divElement = document.createElement("div");
      divElement.className = "yt-embed-holder";
      divElement.style = "visibility:hidden;";
      parent.appendChild(divElement);

      const iframeElement = document.createElement("iframe");
      const link =
        question.link.split("?")[0] +
        "?autoplay=1&rel=0&controls=0&modestbranding=0";
      iframeElement.src = link;
      iframeElement.style = "height:0px";
      divElement.appendChild(iframeElement);
    } else {
      const audioElement = document.createElement("audio");
      audioElement.src = question.link;
      audioElement.autoplay = true;
      parent.appendChild(audioElement);
    }
  }

  /**
   * Crée un élément vidéo
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   */
  createVideoElement(question, parent) {
    if (question.link.includes("youtube.com")) {
      const divElement = document.createElement("div");
      divElement.className = "yt-embed-holder";
      parent.appendChild(divElement);

      const iframeElement = document.createElement("iframe");
      const link =
        question.link.split("?")[0] +
        "?autoplay=1&rel=0&controls=0&modestbranding=0";
      iframeElement.src = link;
      divElement.appendChild(iframeElement);
    } else {
      const element = document.createElement("video");
      element.className = "myvideo";
      element.src = question.link;
      element.autoplay = true;
      parent.appendChild(element);
    }
  }

  /**
   * Crée un élément image
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   */
  createImageElement(question, parent) {
    const element = document.createElement("img");
    element.src = question.link;
    parent.appendChild(element);
  }

  /**
   * Crée un élément texte
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   */
  createTextElement(question, parent) {
    // Implémentation si nécessaire
  }
}
