

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
    const tableHeader = createRow(["Réponse: ", answer], "th");
    tableElement.appendChild(tableHeader);

    for (const u of usersAnswer){
      const trElement = document.createElement("tr");
      const userElement = document.createElement("td");
      userElement.innerText = u.name;
      trElement.appendChild(userElement)
      
      const answerElement = document.createElement("td");
      trElement.appendChild(answerElement)
      const button = document.createElement("button");
      answerElement.appendChild(button);
      button.className = u.point > 0 ? "validAnswer" : "nonValidAnswer";
      button.innerText = u.answer;
      button.onclick = () => {
        if (button.className == "nonValidAnswer"){
          button.className = "validAnswer";
          this.onChange(u.id, this.points);
        }
        else {
          button.className = "nonValidAnswer";
          this.onChange(u.id, 0);
        }
      };
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
