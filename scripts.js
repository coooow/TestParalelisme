var tema1 = [];
var tema1copy = [];
var j = [0, 1, 2, 3];

const menu = document.getElementById("menu");
const testMenu = document.getElementById("testMenu");
const finishedPopup = document.getElementById("finished");
const popupBg = document.getElementById("popupBg");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");
const footer = document.getElementById("footer");

let currentQuestion;
var selectedTema;
var firstAnswer = true;
var answered = true;

// Load questions from JSON file

function nextQuestion() {
    if (!answered) {
        remindOpen();
        return;
    }
    unselect();
    resetImg();
    firstAnswer = true;

    let qTitle = document.getElementById("questionText");

    if (selectedTema === 1) {
        if (tema1copy.length === 0) {
            showFinished();
            return;
        }
        let n = Math.floor(Math.random() * tema1copy.length);
        currentQuestion = tema1copy.splice(n, 1)[0];
    }

    if (currentQuestion.hasOwnProperty('imgfile') && currentQuestion.imgfile != "") {
        document.getElementById("questionImage").style.display = "block";
        document.getElementById("questionImg").src = currentQuestion.imgfile;
    }

    qTitle.innerHTML = currentQuestion.question;
    j.sort(() => Math.random() - 0.5);
    for (let i = 1; i < 5; i++) {
        let answer = currentQuestion.answers[j[i - 1]].answer;
        let a = document.getElementById("label" + i);
        a.innerHTML = answer;
    }

    var count = document.getElementById("counterText");
    var c = count.innerHTML.split("/");
    var correct = parseInt(c[0]);
    var total = parseInt(c[1]);
    total++;
    count.innerHTML = correct + "/" + total;

    answered = false;
}

$(document).ready(function () {
    resetCounter();
    fetch("questions.json")
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            tema1 = data.tema1 || [];
        })
        .catch(error => console.error("Error loading JSON:", error));
});

function answer() {
    let selectedAnswer = isChecked();
    correct.classList.add("hidden");
    wrong.classList.add("hidden");

    for (let i = 0; i < 4; i++) {
        if (i === selectedAnswer) {
            if (currentQuestion.answers[j[i]].correct) {
                correct.classList.remove("hidden");
                if (firstAnswer) {
                    var count = document.getElementById("counterText");
                    var c = count.innerHTML.split("/");
                    var correctCount = parseInt(c[0]);
                    var total = parseInt(c[1]);
                    correctCount++;
                    count.innerHTML = correctCount + "/" + total;
                }
            } else {
                wrong.classList.remove("hidden");
            }
        }
    }

    if (firstAnswer) {
        firstAnswer = false;
    }

    answered = true;
    remindClose();
}

function unselect() {
    correct.classList.add("hidden");
    wrong.classList.add("hidden");
    let answers = document.getElementsByName("answer");
    for (let i = 0; i < 4; i++) {
        answers[i].checked = false;
    }
}

function resetCounter() {
    var count = document.getElementById("counterText");
    count.innerHTML = "0/0";
}

function resetQuestions() {
    tema1copy = tema1.slice();
}

function selectTema(tema) {
    selectedTema = tema;
    testMenu.classList.remove("hidden");
    menu.classList.add("hidden");
    footer.classList.add("hidden");
    resetQuestions();
    nextQuestion();
    answered = false;
}

function tornarMenu() {
    testMenu.classList.add("hidden");
    finishedPopup.classList.add("hidden");
    popupBg.classList.add("hidden");
    menu.classList.remove("hidden");
    footer.classList.remove("hidden");
    resetCounter();
    remindClose();
    answered = true;
}

function isChecked() {
    let selectedAnswer = null;

    if (document.getElementById("testMenu").classList.contains("hidden")) {
        return;
    }

    for (let i = 1; i < 5; i++) {
        let answer = document.getElementById("answer" + i);
        if (answer.checked) {
            selectedAnswer = i - 1;
            break;
        }
    }
    if (selectedAnswer === null) {
        alert("Please select an answer!");
    }
    return selectedAnswer;
}

function showFinished() {
    finishedPopup.classList.remove("hidden");
    popupBg.classList.remove("hidden");
}

function retry() {
    finishedPopup.classList.add("hidden");
    popupBg.classList.add("hidden");
    resetQuestions();
    resetCounter();
    nextQuestion();
    answered = false;
    firstAnswer = true;
}

function remindOpen() {
    var clase = document.getElementById("remind").className;
    clase = clase.replace("hidden", "visible");
    document.getElementById("remind").className = clase;
}

function remindClose() {
    var clase = document.getElementById("remind").className;
    clase = clase.replace("visible", "hidden");
    document.getElementById("remind").className = clase;
}

function resetImg() {
    document.getElementById("questionImage").style.display = "none";
    document.getElementById("questionImg").src = "";
}