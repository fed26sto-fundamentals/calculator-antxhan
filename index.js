// STATE -------------------------------------------------------

let LEFT_OPERAND = "0";
let RIGHT_OPERAND = "";
let CURRENT_OPERAND = "L";
let OPERATOR = "";

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
        break;
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
  });
});

function handleDigit(digit) {
  // Choosing current operand
  operand = CURRENT_OPERAND === "L" ? LEFT_OPERAND : RIGHT_OPERAND;

  // Enter digit into operand
  if (operand.length >= MAX_DIGITS) {
    console.log("Maximum amount of digits reached");
    return;
  }
  operand = operand === "0" ? digit : operand + digit;

  // Push to current operand
  if (CURRENT_OPERAND === "L") {
    LEFT_OPERAND = operand;
  } else {
    RIGHT_OPERAND = operand;
  }
  // console.log("left operand:", LEFT_OPERAND);
  // console.log("right operand:", RIGHT_OPERAND);
}

function handleOperator(operator) {
  console.log(operator);
  // Set to OPERATOR
  OPERATOR = operator;
}

function handleEquals() {}

function handleClear() {
  LEFT_OPERAND = "0";
  RIGHT_OPERAND = "";
  CURRENT_OPERAND = "L";
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
  if (CURRENT_OPERAND === "L") {
    DISPLAY.textContent = LEFT_OPERAND;
  } else {
    DISPLAY.textContent = RIGHT_OPERAND;
  }
}

// ON LOAD -------------------------------------------------------

init();
