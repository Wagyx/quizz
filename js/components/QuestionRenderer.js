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
    element.textContent = "🎶  If music does not play, click here  🎶";
    parent.appendChild(element);

    const divElement = document.createElement("div");
    parent.appendChild(divElement);

    const playInfoELement = document.createElement("p");
    divElement.appendChild(playInfoELement);

    if (question.link.includes("youtube.com") || question.link.includes("youtu.be")) {


      const playerElement = document.createElement("div");
      divElement.appendChild(playerElement);
      playerElement.id = "player";
      playerElement.className = "yt-audio";

      const url = question.link.split("?")[0].split("/")
      const ytid = url[url.length - 1];

      let hasError = false;
      let player = new YT.Player('player', {
        height: '1',
        width: '1',
        videoId: ytid,
        playerVars: {
          "autoplay": 1,
          'playsinline': 1,
          "controls": 0,
          "disablekb": 1,
          "fs": 0,
          "iv_load_policy": 3,
        },

        events: {
          'onReady': (event) => {
            event.target.mute();
            event.target.setVolume(100);
          },
          'onStateChange': (event) => {
            console.log("YT player state", event.data)
          },
          "onError": () => {
            hasError = true;
            playInfoELement.textContent = "Error : Could not load the video";
          }
        }
      });

      parent.onmouseover = () => {
        if (player && player.unMute && player.isMuted() && !hasError) {
          player.unMute();
          playInfoELement.textContent = "Playing ...";
        }
      }
    } else {
      const audioElement = document.createElement("audio");
      audioElement.onplay = () => {
        playInfoELement.textContent = "Playing ...";
      }
      audioElement.onerror = () => {
        playInfoELement.textContent = "Error : Could not load the video";
      }
      audioElement.src = question.link;
      audioElement.autoplay = true;
      divElement.appendChild(audioElement);
    }
  }

  /**
   * Crée un élément vidéo
   * @param {Object} question - Données de la question
   * @param {HTMLElement} parent - Élément parent
   */
  createVideoElement(question, parent) {
    const divElement = document.createElement("div");
    divElement.className = "yt-embed-holder";
    parent.appendChild(divElement);

    if (question.link.includes("youtube.com") || question.link.includes("youtu.be")) {

      const playerElement = document.createElement("div");
      divElement.appendChild(playerElement);
      playerElement.id = "yt-player";

      const url = question.link.split("?")[0].split("/")
      const ytid = url[url.length - 1];

      let player = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: ytid,
        playerVars: {
          "autoplay": 1,
          'playsinline': 1,
          "controls": 0,
          "disablekb": 1,
          "fs": 0,
          "iv_load_policy": 3,
          rel: 0,
        },

        events: {
          'onReady': (event) => {
            event.target.mute();
            event.target.setVolume(100);
          },
          'onStateChange': (event) => {
            console.log("YT player state", event.data)
          },
          // "onError": () => { }
        }
      });

      const playInfoELement = document.createElement("p");
      divElement.appendChild(playInfoELement);
      playInfoELement.textContent = "Click here to get sound"

      parent.onmouseover = () => {
        if (player && player.unMute && player.isMuted()) {
          player.unMute();
        }
      }

    } else {

      const element = document.createElement("video");
      element.className = "myvideo";
      element.src = question.link;
      element.autoplay = true;
      divElement.appendChild(element);
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
