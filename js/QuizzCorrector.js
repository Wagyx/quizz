import { CorrectionView } from "./views/CorrectionView.js";
import { fetchJson, loadLocalJson, sanitizeQuizzData, sanitizeAnswerData, createLoadFileButton } from "./utils.js"

export class QuizzCorrector {

    constructor(container) {
        this.container = container;
        this.quizzData = undefined;
        this.usersAnswers = [];
        this.currentIndex = 0;

        //initialize YT Youtube
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // this.loadInitialQuestions("questions/quizz-test.json");
        // this.loadInitialAnswers("questions/answers-test.json")
        // this.loadInitialAnswers("questions/answers2-test.json")
        // this.loadInitialAnswers("questions/answers3-test.json")

        this.showLoadPage();
    }


    /**
     * Charge les questions initiales depuis un fichier JSON
     */
    async loadInitialQuestions(filename) {
        fetchJson(filename, (data) => {
            this.quizzData = sanitizeQuizzData(data);
            this.showLoadPage();
        })
    }

    /**
     * Charge les questions initiales depuis un fichier JSON
    */
    async loadInitialAnswers(filename) {
        fetchJson(filename, (data) => {
            const userData = sanitizeAnswerData(data);
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
            this.quizzData = sanitizeQuizzData(data);
            onload();
        });
    }

    /**
   * Charge les questions depuis un fichier
   * @param {File} file - Fichier JSON contenant les questions
   */
    async loadAnswersFromFile(file, onload) {
        loadLocalJson(file, (data) => {
            const userData = sanitizeAnswerData(data);
            userData.id = this.usersAnswers.length;
            userData.points = new Array(userData.answers.length).fill(0);
            this.usersAnswers.push(userData);
            onload();
        });
    }

    questionToHtmlString() {
        const maxPoints = this.quizzData.questions.map((x) => x.points).reduce((x, s) => x + s, 0);
        return `<strong>Infos du quizz</strong></br>
        Nom : ${this.quizzData.quizzName}</br>
        Date : ${this.quizzData.date}</br>
        Heure : ${this.quizzData.time}</br>
        Questions : ${this.quizzData.questions.length}</br>
        Points : ${maxPoints}`;
    }

    _upDateTableBody(tableElement) {
        let tbody = tableElement.querySelector("tbody");
        if (tbody) {
            tbody.remove()
        }
        tbody = document.createElement("tbody");
        tableElement.appendChild(tbody);
        for (let userData of this.usersAnswers) {
            const tableRow = document.createElement("tr");
            for (const el of [userData.quizzName, userData.userName, userData.date, userData.time, userData.answers.length]) {
                const element = document.createElement("td");
                element.textContent = el;
                tableRow.appendChild(element)
            }
            tbody.appendChild(tableRow);
        }
    }
    
    showLoadPage() {
        if (this.container.firstElementChild) {
            this.container.removeChild(this.container.firstElementChild);
        }
        const containerDiv = document.createElement("div");
        containerDiv.className = "content is-medium has-text-centered"
        this.container.appendChild(containerDiv);
        
        
        const titleElement = document.createElement("h3");
        titleElement.className = "title is-3";
        titleElement.textContent = "Correction";
        containerDiv.appendChild(titleElement);
        
        // Bouton pour charger des questions
        {
            const fileBtnElement = createLoadFileButton("Charger les questions", "questions-upload");
            containerDiv.appendChild(fileBtnElement);
            
            const inputElement = fileBtnElement.querySelector("input[type=file]")
            inputElement.accept = "application/json"
            
            const questElement = document.createElement("p");
            if (this.quizzData){
                questElement.innerHTML = this.questionToHtmlString();
            }
            containerDiv.appendChild(questElement);
            
            // const filenNameElement = fileBtnElement.querySelector(".file-name")
            inputElement.addEventListener("change", () => {
                if (inputElement.files.length == 1) {
                    const fileName = fileBtnElement.querySelector(".file-name");
                    console.log(fileName)
                    fileName.textContent = inputElement.files[0].name;
                    this.loadQuestionsFromFile(inputElement.files[0], () => {
                        questElement.innerHTML = this.questionToHtmlString();
                    });
                }
            });
        }
        
        {
            const fileBtnElement = createLoadFileButton("Charger les réponses", "answers-upload", false);
            containerDiv.appendChild(fileBtnElement);
            
            const inputElement = fileBtnElement.querySelector("input[type=file]")
            inputElement.accept = "application/json"
            inputElement.multiple = true;
            
            const tableElement = document.createElement("table");
            containerDiv.appendChild(tableElement);
            tableElement.className = "table is-bordered is-striped center";
            const thead = document.createElement("thead");
            tableElement.appendChild(thead);
            const tableHeader = document.createElement("tr");
            tableHeader.className = "is-primary";
            for (const el of ["Quizz", "Joueur", "Date", "Heure", "Réponses"]) {
                const element = document.createElement("th");
                element.textContent = el;
                tableHeader.appendChild(element)
            }
            thead.appendChild(tableHeader);
            this._upDateTableBody(tableElement);
           
            inputElement.addEventListener("change", () => {
                for (let file of inputElement.files) {
                    this.loadAnswersFromFile(file, () => {
                        this._upDateTableBody(tableElement);
                    });
                }
            });
        }

        const buttons = document.createElement("div");
        buttons.className = "buttons is-centered";
        containerDiv.appendChild(buttons);

        // Bouton pour reset les joueurs
        const resetButton = document.createElement("button");
        resetButton.className = "button is-primary is-medium"
        buttons.appendChild(resetButton);
        resetButton.textContent = "Reset Joueurs";
        resetButton.onclick = () => {
            this.usersAnswers = [];
            this.showLoadPage();
        };

        // Bouton pour démarrer
        const startButton = document.createElement("button");
        startButton.className = "button is-primary is-medium"
        startButton.textContent = "Commencer la correction";
        buttons.appendChild(startButton);

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
        questionDiv.className = "content is-medium has-text-centered"

        const titleElement = document.createElement("h3");
        titleElement.className = "title is-3";
        titleElement.textContent = "Résultats";
        questionDiv.appendChild(titleElement);

        {
            const descElement = document.createElement("p");
            descElement.textContent = "☆*:.｡. o(≧▽≦)o .｡.:*☆";
            questionDiv.appendChild(descElement);
        }

        const tableElement = document.createElement("table");
        tableElement.className = "table is-bordered is-striped center";
        questionDiv.appendChild(tableElement);
        {
            const thead = document.createElement("thead");
            tableElement.appendChild(thead);
            const tableHeader = document.createElement("tr");
            tableHeader.className = "is-primary";
            for (const el of ["Nom", "Points"]) {
                const element = document.createElement("th");
                element.textContent = el;
                tableHeader.appendChild(element)
            }
            thead.appendChild(tableHeader);
        }

        const maxPoints = this.quizzData.questions.map((x) => x.points).reduce((x, s) => x + s, 0);

        const results = [];
        for (let name in this.usersAnswers) {
            const userAnswer = this.usersAnswers[name];
            const totalPoints = userAnswer.points.reduce((x, s) => x + s, 0);
            results.push({ name: userAnswer.userName, points: totalPoints });
        }
        results.sort((a, b) => a.points - b.points);
        results.reverse();

        const tbody = document.createElement("tbody");
        tableElement.appendChild(tbody);
        for (let result of results) {
            const tableRow = document.createElement("tr");
            for (const el of [result.name, `${result.points}/${maxPoints}`]) {
                const element = document.createElement("td");
                element.textContent = el;
                tableRow.appendChild(element)
            }
            tbody.appendChild(tableRow);
        }

        // {
        //   const descElement = document.createElement("p");
        //   descElement.textContent = "et pour le gagnant Champagne ! (*^^)o∀*∀o(^^*)♪";
        //   questionDiv.appendChild(descElement);
        // }


        const prevButton = document.createElement("button");
        prevButton.className = "button is-primary is-medium"
        prevButton.textContent = "Previous";
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
