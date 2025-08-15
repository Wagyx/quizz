import { saveAsJsonFile, clamp, sanitize, isNumber, createInputText, createDropdown, createInputNumber, reverseKeyValues } from "./utils.js"

export class QuizzEditor {

    constructor(container) {
        this.container = container;
        this.quizzData = {
            quizzName: "sthsht",
            creator: "",
            date: "",
            time: "",
            questions: [],
        };
        this.currentIndex = -1;

        this.hasLink = { "text": false, "image": true, "audio": true, "video": true };

        // this.showLoadPage();
        this.showIntroPage();
    }


    showIntroPage() {
        if (this.container.firstElementChild) {
            this.container.removeChild(this.container.firstElementChild);
        }
        const containerDiv = document.createElement("div");
        containerDiv.className = "content is-medium has-text-centered"
        this.container.appendChild(containerDiv);

        // const titleElement = document.createElement("h3");
        // titleElement.className = "title is-3";
        // titleElement.textContent = "Editeur";
        // containerDiv.appendChild(titleElement);

        const quizzNameField = createInputText("Nom du quizz");
        containerDiv.appendChild(quizzNameField);
        const quizzNameElement = quizzNameField.querySelectorAll("input")[0];
        quizzNameElement.addEventListener("change", (event) => {
            this.quizzData.quizzName = sanitize(event.target.value);
        });

        const creatorNameField = createInputText("Nom du créateur");
        containerDiv.appendChild(creatorNameField);
        const creatorNameElement = creatorNameField.querySelectorAll("input")[0];
        creatorNameElement.addEventListener("change", (event) => {
            this.quizzData.creator = sanitize(event.target.value);
        });

        // Bouton pour démarrer
        const startButton = document.createElement("button");
        startButton.className = "button is-primary is-medium"
        containerDiv.appendChild(startButton);
        startButton.textContent = "Ajouter des questions";

        startButton.onclick = () => {
            this.next();
        };

    }

    showEdition() {
        if (this.container.firstElementChild) {
            this.container.removeChild(this.container.firstElementChild);
        }
        const question = this.quizzData.questions[this.currentIndex];

        const formDiv = document.createElement("div");
        this.container.appendChild(formDiv);

        const titleDiv = document.createElement("h3");
        titleDiv.className = "title is-3";
        titleDiv.textContent = `Question ${this.currentIndex + 1} sur ${this.quizzData.questions.length}`;
        formDiv.appendChild(titleDiv);

        const columnsDiv = document.createElement("div");
        columnsDiv.className = "columns";
        formDiv.appendChild(columnsDiv);

        const categoryField = createInputText("Catégorie");
        categoryField.className += " column";
        columnsDiv.appendChild(categoryField);
        const categoryElement = categoryField.querySelectorAll("input")[0];
        categoryElement.value = question.category;
        categoryElement.addEventListener("change", (event) => {
            question.category = sanitize(event.target.value);
        });

        const pointsField = createInputNumber("Points", 0, 999);
        pointsField.className += " column";
        columnsDiv.appendChild(pointsField);
        const pointsElement = pointsField.querySelectorAll("input")[0];
        pointsElement.value = question.points;
        pointsElement.addEventListener("change", (event) => {
            if (isNumber(event.target.value)) {
                question.points = Math.max(parseInt(event.target.value), event.target.min);
            }
            event.target.value = question.points;
        });

        const timeField = createInputNumber("Durée (en secondes)", 0, 999);
        timeField.className += " column";
        columnsDiv.appendChild(timeField);
        const timeElement = timeField.querySelectorAll("input")[0];
        timeElement.value = question.time;
        timeElement.addEventListener("change", (event) => {
            if (isNumber(event.target.value)) {
                question.time = Math.max(parseInt(event.target.value), event.target.min);
            }
            event.target.value = question.time;
        });

        const questionTypes = { "Texte": "text", "Image": "image", "Audio": "audio", "Vidéo": "video" };
        const questionTypesRev = reverseKeyValues(questionTypes);
        const questionTypeField = createDropdown("Type de la question", Object.keys(questionTypes));
        formDiv.appendChild(questionTypeField);
        const questionTypeElement = questionTypeField.querySelectorAll("select")[0];
        questionTypeElement.value = questionTypesRev[question.question_type];

        // const questionTypeElement = document.createElement("select");

        const descriptionField = createInputText("Question");
        formDiv.appendChild(descriptionField);
        const descriptionElement = descriptionField.querySelectorAll("input")[0];
        descriptionElement.value = question.description;
        descriptionElement.addEventListener("change", (event) => {
            question.description = sanitize(event.target.value);
        });

        const linkField = createInputText("Lien vers le média");
        linkField.hidden = !this.hasLink[question.question_type];
        formDiv.appendChild(linkField);
        const linkElement = linkField.querySelectorAll("input")[0];
        linkElement.value = question.link;
        linkElement.addEventListener("change", (event) => {
            question.link = event.target.value;
            //TODO sanitizing
        });
        questionTypeElement.addEventListener("change", (event) => {
            question.question_type = questionTypes[event.target.value];
            linkField.hidden = !this.hasLink[question.question_type];
        })

        const answerTypes = { "Unique": "single", "Multiple": "multi" };
        const answerTypesRev = reverseKeyValues(answerTypes);
        const answerTypeField = createDropdown("Type de la réponse", Object.keys(answerTypes));
        formDiv.appendChild(answerTypeField);
        const answerTypeElement = answerTypeField.querySelectorAll("select")[0];
        answerTypeElement.value = answerTypesRev[question.answer_type];

        const answerField = createInputText("Réponse");
        formDiv.appendChild(answerField);
        const answerElement = answerField.querySelectorAll("input")[0];
        answerElement.value = question.answer
        answerElement.addEventListener("change", (event) => {
            question.answer = sanitize(event.target.value);
        });

        const propositionsDiv = document.createElement("div");
        formDiv.appendChild(propositionsDiv);
        const propositionsColDiv = document.createElement("div");
        propositionsColDiv.className = "columns";
        propositionsDiv.appendChild(propositionsColDiv);

        const hasPropositions = { "multi": true, "single": false };
        propositionsDiv.hidden = !hasPropositions[question.answer_type];
        // propositionsDiv.hidden = false;
        answerTypeElement.addEventListener("change", (event) => {
            question.answer_type = answerTypes[event.target.value];
            propositionsDiv.hidden = !hasPropositions[question.answer_type];
        });

        const propositionsNames = ["Proposition 1", "Proposition 2", "Proposition 3"];
        for (const i in propositionsNames) {
            const propField = createInputText(propositionsNames[i]);
            propField.className += " column";
            propositionsColDiv.appendChild(propField);
            const propElement = propField.querySelectorAll("input")[0];
            propElement.value = question.propositions[i];
            propElement.addEventListener("change", (event) => {
                question.propositions[i] = sanitize(event.target.value);
            });
        }


        const progressBarElement = document.createElement("progress");
        progressBarElement.className = "progress is-primary";
        progressBarElement.value = this.currentIndex + 1;
        progressBarElement.max = this.quizzData.questions.length;
        formDiv.appendChild(progressBarElement);


        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons is-centered";
        formDiv.appendChild(buttonsDiv);

        const previousButton = document.createElement("button");
        previousButton.className = "button is-primary";
        previousButton.textContent = "Précédent"
        buttonsDiv.appendChild(previousButton);
        previousButton.onclick = () => {
            this.previous();
        };


        const nextButton = document.createElement("button");
        nextButton.className = "button is-primary";
        nextButton.textContent = "Suivant"
        buttonsDiv.appendChild(nextButton);
        nextButton.onclick = () => {
            this.next();
        };


        const saveButton = document.createElement("button");
        saveButton.className = "button is-link";
        saveButton.textContent = "Enregistrer"
        buttonsDiv.appendChild(saveButton);
        saveButton.onclick = () => {
            this.saveQuizzData();
        };

        const delButton = document.createElement("button");
        delButton.className = "button is-danger";
        delButton.textContent = "Supprimer"
        buttonsDiv.appendChild(delButton);
        delButton.onclick = () => {
            this.deleteQuestion();
        };



        // const question = this.quizzData.questions[this.currentIndex];
        // const usersAnswer = [];
        // for (let ans of this.usersAnswers) {
        //     usersAnswer.push({ id: ans.id, name: ans.userName, answer: ans.answers[this.currentIndex], point: ans.points[this.currentIndex] });
        // }

        // this.currentView = new EditionView(
        //     this.container,
        //     question,
        //     this.currentIndex,
        //     this.quizzData.questions.length,
        //     usersAnswer,
        //     () => this.previous(),
        //     () => this.next(),
        //     (id, point) => {
        //         this.usersAnswers[id].points[this.currentIndex] = point;
        //     },
        // );

        // this.currentView.render();
    }


    previous() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.showEdition();
    }
    next() {
        this.currentIndex += 1;
        if (this.currentIndex == this.quizzData.questions.length) {
            this.quizzData.questions.push(this.createEmptyQuestion());
        }
        this.showEdition();
    }

    deleteQuestion() {
        if (this.quizzData.questions.length > 1) {
            this.quizzData.questions.splice(this.currentIndex, 1);
            this.currentIndex = clamp(this.currentIndex, 0, this.quizzData.questions.length - 1);
            this.showEdition();
        }
    }

    saveQuizzData() {
        const filename = `quizz-${this.quizzData.quizzName}.json`;
        const currentdate = new Date();
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        const quizzData = {
            quizzName: this.quizzData.quizzName,
            creator: this.quizzData.creator,
            date: `${zeroPad(currentdate.getDate(), 2)}/${zeroPad(currentdate.getMonth() + 1, 2)}/${zeroPad(currentdate.getFullYear(), 4)}`,
            time: `${zeroPad(currentdate.getHours(), 2)}:${zeroPad(currentdate.getMinutes(), 2)}:${zeroPad(currentdate.getSeconds(), 2)}`,
            questions: [],
        };
        for (const question of this.quizzData.questions) {
            const q = {
                category: question.category,
                description: question.description,
                question_type: question.question_type,
                answer_type: question.answer_type,
                answer: question.answer,
                points: question.points,
                time: question.time,
            };

            if (question.answer_type == "multi") {
                q.propositions = [...question.propositions];
                q.propositions.push(question.answer);
            }
            if (this.hasLink[question.question_type]) {
                q.link = question.link;
            }
            quizzData.questions.push(q);
        }
        saveAsJsonFile(filename, quizzData);
    }

    createEmptyQuestion() {
        return {
            category: "",
            description: "",
            question_type: "text",
            link: "",
            answer_type: "single",
            propositions: [],
            answer: "",
            points: 1,
            time: 30
        };
    }

}
