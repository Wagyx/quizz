

function createRow(array, tag) {
  const trElement = document.createElement("tr");
  for (const el of array){
    const element = document.createElement(tag);
    element.innerText = el;
    trElement.appendChild(element)
  }
  return trElement;
}

/**
 * Classe responsable de l'affichage et de la gestion des réponses
 */
export class CorrectionHandler{
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
  renderInterface( container, usersAnswer, answer) {
    
    const tableElement = document.createElement("table");
    tableElement.className = "center";
    container.appendChild(tableElement);
    const tableHeader = createRow(["Réponse: ", answer, `Points (${this.points})`], "th");
    tableElement.appendChild(tableHeader);

    for (const u of usersAnswer){
      const trElement = document.createElement("tr");
      const userElement = document.createElement("td");
      userElement.innerText = u.name;
      trElement.appendChild(userElement)

      const ansElement = document.createElement("td");
      ansElement.innerText = u.answer;
      trElement.appendChild(ansElement)
      
      const pointsElement = document.createElement("td");
      trElement.appendChild(pointsElement)
      const buttons = [];
      for (let pt=0; pt<=this.points; ++pt){
        const button = document.createElement("button");
        button.className = u.point == pt ? "validAnswer" : "nonValidAnswer";
        button.innerText = pt;
        button.onclick = () => {
          for (let b of buttons){
            b.className = "nonValidAnswer";
          }
          button.className = "validAnswer";
          this.onChange(u.id, pt);
        };
        pointsElement.appendChild(button);
        buttons.push(button)
      }
      tableElement.appendChild(trElement);


    }

    
    
    // use this idea on a button
    // answerElement.onkeyup = () => {
    //   if (this.onAnswerChanged) {
    //     this.onAnswerChanged(questionIndex, answerElement.value);
    //   }
    // };
  } 

}
