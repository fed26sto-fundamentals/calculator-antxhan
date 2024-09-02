let LEFT_OPERAND = "0";
let RIGHT_OPERAND = "";
let OPERATOR = "";
let LAST_ENTERED_VALUE_TYPE = "";
let CURRENT_OPERAND = "L";

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");

function handleDigit(button) {
  const digit = button.textContent;
  if (CURRENT_OPERAND === "L") {
    LEFT_OPERAND = LEFT_OPERAND !== "0" ? LEFT_OPERAND + digit : digit;
    updateDisplay(LEFT_OPERAND);
  } else {
    RIGHT_OPERAND = RIGHT_OPERAND !== "0" ? RIGHT_OPERAND + digit : digit;
    updateDisplay(RIGHT_OPERAND);
  }
  LAST_ENTERED_VALUE_TYPE = "digit";
}

function handleOperator(button) {
  if (LAST_ENTERED_VALUE_TYPE === "digit" && OPERATOR) {
    handleEquals();
  }
  OPERATOR = button.textContent;
  CURRENT_OPERAND = "R";
  RIGHT_OPERAND = "";
  LAST_ENTERED_VALUE_TYPE = "operator";
}

function handleDecimal() {}

function handleBackspace() {}

function handleClear() {
  init();
}

function handleFunc() {}

function operate(operation) {
  LEFT_OPERAND = operation.toString();
  updateDisplay(LEFT_OPERAND);
}

function handleEquals() {
  if (!RIGHT_OPERAND) {
    RIGHT_OPERAND = LEFT_OPERAND;
  }
  const x = +LEFT_OPERAND;
  const y = +RIGHT_OPERAND;
  switch (OPERATOR) {
    case "+": {
      operate(x + y);
      break;
    }
    case "-": {
      operate(x - y);
      break;
    }
    case "*": {
      operate(x * y);
      break;
    }
    case "/": {
      operate(x / y);
      break;
    }
  }
  LAST_ENTERED_VALUE_TYPE = "equals";
}

function prettifyNumber(n) {
  const parts = n.split(".");
  const integer = parts[0].split(" ").join("").split("").reverse().join("");
  const decimals = parts[1];
  let prettyInteger = "";
  for (let i = 0; i < integer.length; i += 3) {
    const k = integer
      .slice(i, i + 3)
      .split("")
      .reverse()
      .join("");
    prettyInteger = k + " " + prettyInteger;
  }
  if (decimals) {
    return prettyInteger.trim() + "." + decimals;
  } else {
    return prettyInteger.trim();
  }
}

function updateDisplay(operand) {
  DISPLAY.textContent = prettifyNumber(operand);
}

function init() {
  LEFT_OPERAND = "0";
  RIGHT_OPERAND = "";
  CURRENT_OPERAND = "L";
  OPERATOR = "";
  LAST_ENTERED_VALUE_TYPE = "";
  DISPLAY.textContent = LEFT_OPERAND;
}

init();

BUTTONS.forEach((button) => {
  button.addEventListener("click", (e) => {
    const className = e.target.className;
    switch (className) {
      case "digit": {
        handleDigit(e.target);
        break;
      }
      case "operator": {
        handleOperator(e.target);
        break;
      }
      case "decimal": {
        handleDecimal(e.target);
        break;
      }
      case "backspace": {
        handleBackspace(e.target);
        break;
      }
      case "clear": {
        handleClear();
        break;
      }
      case "func": {
        handleFunc(e.target);
        break;
      }
      case "equals": {
        handleEquals(e.target);
        break;
      }
    }
  });
});
