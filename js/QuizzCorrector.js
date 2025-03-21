import { CorrectionView } from "./views/CorrectionView.js";
import { fetchJson, loadLocalJson, sanitize } from "./utils.js"

export class QuizzCorrector {

    constructor(container) {
        this.container = container;
        this.quizzData = {};
        this.usersAnswers = [];
        this.currentIndex = 0;

        //initialize YT Youtube
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.loadInitialQuestions("questions/quizz-test.json");
        this.loadInitialAnswers("questions/answers-test.json")
        this.loadInitialAnswers("questions/answers2-test.json")
        this.loadInitialAnswers("questions/answers3-test.json")

        // this.showLoadPage();
    }


    /**
     * Charge les questions initiales depuis un fichier JSON
     */
    async loadInitialQuestions(filename) {
        fetchJson(filename, (data) => {
            this.quizzData = data;
            this.quizzData.date = sanitize(this.quizzData.date);
            this.quizzData.time = sanitize(this.quizzData.time);
            this.quizzData.creator = sanitize(this.quizzData.creator);
            this.quizzData.quizzName = sanitize(this.quizzData.quizzName);
            this.showLoadPage();
        })
    }

    /**
     * Charge les questions initiales depuis un fichier JSON
    */
    async loadInitialAnswers(filename) {
        fetchJson(filename, (data) => {
            const userData = data;
            userData.date = sanitize(userData.date);
            userData.time = sanitize(userData.time);
            userData.userName = sanitize(userData.userName);
            userData.quizzName = sanitize(userData.quizzName);
            for (let i = 0, l = userData.answers.length; i < l; ++i) {
                userData.answers[i] = sanitize(userData.answers[i]);
            }
            userData.id = this.usersAnswers.length;
            userData.points = new Array(userData.answers.length).fill(0);
            this.usersAnswers.push(userData);
            this.showLoadPage();
        })
    }

    /**
     * Charge les questions depuis un fichier
     * @param {File} file - Fichier JSON contenant les questions
     */
    async loadQuestionsFromFile(file, onload) {
        loadLocalJson(file, (data) => {
            this.quizzData = data;
            this.quizzData.date = sanitize(this.quizzData.date);
            this.quizzData.time = sanitize(this.quizzData.time);
            this.quizzData.creator = sanitize(this.quizzData.creator);
            this.quizzData.quizzName = sanitize(this.quizzData.quizzName);
            onload();
        });
    }

    /**
   * Charge les questions depuis un fichier
   * @param {File} file - Fichier JSON contenant les questions
   */
    async loadAnswersFromFile(file, onload) {
        loadLocalJson(file, (userData) => {
            userData.date = sanitize(userData.date);
            userData.time = sanitize(userData.time);
            userData.userName = sanitize(userData.userName);
            userData.quizzName = sanitize(userData.quizzName);
            for (let i = 0, l = userData.answers.length; i < l; ++i) {
                userData.answers[i] = sanitize(userData.answers[i]);
            }
            userData.id = this.usersAnswers.length;
            userData.points = new Array(userData.answers.length).fill(0);
            this.usersAnswers.push(userData);
            onload();
        });
    }

    questionToHtmlString() {
        const maxPoints = this.quizzData.questions.map((x) => parseInt(sanitize("" + x.points), 10)).reduce((x, s) => x + s, 0);
        return `<u>Infos du quizz</u></br>
        Nom : ${this.quizzData.quizzName}</br>
        Date : ${this.quizzData.date}</br>
        Heure : ${this.quizzData.time}</br>
        Questions : ${this.quizzData.questions.length}</br>
        Points : ${maxPoints}`;
    }

    showLoadPage() {
        if (this.container.firstElementChild) {
            this.container.removeChild(this.container.firstElementChild);
        }
        const containerDiv = document.createElement("div");
        this.container.appendChild(containerDiv);

        const titleElement = document.createElement("h3");
        titleElement.textContent = "Correction";
        containerDiv.appendChild(titleElement);


        const questElement = document.createElement("p");
        questElement.innerHTML = this.questionToHtmlString();
        containerDiv.appendChild(questElement);


        const answersElement = document.createElement("p");
        answersElement.innerHTML = `<u>Réponses chargées (${this.usersAnswers.length})</u>`;
        containerDiv.appendChild(answersElement);

        if (this.usersAnswers.length > 0) {

            const tableElement = document.createElement("table");
            tableElement.className = "center";
            containerDiv.appendChild(tableElement);
            {
                const tableHeader = document.createElement("tr");
                for (const el of ["Quizz", "Joueur", "Date", "Heure", "Réponses"]) {
                    const element = document.createElement("th");
                    element.innerText = el;
                    tableHeader.appendChild(element)
                }
                tableElement.appendChild(tableHeader);
            }

            for (let userData of this.usersAnswers) {
                const tableRow = document.createElement("tr");
                for (const el of [userData.quizzName, userData.userName, userData.date, userData.time, userData.answers.length]) {
                    const element = document.createElement("td");
                    element.innerText = el;
                    tableRow.appendChild(element)
                }
                tableElement.appendChild(tableRow);
            }
        }



        // Bouton pour charger des questions
        {
            const fileBtnElement = document.createElement("button");
            containerDiv.appendChild(fileBtnElement);

            const labelElement = document.createElement("label");
            labelElement.htmlFor = "questions-upload";
            labelElement.textContent = "Charger les questions";
            fileBtnElement.appendChild(labelElement);

            fileBtnElement.onclick = () => {
                labelElement.click();
            };

            const inputElement = document.createElement("input");
            containerDiv.appendChild(inputElement);
            inputElement.type = "file";
            inputElement.id = "questions-upload";
            inputElement.accept = "application/json";

            inputElement.addEventListener("change", () => {
                if (inputElement.files.length == 1) {
                    this.loadQuestionsFromFile(inputElement.files[0], () => {
                        this.showLoadPage();
                    });
                }
            });
        }

        {
            const fileBtnElement = document.createElement("button");
            containerDiv.appendChild(fileBtnElement);

            const labelElement = document.createElement("label");
            labelElement.htmlFor = "answers-upload";
            labelElement.textContent = "Charger les réponses des joueurs";
            fileBtnElement.appendChild(labelElement);
            fileBtnElement.onclick = () => { labelElement.click(); };

            const inputElement = document.createElement("input");
            containerDiv.appendChild(inputElement);
            inputElement.type = "file";
            inputElement.id = "answers-upload";
            inputElement.accept = "application/json";
            inputElement.multiple = true;

            inputElement.addEventListener("change", () => {
                for (let file of inputElement.files) {
                    this.loadAnswersFromFile(file, () => {
                        this.showLoadPage();
                    });
                }
            });
        }

        // Bouton pour reset les joueurs
        const resetButton = document.createElement("button");
        containerDiv.appendChild(resetButton);
        resetButton.textContent = "Reset Joueurs";
        resetButton.onclick = () => {
            this.usersAnswers = [];
            this.showLoadPage();
        };

        // Bouton pour démarrer
        const startButton = document.createElement("button");
        containerDiv.appendChild(startButton);
        startButton.textContent = "Commencer la correction";

        startButton.onclick = () => {
            //sanitarize input here and send error message
            this.showCorrection();
        };
    }


    showCorrection() {

        const question = this.quizzData.questions[this.currentIndex];
        const usersAnswer = [];
        for (let ans of this.usersAnswers) {
            usersAnswer.push({ id: ans.id, name: ans.userName, answer: ans.answers[this.currentIndex], point: ans.points[this.currentIndex] });
        }

        this.currentView = new CorrectionView(
            this.container,
            question,
            this.currentIndex,
            this.quizzData.questions.length,
            usersAnswer,
            () => this.previous(),
            () => this.next(),
            (id, point) => {
                this.usersAnswers[id].points[this.currentIndex] = point;
            },
        );

        this.currentView.render();
    }


    showResults() {
        if (this.container.firstElementChild) {
            this.container.removeChild(this.container.firstElementChild);
        }

        const questionDiv = document.createElement("div");
        this.container.appendChild(questionDiv);

        const titleElement = document.createElement("h3");
        titleElement.textContent = "Résultats";
        questionDiv.appendChild(titleElement);

        {
            const descElement = document.createElement("p");
            descElement.innerText = "☆*:.｡. o(≧▽≦)o .｡.:*☆";
            questionDiv.appendChild(descElement);
        }

        const tableElement = document.createElement("table");
        tableElement.className = "center";
        questionDiv.appendChild(tableElement);
        {
            const tableHeader = document.createElement("tr");
            for (const el of ["Nom", "Points"]) {
                const element = document.createElement("th");
                element.innerText = el;
                tableHeader.appendChild(element)
            }
            tableElement.appendChild(tableHeader);
        }

        const maxPoints = this.quizzData.questions.map((x) => parseInt(sanitize("" + x.points), 10)).reduce((x, s) => x + s, 0);

        const results = [];
        for (let name in this.usersAnswers) {
            const userAnswer = this.usersAnswers[name];
            const totalPoints = userAnswer.points.reduce((x, s) => x + s, 0);
            results.push({ name: userAnswer.userName, points: totalPoints });
        }
        results.sort((a, b) => a.points - b.points);
        results.reverse();

        for (let result of results) {
            const tableRow = document.createElement("tr");
            for (const el of [result.name, `${result.points}/${maxPoints}`]) {
                const element = document.createElement("td");
                element.innerText = el;
                tableRow.appendChild(element)
            }
            tableElement.appendChild(tableRow);
        }

        // {
        //   const descElement = document.createElement("p");
        //   descElement.innerText = "et pour le gagnant Champagne ! (*^^)o∀*∀o(^^*)♪";
        //   questionDiv.appendChild(descElement);
        // }


        const prevButton = document.createElement("button");
        prevButton.innerText = "Previous";
        questionDiv.appendChild(prevButton);
        prevButton.onclick = () => { this.previous() };
    }

    previous() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.showCorrection();
    }
    next() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.quizzData.questions.length);
        if (this.currentIndex == this.quizzData.questions.length) {
            this.showResults();
        }
        else {
            this.showCorrection();
        }
    }

}
