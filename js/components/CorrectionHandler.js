

function createRow(array, tag) {
  const trElement = document.createElement("tr");
  for (const el of array) {
    const element = document.createElement(tag);
    element.textContent = el;
    trElement.appendChild(element)
  }
  return trElement;
}

/**
 * Classe responsable de l'affichage et de la gestion des réponses
 */
export class CorrectionHandler {
  /**
   * @param {Function} onChange - Fonction à appeler quand une réponse est modifiée
   */
  constructor(points, onChange) {
    this.onChange = onChange;
    this.points = points;
  }


  /**
   * Crée et affiche l'interface de réponse selon le type
   * @param {HTMLElement} container - Élément conteneur
   * @param {Array} usersAnswer- Objet question
   * @param {string} answer - Réponse actuelle (si elle existe)
   */
  renderInterface(container, usersAnswer, answer) {

    const tableElement = document.createElement("table");
    tableElement.className = "table is-bordered is-striped center";
    container.appendChild(tableElement);
    const thead = document.createElement("thead");
    tableElement.appendChild(thead);
    const tableHeader = createRow(["Réponse: ", answer, `Points/${this.points}`], "th");
    tableHeader.className = "is-primary";
    thead.appendChild(tableHeader);

    const tbody = document.createElement("tbody");
    tableElement.appendChild(tbody);
    const validButtonClass = "button is-primary";
    const invalidButtonClass = "button is-primary is-outlined";
    for (const u of usersAnswer) {
      const trElement = document.createElement("tr");
      const userElement = document.createElement("td");
      userElement.textContent = u.name;
      trElement.appendChild(userElement)

      const ansElement = document.createElement("td");
      ansElement.textContent = u.answer;
      trElement.appendChild(ansElement)

      const pointsElement = document.createElement("td");
      trElement.appendChild(pointsElement)

      const buttons = [];
      for (let pt = 0; pt <= this.points; ++pt) {
        const button = document.createElement("button");
        // button.className = "button is-primary"
        button.className = u.point == pt ? validButtonClass : invalidButtonClass;
        button.textContent = pt;
        button.onclick = () => {
          for (let b of buttons) {
            b.className = invalidButtonClass;
          }
          button.className = validButtonClass;
          this.onChange(u.id, pt);
        };
        pointsElement.appendChild(button);
        buttons.push(button)
      }
      tbody.appendChild(trElement);
    }

  }

}
