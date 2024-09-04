// STATE -------------------------------------------------------

let LEFT_OPERAND;
let RIGHT_OPERAND;
let OPERATOR;
let DISPLAY_TOTAL;

// GLOBAL VARIABLES --------------------------------------------

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");
const MAX_DIGITS = 9;

// BUTTON FUNCTIONS --------------------------------------------

BUTTONS.forEach((button) => {
  button.addEventListener("click", (e) => {
    switch (e.target.className) {
      case "digit": {
        handleDigit(e.target.value);
        break;
      }
      case "operator": {
        handleOperator(e.target.value);
        return;
        // break;
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
  if (DISPLAY_TOTAL === true) {
    if (RIGHT_OPERAND) {
      console.log("There is a right operand already, so left operand is reset");
      LEFT_OPERAND = digit;
    } else {
      LEFT_OPERAND = enterDigit(digit, LEFT_OPERAND);
    }
  } else {
    RIGHT_OPERAND = enterDigit(digit, RIGHT_OPERAND);
  }
}

function handleOperator(operator) {
  OPERATOR = operator;
  RIGHT_OPERAND = "";
  DISPLAY_TOTAL = false;
}

function handleEquals() {
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
      LEFT_OPERAND = (+LEFT_OPERAND / +RIGHT_OPERAND).toString();
      break;
    }
  }
  DISPLAY_TOTAL = true;
}

function handleClear() {
  LEFT_OPERAND = "0";
  RIGHT_OPERAND = "";
  DISPLAY_TOTAL = true;
  OPERATOR = "";
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
  });
}

function updateDisplay() {
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

// ON LOAD -------------------------------------------------------

init();
