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

export function sanitize(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  // const reg = /[&<>"'/]/ig;
  const reg = /[&<>"]/ig;
  return string.replace(reg, (match) => (map[match]));
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

export function sanitizeQuizzData(data) {
  data.date = sanitize(data.date);
  data.time = sanitize(data.time);
  data.creator = sanitize(data.creator);
  data.quizzName = sanitize(data.quizzName);
  for (let question of data.questions) {
    question.category = sanitize(question.category);
    question.description = sanitize(question.description);
    question.question_type = sanitize(question.question_type);
    question.answer_type = sanitize(question.answer_type);
    if (!question.answer_type) {
      question.answer = sanitize(question.answer);
    }
    question.points = isNumber(question.points) ? question.points : 0;
    question.time = isNumber(question.time) ? question.time : 0;
  }

  return data;
}

export function sanitizeAnswerData(userData) {
  userData.date = sanitize(userData.date);
  userData.time = sanitize(userData.time);
  userData.userName = sanitize(userData.userName);
  userData.quizzName = sanitize(userData.quizzName);
  for (let i = 0, l = userData.answers.length; i < l; ++i) {
    userData.answers[i] = sanitize(userData.answers[i]);
  }
  return userData;
}

export function secondsToHMS(durationInSeconds) {
  let remainingTime = durationInSeconds;
  const hours = Math.floor(remainingTime / 3600);
  remainingTime = remainingTime - hours * 3600
  const minutes = Math.floor(remainingTime / 60);
  remainingTime = remainingTime - minutes * 60;
  const seconds = Math.ceil(remainingTime);
  return { "hours": hours, "minutes": minutes, "seconds": seconds };
}

export function createInputText(msg) {
  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.className = "label is-medium";
  label.textContent = msg;
  field.appendChild(label);


  const control = document.createElement("div");
  control.className = "control";
  field.appendChild(control);

  const input = document.createElement("input");
  control.append(input);
  input.className = "input is-focused is-primary"
  input.type = "text";

  return field;
}

export function createLoadFileButton(msg, name, hasName = true) {
  const container = document.createElement("div");
  container.className = "file is-primary is-centered" + (hasName ? " has-name" : "");

  const label = document.createElement("label");
  container.appendChild(label);
  label.className = "file-label";

  const input = document.createElement("input");
  label.appendChild(input);
  input.className = "file-input";
  input.type = "file";
  input.name = name;

  const file_cta = document.createElement("span");
  label.appendChild(file_cta);
  file_cta.className = "file-cta";

  // const file_icon = document.createElement("span");
  // file_cta.appendChild(file_icon);
  // file_icon.className="file-icon";

  // const i = document.createElement("i");
  // file_icon.appendChild(i);
  // i.className="fas fa-upload";

  const file_label = document.createElement("span");
  file_cta.appendChild(file_label);
  file_label.className = "file-label";
  file_label.textContent = msg;

  if (hasName) {
    const file_name = document.createElement("span");
    label.appendChild(file_name);
    file_name.className = "file-name";
    file_name.textContent = "Aucun fichier chargé";
  }


  return container;
}