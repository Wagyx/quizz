/**
 * Sauvegarde des données sous forme de fichier JSON
 * @param {string} filename - Nom du fichier à créer
 * @param {Object} dataObjToWrite - Données à écrire dans le fichier
 */
export function saveTemplateAsFile(filename, dataObjToWrite) {
  const blob = new Blob([JSON.stringify(dataObjToWrite)], {
    type: "text/json",
  });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
}

export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export async function fetchJson(filename, onload) {
  try {
    const response = await fetch(filename);
    const data = await response.json();
    onload(data);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier:", error);
    this.showInstructions();
  }
}

export async function loadLocalJson(file, onload) {
  try {
    const fileContent = await file.text();
    const data = JSON.parse(fileContent);
    onload(data);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier:", error);
  }
}

