
class Quizz {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.currentIndex = -1;
        this.divElement = document.getElementById('quizz');
        this.timePerQuestion = 3000;
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
        descElement.innerHTML = "You have a limited time to answer each question. <br> Please do not leave or reload the page during a round.";
        questionDiv.appendChild(descElement);

        // const inputDescElement = document.createElement('p');
        // inputDescElement.textContent = "Select a file f";
        // questionDiv.appendChild(inputDescElement);


        const fileBtnElement = document.createElement('button');
        questionDiv.appendChild(fileBtnElement);
        const labelElement = document.createElement('label');
        labelElement.htmlFor = "file-upload";
        labelElement.textContent = "Load Questions"
        fileBtnElement.appendChild(labelElement);
        fileBtnElement.onclick = function () {
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
        button.textContent = "Start round"
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
        catElement.textContent = "Congratulations ! The quizz is over";
        questionDiv.appendChild(catElement);

        const descElement = document.createElement('p');
        descElement.textContent = "Please save your answers";
        questionDiv.appendChild(descElement);

        const saveButton = document.createElement('button');
        questionDiv.appendChild(saveButton);
        saveButton.textContent = "Save"
        saveButton.onclick = function () {
            saveTemplateAsFile("answers.json", self.answers)
        }

        const resetButton = document.createElement('button');
        questionDiv.appendChild(resetButton);
        resetButton.textContent = "New Round"
        resetButton.onclick = function () {
            self.currentIndex = -2;
            self.next();
        }

    }

    createAudioElement(question, parent) {
        console.log("createAudioElement")
        const element = document.createElement('p');
        element.textContent = "🎶  Music is on play  🎶"
        // 🎼🎵 🎶 ♩ ♪ ♬ ♫ 𝄞
        parent.appendChild(element);

        if (question.link.includes("youtube.com")) {
            console.log("youtube")
            const divElement = document.createElement('div');
            divElement.className = "yt-embed-holder";
            divElement.style="visibility:hidden;"
            parent.appendChild(divElement);

            const iframeElement = document.createElement('iframe');
            const link = question.link.split("?")[0] + "?autoplay=1&rel=0&controls=0&modestbranding=0"
            iframeElement.src = link;
            iframeElement.style = "height:0px";
            divElement.appendChild(iframeElement);

            divElement.autoplay = true;
        }
        else {
            console.log("normal")

            const audioElement = document.createElement('audio');
            audioElement.src = question.link;
            audioElement.autoplay = true;
            // to start the audio at a specific time stamp
            // element.addEventListener('loadedmetadata', function() {
            //     this.currentTime = 0;
            //   }, false);
            parent.appendChild(audioElement);
        }
    }

    createVideoElement(question, parent) {

        if (question.link.includes("youtube.com")) {
            console.log("youtube")
            const divElement = document.createElement('div');
            divElement.className = "yt-embed-holder";
            parent.appendChild(divElement);

            const iframeElement = document.createElement('iframe');
            const link = question.link.split("?")[0] + "?autoplay=1&rel=0&controls=0&modestbranding=0"
            iframeElement.src = link;
            divElement.appendChild(iframeElement);

            divElement.autoplay = true;
        }
        else {
            const element = document.createElement('video');
            element.className = "myvideo";
            element.src = question.link;
            element.autoplay = true;
            // to start the audio at a specific time stamp
            // element.addEventListener('loadedmetadata', function() {
            //     this.currentTime = 0;
            //   }, false);
            parent.appendChild(element);
        }
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
        labelElement.textContent = "Answer:";
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
        labelElement.textContent = "Answer:";
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

    createQuestionElement(question, parent) {
        if (question.question_type == "audio") { this.createAudioElement(question, parent); }
        else if (question.question_type == "video") { this.createVideoElement(question, parent); }
        else if (question.question_type == "image") { this.createImageElement(question, parent); }
        else if (question.question_type == "text") { this.createTextElement(question, parent); }

    }
    createAnswerElement(question, parent) {
        if (question.answer_type == "single") { this.createSingleElement(question, parent); }
        else if (question.answer_type == "multi") { this.createMultiElement(question, parent); }

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
        timeElement.textContent = "Time left: " + (self.remainingTime / 1000.0).toFixed(1) + "s";
        questionDiv.appendChild(timeElement);

        // Update the count down every 1 second
        self.interval = setInterval(function () {
            self.remainingTime -= self.decrementTime;
            if (self.remainingTime < 0) {
                clearInterval(self.interval);
                self.remainingTime = self.timePerQuestion;
                self.next();
            }
            timeElement.textContent = "Time left: " + (self.remainingTime / 1000.0).toFixed(1) + "s";
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