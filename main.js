
class Quizz {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.currentIndex = -1;
        this.divElement = document.getElementById('quizz');
        this.timePerQuestion = 2000;
        this.decrementTime = 100;
        this.remainingTime = 0;
        this.interval = undefined;
        const self = this;
        (async function () {
            const response = await fetch("quizz-test.json");
            self.questions = await response.json();
            self.answers = new Array(self.questions.length).fill('');
            self.showInstructions();
        })();
    }

    showInstructions() {
        const self = this;

        if (this.divElement.firstElementChild) {
            this.divElement.removeChild(this.divElement.firstElementChild);
        }
        const questionDiv = document.createElement('div');
        this.divElement.appendChild(questionDiv);

        const catElement = document.createElement('h3');
        catElement.textContent = "Instructions";
        questionDiv.appendChild(catElement);

        const descElement = document.createElement('p');
        descElement.textContent = "You have 10 seconds to answer each question";
        questionDiv.appendChild(descElement);

        // const inputDescElement = document.createElement('p');
        // inputDescElement.textContent = "Select a file f";
        // questionDiv.appendChild(inputDescElement);


        const fileBtnElement = document.createElement('button');
        questionDiv.appendChild(fileBtnElement);
        const labelElement = document.createElement('label');
        labelElement.htmlFor = "file-upload";
        labelElement.textContent = "Load"
        fileBtnElement.appendChild(labelElement);
        fileBtnElement.onclick = function(){
            labelElement.click();
        }

        const inputElement = document.createElement('input');
        questionDiv.appendChild(inputElement);
        inputElement.type = "file";
        inputElement.id = "file-upload";
        inputElement.accept = "application/json";
        inputElement.addEventListener("change", () => {
            if (inputElement.files.length == 1) {
                (async function () {
                    const response = await inputElement.files[0].text();
                    self.questions = JSON.parse(response);
                    self.answers = new Array(self.questions.length).fill('');
                })();
            }
        });

        const button = document.createElement('button');
        questionDiv.appendChild(button);
        button.textContent = "Start"
        button.onclick = function () {
            self.next();
        }
    }

    showEnding() {
        self = this;

        if (this.divElement.firstElementChild) {
            this.divElement.removeChild(this.divElement.firstElementChild);
        }
        const questionDiv = document.createElement('div');
        this.divElement.appendChild(questionDiv);

        const catElement = document.createElement('h3');
        catElement.textContent = "Félicitations";
        questionDiv.appendChild(catElement);

        const descElement = document.createElement('p');
        descElement.textContent = "Vous avez terminé, n'oubliez pas de soumettre vos réponses";
        questionDiv.appendChild(descElement);

        const saveButton = document.createElement('button');
        questionDiv.appendChild(saveButton);
        saveButton.textContent = "Sauvegarder les réponses"
        saveButton.onclick = function () {
            saveTemplateAsFile("answers.json", self.answers)
        }

        const resetButton = document.createElement('button');
        questionDiv.appendChild(resetButton);
        resetButton.textContent = "Reset"
        resetButton.onclick = function () {
            self.currentIndex = -2;
            self.next();
        }

    }

    createAudioElement(question, parent) {
        const element = document.createElement('audio');
        element.src = question.link;
        element.autoplay = true;
        // to start the audio at a specific time stamp
        // element.addEventListener('loadedmetadata', function() {
        //     this.currentTime = 0;
        //   }, false);
        parent.appendChild(element);
    }

    createVideoElement(question, parent) {
        const element = document.createElement('video');
        element.src = question.link;
        element.autoplay = true;
        // to start the audio at a specific time stamp
        // element.addEventListener('loadedmetadata', function() {
        //     this.currentTime = 0;
        //   }, false);
        parent.appendChild(element);
    }

    createImageElement(question, parent) {
        const element = document.createElement('img');
        element.src = question.link;
        parent.appendChild(element);
    }

    createTextElement(question, parent) { }

    createSingleElement(question, parent) {
        const self = this;
        const labelElement = document.createElement('p');
        labelElement.textContent = "Réponse:";
        parent.appendChild(labelElement);
        const answerElement = document.createElement('input');
        parent.appendChild(answerElement);
        answerElement.type = "text";
        answerElement.focus();

        answerElement.onkeyup = function () {
            self.answers[self.currentIndex] = answerElement.value;
        }
    }
    createMultiElement(question, parent) {
        const self = this;
        const labelElement = document.createElement('p');
        labelElement.textContent = "Réponse:";
        parent.appendChild(labelElement);
        const answerElement = document.createElement('div');
        answerElement.className = "btn-group";
        parent.appendChild(answerElement);
        const buttons = [];
        for (let q of question.propositions) {
            const button = document.createElement('button');
            button.className = "unselected";
            button.textContent = q;
            button.onclick = function () {
                for (let b of buttons) {
                    b.className = "unselected";
                }
                button.className = "selected";
                self.answers[self.currentIndex] = q;
            };
            answerElement.appendChild(button);
            buttons.push(button);
        }
    }

    createQuestionElement(question,parent){
        if (question.question_type== "audio"){this.createAudioElement(question,parent);}
        else if (question.question_type== "video"){this.createVideoElement(question,parent);}
        else if (question.question_type== "image"){this.createImageElement(question,parent);}
        else if (question.question_type== "text"){this.createTextElement(question,parent);}

    }
    createAnswerElement(question,parent){
        if(question.answer_type == "single"){this.createSingleElement(question,parent);}
        else if(question.answer_type == "multi"){this.createMultiElement(question,parent);}

    }

    showQuestion() {
        const self = this;
        this.remainingTime = this.timePerQuestion; //milliseconds

        const question = this.questions[this.currentIndex];
        if (this.divElement.firstElementChild) {
            this.divElement.removeChild(this.divElement.firstElementChild);
        }
        const questionDiv = document.createElement('div');
        this.divElement.appendChild(questionDiv);

        const catElement = document.createElement('h3');
        catElement.textContent = question.category;
        questionDiv.appendChild(catElement);

        const descElement = document.createElement('p');
        descElement.textContent = `Question ${this.currentIndex + 1}/${this.answers.length} : ${question.description}`;//Question : " + question.description;
        questionDiv.appendChild(descElement);

        this.createQuestionElement(question, questionDiv);
        this.createAnswerElement(question, questionDiv);

        const timeElement = document.createElement('p');
        timeElement.textContent = "Temps restant: " + (self.remainingTime / 1000.0).toFixed(1) + "s";
        questionDiv.appendChild(timeElement);

        // Update the count down every 1 second
        self.interval = setInterval(function () {
            self.remainingTime -= self.decrementTime;
            if (self.remainingTime < 0) {
                clearInterval(self.interval);
                self.remainingTime = self.timePerQuestion;
                self.next();
            }
            timeElement.textContent = "Temps restant: " + (self.remainingTime / 1000.0).toFixed(1) + "s";
        }, this.decrementTime);

    }

    next() {
        this.currentIndex += 1;
        if (this.currentIndex < 0) {
            this.showInstructions();
        }
        else if (this.currentIndex >= this.questions.length) {
            this.showEnding();
        }
        else {
            this.showQuestion();
        }
    }
}

const quizz = new Quizz();

const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
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
    link.remove()
};