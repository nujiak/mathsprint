const QUESTIONS_COUNT = 3
const OPTIONS_COUNT = 4
const operators = ["-", "+", "*"]
const questionsContainer = document.getElementById("questions")
const questions = []
const selection = []
const results = []

class Question {
  constructor(leftOperand, operator, rightOperand) {
    this.leftOperand = leftOperand
    this.operator = operator
    this.rightOperand = rightOperand
    this.string = `${leftOperand} ${operator} ${rightOperand}`
    this.answer = eval(this.string)
    this.options = generateOptions(this.answer)
  }
}

function generateOptions(correctAnswer) {
  const options = [correctAnswer]
  while (options.length < OPTIONS_COUNT) {
    const newOption = correctAnswer + getRandomNumber(-10, 10)
    if (options.includes(newOption)) {
      continue
    }
    options.push(newOption)
  }

  const swapWith = getRandomNumber(0, OPTIONS_COUNT - 1)
  if (swapWith != 0) {
    options[0] = options[swapWith]
    options[swapWith] = correctAnswer
  }

  return options
}

function getRandomNumber(lower, upper) {
  const range = upper - lower + 1
  return Math.floor(Math.random() * range + lower)
}

function generateQuestion() {
  const leftOperand = getRandomNumber(1, 10)
  const operator = operators[getRandomNumber(0, 2)]
  const rightOperand = getRandomNumber(1, 10)
  return new Question(leftOperand, operator, rightOperand)
}

function attachQuestion(question, questionNumber) {
  const title = document.createElement("h2")
  title.appendChild(document.createTextNode(question.string))
  title.setAttribute("class", "question--title")
  questionsContainer.appendChild(title)

  const optionsDiv = document.createElement("div")
  optionsDiv.setAttribute("class", "question--options")

  for (let i = 0; i < OPTIONS_COUNT; i++) {
    const id = getOptionId(questionNumber, i)
    const button = document.createElement("button")
    button.setAttribute("id", id)
    button.setAttribute("type", "button")
    button.setAttribute("class", `question--button question--button--${i}`)
    button.appendChild(document.createTextNode(question.options[i]))
    button.addEventListener("click", () => { onSelection(questionNumber, i) })
    optionsDiv.appendChild(button)
  }
  questionsContainer.appendChild(optionsDiv)
}

function onSelection(questionNumber, optionNumber) {
  selection[questionNumber] = optionNumber
  for (let i = 0; i < OPTIONS_COUNT; i++) {
    const id = getOptionId(questionNumber, i)
    const button = document.getElementById(id)
    i == optionNumber
      ? button.classList.add("question--button--selected")
      : button.classList.remove("question--button--selected")
  }

  verifyCompletion()
}

function verifyCompletion() {
  let isCompleted = true
  for (let i = 0; i < QUESTIONS_COUNT; i++) {
    if (isNaN(selection[i])) {
      isCompleted = false
      break
    }
  }
  if (isCompleted) {
    document.getElementById("submit").classList.add("submit--button--completed")
  }

  return isCompleted
}

function checkAnswers() {
  const isCompleted = verifyCompletion()
  if (!isCompleted) {
    return
  }

  let score = 0
  for (let i = 0; i < QUESTIONS_COUNT; i++) {
    const question = questions[i]
    const selectedOption = selection[i]
    const selectedAnswer = question.options[selectedOption]
    if (selectedAnswer == question.answer) {
      score++
      results.push(true)
    } else {
      results.push(false)
    }
  }
  alert(`${score}`)
}

function getOptionId(questionNumber, optionNumber) {
  return `question${questionNumber}_option${optionNumber}`
}

for (let i = 0; i < QUESTIONS_COUNT; i++) {
  const newQuestion = generateQuestion()
  questions.push(newQuestion)
  attachQuestion(newQuestion, i)
}
