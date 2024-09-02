let LEFT_OPERAND = "0";
let RIGHT_OPERAND = "";
let OPERATOR = "";
let LAST_ENTERED_VALUE_TYPE = "";
let CURRENT_OPERAND = "L";
let NO_AUTO_EQUAL = false;
const DECIMAL_LIMIT = 7;

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");

function handleDigit(button) {
  const digit = button.textContent;
  if (LAST_ENTERED_VALUE_TYPE === "equals") {
    LEFT_OPERAND = "";
    NO_AUTO_EQUAL = true;
  }
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
  if (LAST_ENTERED_VALUE_TYPE === "digit" && OPERATOR && !NO_AUTO_EQUAL) {
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

function displayError(message = "Error") {
  //   LAST_ENTERED_VALUE_TYPE = "equals";
  LEFT_OPERAND = "0";
  DISPLAY.textContent = message;
}

function handleFunc(button) {
  const value = button.textContent;
  if (value === "+/-") {
    if (CURRENT_OPERAND === "L") {
      // check if operand is pos or neg
      // LEFT_OPERAND =
    } else if (CURRENT_OPERAND === "R") {
      // check if operand is pos or neg
      // RIGHT_OPERAND =
    }
  } else if (value === "%") {
    if (CURRENT_OPERAND === "L" && LEFT_OPERAND !== "0") {
      const operation = roundTo(+LEFT_OPERAND / 100).toString();
      if (operation === "0") {
        displayError();
      } else {
        LEFT_OPERAND = operation;
        updateDisplay(LEFT_OPERAND);
      }
    } else if (CURRENT_OPERAND === "R" && LEFT_OPERAND !== "0") {
      const operation = roundTo(+RIGHT_OPERAND / 100).toString();
      if (operation === "0") {
        displayError();
      } else {
        RIGHT_OPERAND = operation;
        updateDisplay(RIGHT_OPERAND);
      }
    }
  }
}

function roundTo(num) {
  const factor = Math.pow(10, DECIMAL_LIMIT);
  return Math.round(num * factor) / factor;
}

function operate(operation) {
  LEFT_OPERAND = roundTo(operation).toString();
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
      if (RIGHT_OPERAND === "0") {
        displayError();
      } else {
        operate(x / y);
      }
      break;
    }
  }
  CURRENT_OPERAND = "L";
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
  NO_AUTO_EQUAL = false;
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
