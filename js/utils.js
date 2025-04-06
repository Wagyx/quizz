/**
 * Sauvegarde des données sous forme de fichier JSON
 * @param {string} filename - Nom du fichier à créer
 * @param {Object} dataObjToWrite - Données à écrire dans le fichier
 */
export function saveAsJsonFile(filename, dataObjToWrite) {
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

export function isNumber(text) { return /^-?[\d.]+(?:e-?\d+)?$/.test(text); }

export function sanitizeNumber(text, defaultValue=0){
  return isNumber(text) ? text : defaultValue;
}

export function clamp(x,min,max){
  return Math.min(Math.max(x,min),max);
}

function sanitizeAndError(value,msg){
  if (value) {
    return sanitize(value);
  }
  else {
    console.log(msg);
  }
}

export function sanitizeQuizzData(data) {
  data.date = sanitizeAndError(data.date,"date is missing or undefined in quizz file");
  data.time = sanitizeAndError(data.time,"time is missing or undefined in quizz file");
  data.creator = sanitizeAndError(data.creator,"creator is missing or undefined in quizz file");
  data.quizzName = sanitizeAndError(data.quizzName,"quizzName is missing or undefined in quizz file");
  for (let question of data.questions) {
    question.category = sanitizeAndError(question.category,"category is missing or undefined in question");
    question.description = sanitizeAndError(question.description,"description is missing or undefined in question");
    question.question_type = sanitizeAndError(question.question_type,"question_type is missing or undefined in question");
    question.answer_type = sanitizeAndError(question.answer_type,"answer_type is missing or undefined in question");
    if (question.answer) {
      question.answer = sanitize(question.answer);
    }
    question.points = sanitizeNumber(question.points, 0);
    question.time = sanitizeNumber(question.time,0);
  }

  return data;
}

export function sanitizeAnswerData(userData) {
  userData.date = sanitizeAndError(userData.date, "date is missing or undefined in answer file");
  userData.time = sanitizeAndError(userData.time, "time is missing or undefined in answer file");
  userData.userName = sanitizeAndError(userData.userName, "userName is missing or undefined in answer file");
  userData.quizzName = sanitizeAndError(userData.quizzName, "quizzName is missing or undefined in answer file");
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

export function createInputNumber(msg, min, max) {
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
  input.type = "number";
  input.min=min;
  input.max=max;

  return field;
}

export function createDropdown(labelName, options) {
  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.className = "label is-medium";
  label.textContent = labelName;
  field.appendChild(label);

  const control = document.createElement("div");
  control.className = "control";
  field.appendChild(control);

  const divSelect = document.createElement("div");
  divSelect.className = "select";
  control.appendChild(divSelect);

  const select = document.createElement("select");
  divSelect.appendChild(select);
  for (let opt of options){
    const el = document.createElement("option");
    el.textContent = opt;
    select.appendChild(el);
  }
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


export function reverseKeyValues(obj) {
  const reversed = {};
  for (let key of Object.keys(obj)){
    reversed[obj[key]]=key;
  }
  return reversed;
}