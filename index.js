let LEFT_OPERAND = "0";
let RIGHT_OPERAND = "";
let OPERATOR = "";
let LAST_ENTERED_VALUE_TYPE = "";
let CURRENT_OPERAND = "L";
let NO_AUTO_EQUAL = false;
const DECIMAL_LIMIT = 8; // change to make sure it doesn't overflow?
const DIGIT_LIMIT = 9;

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");

function handleDigit(button) {
  const digit = button.textContent;
  if (LAST_ENTERED_VALUE_TYPE === "equals") {
    LEFT_OPERAND = "";
    NO_AUTO_EQUAL = true;
  }
  if (CURRENT_OPERAND === "L") {
    if (LEFT_OPERAND === "0") {
      LEFT_OPERAND = digit;
    } else if (LEFT_OPERAND === "-0") {
      LEFT_OPERAND = "-" + digit;
    } else {
      LEFT_OPERAND = LEFT_OPERAND + digit;
    }
    updateDisplay(LEFT_OPERAND);
  } else {
    if (RIGHT_OPERAND === "0") {
      RIGHT_OPERAND = digit;
    } else if (RIGHT_OPERAND === "-0") {
      RIGHT_OPERAND = "-" + digit;
    } else {
      RIGHT_OPERAND = RIGHT_OPERAND + digit;
    }
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

function handleDecimal() {
  if (CURRENT_OPERAND === "L") {
    if (!LEFT_OPERAND) {
      LEFT_OPERAND = "0.";
    } else if (!LEFT_OPERAND.includes(".")) {
      LEFT_OPERAND = LEFT_OPERAND + ".";
    }
    updateDisplay(LEFT_OPERAND);
  } else {
    if (!RIGHT_OPERAND) {
      RIGHT_OPERAND = "0.";
    } else if (!RIGHT_OPERAND.includes(".")) {
      RIGHT_OPERAND = RIGHT_OPERAND + ".";
    }
    updateDisplay(RIGHT_OPERAND);
  }
}

function handleBackspace() {
  if (CURRENT_OPERAND === "L") {
    if (LEFT_OPERAND.length === 2 && LEFT_OPERAND.split("")[0] === "-") {
      LEFT_OPERAND = "0";
    } else if (LEFT_OPERAND.length > 1) {
      LEFT_OPERAND = LEFT_OPERAND.slice(0, LEFT_OPERAND.length - 1);
    } else {
      LEFT_OPERAND = "0";
    }
    updateDisplay(LEFT_OPERAND);
  } else {
    if (RIGHT_OPERAND.length === 2 && RIGHT_OPERAND.split("")[0] === "-") {
      RIGHT_OPERAND = "0";
    } else if (RIGHT_OPERAND.length > 1) {
      RIGHT_OPERAND = RIGHT_OPERAND.slice(0, RIGHT_OPERAND.length - 1);
    } else {
      RIGHT_OPERAND = "0";
    }
    updateDisplay(RIGHT_OPERAND);
  }
}

function handleClear() {
  init();
}

function displayError(message = "Error") {
  LEFT_OPERAND = "0";
  DISPLAY.textContent = message;
}

function handlePercentage() {
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

function handleNegativeToggle() {
  if (CURRENT_OPERAND === "L") {
    const value = Math.sign(+LEFT_OPERAND);
    if (value === 1) {
      LEFT_OPERAND = (-Math.abs(+LEFT_OPERAND)).toString();
    } else if (value === -1) {
      LEFT_OPERAND = Math.abs(+LEFT_OPERAND).toString();
    } else if (value === 0) {
      if (LEFT_OPERAND.split("")[0] === "-") {
        LEFT_OPERAND = "0";
      } else {
        LEFT_OPERAND = "-0";
      }
    }
    updateDisplay(LEFT_OPERAND);
  } else if (CURRENT_OPERAND === "R") {
    const value = Math.sign(+RIGHT_OPERAND);
    if (value === 1) {
      RIGHT_OPERAND = (-Math.abs(+RIGHT_OPERAND)).toString();
    } else if (value === -1) {
      RIGHT_OPERAND = Math.abs(+RIGHT_OPERAND).toString();
    } else if (value === 0) {
      if (RIGHT_OPERAND.split("")[0] === "-") {
        RIGHT_OPERAND = "0";
      } else {
        RIGHT_OPERAND = "-0";
      }
    }
    updateDisplay(RIGHT_OPERAND);
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
      if (+RIGHT_OPERAND === 0 || +RIGHT_OPERAND === -0) {
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
  } else if (n.includes(".")) {
    return prettyInteger.trim() + ".";
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
      case "percent": {
        handlePercentage(e.target);
        break;
      }
      case "negative": {
        handleNegativeToggle(e.target);
        break;
      }
      case "equals": {
        handleEquals(e.target);
        break;
      }
    }
  });
});
