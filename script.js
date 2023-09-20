//loadAll();
let rightquestions = 0;
let currentQuestion = 0;
let quiz_section = "";
let quiz_name = "";
let AUDIO_RIGHT = new Audio('/audio/right.mp3');
let AUDIO_WRONG = new Audio('/audio/wrong.mp3');
let next_question = true;


function rendern() {
    contentDisable();
    loadMenu();
}

function loadMenu() {
    toggelNavbar();
    quiz_name = "";
    document.getElementById('highscore').innerHTML = "";
    document.getElementById('content').innerHTML = menu_card;
    for (let i = 0; i < quiz_data.length; i++) {
        const element = quiz_data[i];
        document.getElementById('games').innerHTML += `
            <li onclick="loadGame('${element['quiz_name']}')" class="quit-answer-card list-group-item d-flex justify-content-between align-items-center">
            ${element['quiz_name']}
            <span id="number-of-questions" class="badge bg-primary rounded-pill">${quiz_data[i]['questions_data'].length} Fragen</span>
            </li>
            `;
    }
    rightquestions = 0;
    currentQuestion = 0;
}

function loadImpressum() {
    toggelNavbar();
    document.getElementById('content').innerHTML = impressum;
    document.getElementById('highscore').innerHTML = "";
}

function loadHighscore() {
    toggelNavbar();
    document.getElementById('content').innerHTML = "";
    document.getElementById('highscore').innerHTML = `
    <div class="highscore-tempalte card main-card">
    <h1 class="text-center mt-2">Highscore</h1>
    <img src="./img/highscore.png" alt="">
<div class="accordion accordion-flush" id="accordionFlushExample">
</div>
</div>
`;
    for (let i = 0; i < quiz_data.length; i++) {
        const element = quiz_data[i];
        createTemplateHighscore(element);
        loadHighscoreData(element);
    }

}

function loadHighscoreData(game) {

    for (let j = 0; j < game['highscore-name'].length; j++) {
        const element = game['highscore-name'][j];
        createTamplateHighscoreTable(game, j);
    }
}

function loadGame(quiz) {
    contentDisable();
    quiz_name = quiz;

    for (let i = 0; i < quiz_data.length; i++) {
        const element = quiz_data[i];
        if (element['quiz_name'] == quiz) {
            quiz_section = quiz_data[i]['questions_data'];
            document.getElementById('content').innerHTML = game_card;
            document.getElementById('all-questions').innerHTML = element['questions_data'].length;
            showQuestion();
            document.getElementById('game-img').src = element['img'];
        } else {
        }
    };
}

function loadEndGame() {

    createTemplateEndGame();



    document.getElementById('quiz-name').innerHTML = quiz_name;
    document.getElementById('amount-of-question').innerHTML = quiz_section.length;
    document.getElementById('amount-of-right-questions').innerHTML = rightquestions;
}

function showQuestion() {

    if (currentQuestion >= quiz_section.length) {
        loadEndGame();

    } else {
        let percent = currentQuestion / quiz_section.length;
        percent = Math.round(percent * 100);
        document.getElementById('progress-bar').innerHTML = `${percent}%`;
        document.getElementById('progress-bar').style.width = `${percent}%`;
        let question = quiz_section[currentQuestion];
        document.getElementById('question-number').innerHTML = currentQuestion + 1;
        document.getElementById('questiontext').innerHTML = question['question'];
        document.getElementById('answer_1').innerHTML = question['answer_1'];
        document.getElementById('answer_2').innerHTML = question['answer_2'];
        document.getElementById('answer_3').innerHTML = question['answer_3'];
        document.getElementById('answer_4').innerHTML = question['answer_4'];

    }
}

function answer(answer) {
    let question = quiz_section[currentQuestion];
    let selectedQuestionNumber = answer.slice(-1);
    let idOfRightAnswer = (`answer_${question['right_answer']}`);
    if (next_question == true) {
        if (selectedQuestionNumber == question['right_answer']) {
            document.getElementById(answer).parentNode.classList.add('bg-success');
            rightquestions++;
            AUDIO_RIGHT.play();
            next_question = false;
        } else {
            document.getElementById(answer).parentNode.classList.add('bg-danger');
            document.getElementById(idOfRightAnswer).parentNode.classList.add('bg-success');
            AUDIO_WRONG.play();
            next_question = false;
        }
    }
    document.getElementById('next-button').disabled = false;

}

function nextQuestion() {
    currentQuestion++;
    document.getElementById('next-button').disabled = true;
    next_question = true;
    restAnswerButtons();
    showQuestion();

}

function restAnswerButtons() {
    document.getElementById('answer_1').parentNode.classList.remove('bg-success');
    document.getElementById('answer_1').parentNode.classList.remove('bg-danger');
    document.getElementById('answer_2').parentNode.classList.remove('bg-success');
    document.getElementById('answer_2').parentNode.classList.remove('bg-danger');
    document.getElementById('answer_3').parentNode.classList.remove('bg-success');
    document.getElementById('answer_3').parentNode.classList.remove('bg-danger');
    document.getElementById('answer_4').parentNode.classList.remove('bg-success');
    document.getElementById('answer_4').parentNode.classList.remove('bg-danger');
}

function restartGame() {
    document.getElementById('header-img').src = './img/quiz-2004350_1280.png';
    currentQuestion = 0;
    rightquestions = 0;
    document.getElementById('questioBody').style = "";
    document.getElementById('endScreen').style = "display:none";
    init();
}


function contentDisable() {
    document.getElementById('content').innerHTML = "";

}

function saveHighscore() {
    let highscore_name = document.getElementById('input-name').value

    if (highscore_name.length >= 2) {

        for (let i = 0; i < quiz_data.length; i++) {
            const element = quiz_data[i];

            if (element['quiz_name'] == quiz_name) {
                element['highscore-name'].push(highscore_name);
                element['highscore-points'].push(rightquestions);
                loadHighscore();
                document.getElementById(`flush-collapse${quiz_name}`).classList.add('show');
                saveAll();
            }
        }
    } else {
        document.getElementById('input-name').classList.add('placeholder', 'placeholder_alert');
        document.getElementById('input-name').placeholder = "Bitte einen Namen eingeben";
    }

}

function showHighscore(quiz_name){
    loadHighscore();
    document.getElementById(`flush-collapse${quiz_name}`).classList.add('show');
}

function toggelNavbar(){
//document.getElementById('navbarNavDropdown').classList.remove('show');
//document.getElementById('navbarNavDropdown').classList.remove('collapse');

}

function saveAll() {
    let quiz_dataasText = JSON.stringify(quiz_data);
    localStorage.setItem('quiz_data', quiz_dataasText);
}

function loadAll() {
    let quiz_dataasText = localStorage.getItem('quiz_data');
    if (quiz_dataasText ) {
        quiz_data = JSON.parse(quiz_dataasText);
    }
}