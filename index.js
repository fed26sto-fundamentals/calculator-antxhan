let LEFT_OPERAND = "0";
let OPERATOR = "";
let RIGHT_OPERAND = "";
let CURRENT_OPERAND = "L"; // L or R
let RESULT = "";

const DISPLAY = document.querySelector(".display");
const BUTTONS = document.querySelectorAll("button");

function handleOperand(operand, digit) {
  let newOperand = "";
  if (operand === "0" || !operand) {
    newOperand = digit;
  } else {
    newOperand = operand + digit;
  }
  updateDisplay(newOperand);
  return newOperand;
}

function handleDigit(button) {
  console.log(LEFT_OPERAND, RESULT);
  console.log("handleDigit");
  const digit = button.textContent;
  if (RESULT === LEFT_OPERAND) {
    LEFT_OPERAND = "";
  }
  if (CURRENT_OPERAND === "L") {
    LEFT_OPERAND = handleOperand(LEFT_OPERAND, digit);
  } else {
    RIGHT_OPERAND = handleOperand(RIGHT_OPERAND, digit);
  }
}

function handleOperator(button) {
  console.log("handleOperator");
  OPERATOR = button.textContent;
  //   if (LEFT_OPERAND && RIGHT_OPERAND) {
  //     handleEquals();
  //   }
  //   if (RIGHT_OPERAND) {
  //     RIGHT_OPERAND = "";
  //   }
  CURRENT_OPERAND = "R";
}

function handleDecimal() {}

function handleBackspace() {}

function handleClear() {
  init();
}

function handleFunc() {}

function operate(operation) {
  const operationString = operation.toString();
  LEFT_OPERAND = operationString;
  RESULT = operationString;
}

function handleEquals() {
  //   console.log("handleEquals");
  //   console.log(LEFT_OPERAND, OPERATOR, RIGHT_OPERAND);
  CURRENT_OPERAND = "L";
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
  updateDisplay();
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

function updateDisplay(operand = LEFT_OPERAND) {
  console.log("updateDisplay:", operand);
  DISPLAY.textContent = prettifyNumber(operand);
}

function init() {
  LEFT_OPERAND = "0";
  RIGHT_OPERAND = "";
  OPERATOR = "";
  DISPLAY.textContent = LEFT_OPERAND;
}

init();

BUTTONS.forEach((button) => {
  button.addEventListener("click", (e) => {
    const className = e.target.className;
    // console.log("LEFT_OPERAND:", LEFT_OPERAND);
    // console.log("RIGHT_OPERAND:", RIGHT_OPERAND);
    // console.log("OPERATIR:", OPERATOR);
    // console.log("=======================");
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
    // if (className === "digit") {
    //   handleDigit(e.target);
    // } else if (className === "operator") {
  });
});
