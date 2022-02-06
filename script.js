const QUESTIONS_COUNT = 10;
const OPTIONS_COUNT = 4;
const operators = ["-", "+", "*"];
const questionsContainer = document.getElementById("questions");
const timerDisplay = document.getElementById("timer");
const questions = [];
const selection = [];
const results = [];
var startTime;
var timerIntervalId;
var duration = 0;

class Question {
  constructor(leftOperand, operator, rightOperand) {
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
    this.string = `${leftOperand} ${operator} ${rightOperand}`;
    this.answer = eval(this.string);
    this.options = generateOptions(this.answer);
  }
}

function generateOptions(correctAnswer) {
  const options = [correctAnswer];
  while (options.length < OPTIONS_COUNT) {
    const newOption = correctAnswer + getRandomNumber(-10, 10);
    if (options.includes(newOption)) {
      continue;
    }
    options.push(newOption);
  }

  const swapWith = getRandomNumber(0, OPTIONS_COUNT - 1);
  if (swapWith != 0) {
    options[0] = options[swapWith];
    options[swapWith] = correctAnswer;
  }

  return options;
}

function getRandomNumber(lower, upper) {
  const range = upper - lower + 1;
  return Math.floor(Math.random() * range + lower);
}

function generateQuestion() {
  const leftOperand = getRandomNumber(1, 10);
  const operator = operators[getRandomNumber(0, 2)];
  const rightOperand = getRandomNumber(1, 10);
  return new Question(leftOperand, operator, rightOperand);
}

function attachQuestion(question, questionNumber) {
  const title = document.createElement("h2");

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question", "hasSubmittedState");
  questionsContainer.appendChild(questionContainer);

  title.appendChild(document.createTextNode(question.string));
  title.setAttribute("class", "question--title hasSubmittedState");
  questionContainer.appendChild(title);

  const optionsDiv = document.createElement("div");
  optionsDiv.setAttribute("class", "question--options hasSubmittedState");

  for (let i = 0; i < OPTIONS_COUNT; i++) {
    const id = getOptionId(questionNumber, i);
    const button = document.createElement("button");
    button.setAttribute("id", id);
    button.setAttribute("type", "button");
    button.setAttribute(
      "class",
      `question--button question--button--${i} hasSubmittedState`
    );
    button.appendChild(document.createTextNode(question.options[i]));
    button.addEventListener("click", () => {
      onSelection(questionNumber, i);
    });
    optionsDiv.appendChild(button);
  }
  questionContainer.appendChild(optionsDiv);
}

function onSelection(questionNumber, optionNumber) {
  selection[questionNumber] = optionNumber;
  for (let i = 0; i < OPTIONS_COUNT; i++) {
    const id = getOptionId(questionNumber, i);
    const button = document.getElementById(id);
    i == optionNumber
      ? button.classList.add("question--button--selected")
      : button.classList.remove("question--button--selected");
  }

  verifyCompletion();
}

function verifyCompletion() {
  let isCompleted = true;
  for (let i = 0; i < QUESTIONS_COUNT; i++) {
    if (isNaN(selection[i])) {
      isCompleted = false;
      break;
    }
  }
  if (isCompleted) {
    document
      .getElementById("submit")
      .classList.add("submit--button--completed");
  }

  return isCompleted;
}

function checkAnswers() {
  const isCompleted = verifyCompletion();
  if (!isCompleted) {
    return;
  }

  clearInterval(timerIntervalId);
  updateTimer();

  for (let i = 0; i < QUESTIONS_COUNT; i++) {
    const question = questions[i];
    const selectedOption = selection[i];
    const selectedAnswer = question.options[selectedOption];
    results[i] = selectedAnswer == question.answer;
  }
  showScore();
}

function showScore() {
  for (let qn = 0; qn < QUESTIONS_COUNT; qn++) {
    for (let opt = 0; opt < OPTIONS_COUNT; opt++) {
      const button = document.getElementById(getOptionId(qn, opt));
      button.disabled = true;

      // Check if this option is the correct answer
      if (questions[qn].options[opt] == questions[qn].answer) {
        button.classList.add("question--button--correct");
        continue;
      }

      // Check if this option was selected (would be wrong)
      if (selection[qn] == opt) {
        button.classList.add("question--button--wrong");
      }
    }
  }

  score = results.reduce((sum, isCorrect) => (isCorrect ? sum + 1 : sum), 0);
  const scoreDisplay = document.getElementById("score");
  const maxScoreDisplay = document.getElementById("maxScore");
  const scoreSheet = document.getElementById("scoresheet");

  scoreDisplay.innerText = score;
  maxScoreDisplay.innerText = `/${QUESTIONS_COUNT}`;
  timerDisplay.style.position = "static";

  for (element of document.getElementsByClassName("hasSubmittedState")) {
    element.classList.add("submitted");
  }

  scoreSheet.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}

function getOptionId(questionNumber, optionNumber) {
  return `question${questionNumber}_option${optionNumber}`;
}

function updateTimer() {
  const currentTime = Date.now();
  duration = currentTime - startTime;

  timerDisplay.innerText = formatTime(duration);
}

function formatTime(timeInMilliseconds) {
  const time = splitTime(timeInMilliseconds);
  return `${time.minutes.toString().padStart(2, "0")}:${time.seconds
    .toString()
    .padStart(2, "0")}.${time.milliseconds.toString().padEnd(3, "0")}`;
}

function splitTime(timeInMilliseconds) {
  const minutes = Math.floor(timeInMilliseconds / 60_000);
  const seconds = Math.floor((timeInMilliseconds % 60_000) / 1_000);
  const milliseconds = timeInMilliseconds % 1_000;

  return {
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
  };
}

function startGame() {
  for (let i = 0; i < QUESTIONS_COUNT; i++) {
    const newQuestion = generateQuestion();
    questions.push(newQuestion);
    attachQuestion(newQuestion, i);
  }

  document.getElementById("cover").classList.add("hidden");

  startTime = Date.now();
  timerIntervalId = setInterval(updateTimer, 1000 / 60);
}

function init() {
  document.getElementById("start").addEventListener("click", startGame)
}

init();


