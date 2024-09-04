// STATE -------------------------------------------------------

let LEFT_OPERAND; // total
let RIGHT_OPERAND;
let OPERATOR;
let DISPLAY_TOTAL;
let DISPLAYING_TOTAL;
let ERROR;

// GLOBAL VARIABLES --------------------------------------------

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");
const OPERATORS = document.querySelectorAll(".operator");
const MAX_DIGITS = 9;

// BUTTON FUNCTIONS --------------------------------------------

BUTTONS.forEach((button) => {
  button.addEventListener("click", (e) => {
    resetOperatorsHighlight();
    switch (e.target.className) {
      case "digit": {
        handleDigit(e.target.value);
        break;
      }
      case "operator": {
        handleOperator(e.target);
        return;
      }
      case "equals": {
        handleEquals();
        break;
      }
      case "clear": {
        handleClear();
        break;
      }
    }
    updateDisplay();
    console.log(LEFT_OPERAND, OPERATOR, RIGHT_OPERAND);
  });
});

function handleDigit(digit) {
  if (DISPLAYING_TOTAL) {
    LEFT_OPERAND = digit;
    DISPLAYING_TOTAL = false;
  } else {
    if (DISPLAY_TOTAL) {
      LEFT_OPERAND = enterDigit(digit, LEFT_OPERAND);
    } else {
      RIGHT_OPERAND = enterDigit(digit, RIGHT_OPERAND);
    }
  }
}

function handleOperator(button) {
  if (DISPLAYING_TOTAL) {
    DISPLAYING_TOTAL = false;
  }
  button.setAttribute("aria-current", "true");
  const operator = button.value;
  OPERATOR = operator;
  RIGHT_OPERAND = "";
  DISPLAY_TOTAL = false;
}

function handleEquals() {
  if (+LEFT_OPERAND === Infinity || +RIGHT_OPERAND === Infinity) {
    ERROR = true;
    console.log("Doing math with infinity error");
    return;
  }
  if (OPERATOR && !RIGHT_OPERAND) {
    RIGHT_OPERAND = LEFT_OPERAND;
  }
  switch (OPERATOR) {
    case "+": {
      LEFT_OPERAND = (+LEFT_OPERAND + +RIGHT_OPERAND).toString();
      break;
    }
    case "-": {
      LEFT_OPERAND = (+LEFT_OPERAND - +RIGHT_OPERAND).toString();
      break;
    }
    case "*": {
      LEFT_OPERAND = (+LEFT_OPERAND * +RIGHT_OPERAND).toString();
      break;
    }
    case "/": {
      if (+RIGHT_OPERAND === 0) {
        ERROR = true;
        console.log("Zero division error");
      }
      LEFT_OPERAND = (+LEFT_OPERAND / +RIGHT_OPERAND).toString();
      break;
    }
  }
  DISPLAY_TOTAL = true;
  DISPLAYING_TOTAL = true;
}

function handleClear() {
  LEFT_OPERAND = "0";
  RIGHT_OPERAND = "";
  DISPLAY_TOTAL = true;
  OPERATOR = "";
  DISPLAYING_TOTAL = false;
  ERROR = false;
}

// UTIL FUNCTIONS ----------------------------------------------

function init() {
  initKeyboard();
  handleClear();
  updateDisplay();
}

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    const equalButton = document.querySelector("button.equals");
    const backspaceButton = document.querySelector("button.backspace");
    const negativeButton = document.querySelector("button.negative");
    if (e.key === "Enter") {
      equalButton.click();
    }
    if (e.key === "Backspace") {
      backspaceButton.click();
    }
    if (e.key === "_") {
      negativeButton.click();
    }
    BUTTONS.forEach((button) => {
      if (e.key === button.textContent.toLowerCase()) {
        button.click();
      }
    });
    OPERATORS.forEach((button) => {
      if (e.key === button.value.toLowerCase()) {
        button.click();
      }
    });
  });
}

function updateDisplay() {
  if (ERROR) {
    DISPLAY.textContent = "Error";
    ERROR = false;
    return;
  }
  if (DISPLAY_TOTAL === true) {
    DISPLAY.textContent = LEFT_OPERAND;
  } else {
    DISPLAY.textContent = RIGHT_OPERAND;
  }
}

function enterDigit(digit, operand) {
  if (operand.length >= MAX_DIGITS) {
    console.log("Maximum amount of digits reached");
    return operand;
  }
  operand = operand === "0" ? digit : operand + digit;
  return operand;
}

function resetOperatorsHighlight() {
  OPERATORS.forEach((operator) => {
    operator.setAttribute("aria-current", "false");
  });
}

// ON LOAD -------------------------------------------------------

init();
