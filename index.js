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

// DISPLAY FUNCTIONS -------------------------------------------

let SWIPE_START;
let SWIPE_END;

DISPLAY.addEventListener("touchstart", (e) => {
  SWIPE_START = e.changedTouches[0].screenX;
});

DISPLAY.addEventListener("mousedown", (e) => {
  SWIPE_START = e.screenX;
});

DISPLAY.addEventListener("touchend", (e) => {
  SWIPE_END = e.changedTouches[0].screenX;
  if (SWIPE_START - SWIPE_END >= 100) {
    handleBackspace();
    updateDisplay();
  }
});

DISPLAY.addEventListener("mouseup", (e) => {
  SWIPE_END = e.screenX;
  if (SWIPE_START - SWIPE_END >= 100) {
    handleBackspace();
    updateDisplay();
  }
});

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
      case "negative": {
        handleNegative();
        break;
      }
      case "percent": {
        handlePercent();
        break;
      }
      case "decimal": {
        handleDecimal();
        break;
      }
      case "backspace": {
        handleBackspace();
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
  if (ERROR) {
    handleClear();
    LEFT_OPERAND = digit;
    return;
  }
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
  if (ERROR) {
    return;
  }
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
      operate(+LEFT_OPERAND + +RIGHT_OPERAND);
      break;
    }
    case "-": {
      operate(+LEFT_OPERAND - +RIGHT_OPERAND);
      break;
    }
    case "*": {
      operate(+LEFT_OPERAND * +RIGHT_OPERAND);
      break;
    }
    case "/": {
      if (+RIGHT_OPERAND === 0) {
        ERROR = true;
        console.log("Zero division error");
      }
      operate(+LEFT_OPERAND / +RIGHT_OPERAND);
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

function handleNegative() {
  if (DISPLAY_TOTAL) {
    if (LEFT_OPERAND.slice(0, 1) === "-") {
      LEFT_OPERAND = LEFT_OPERAND.slice(1);
    } else {
      LEFT_OPERAND = "-" + LEFT_OPERAND;
    }
  } else {
    if (RIGHT_OPERAND.slice(0, 1) === "-") {
      RIGHT_OPERAND = RIGHT_OPERAND.slice(1);
    } else {
      RIGHT_OPERAND = "-" + RIGHT_OPERAND;
    }
  }
}

function handlePercent() {
  if (ERROR) {
    return;
  }
  if (DISPLAY_TOTAL) {
    let operation = +LEFT_OPERAND / 100;
    if (
      (operation > 0 && operation < 1e-100) ||
      (operation < 0 && operation > -1e-100)
    ) {
      ERROR = true;
      console.log("Result has too many decimal places");
      // DISPLAY_TOTAL = true;
      // DISPLAYING_TOTAL = true;
      return;
    }
    LEFT_OPERAND = operation.toString();
  } else {
    let operation = +RIGHT_OPERAND / 100;
    if (
      (operation > 0 && operation < 1e-100) ||
      (operation < 0 && operation > -1e-100)
    ) {
      ERROR = true;
      console.log("Result has too many decimal places");
      DISPLAY_TOTAL = true;
      // DISPLAYING_TOTAL = true;
      return;
    }
    RIGHT_OPERAND = operation.toString();
  }
}

function handleDecimal() {
  if (DISPLAYING_TOTAL) {
    handleClear();
    LEFT_OPERAND = "0.";
    DISPLAYING_TOTAL = false;
    return;
  }
  if (DISPLAY_TOTAL) {
    if (LEFT_OPERAND.split(".").join("").length === MAX_DIGITS) {
      console.log("can't add decimals");
      return;
    }
    if (!LEFT_OPERAND.includes(".")) {
      LEFT_OPERAND = LEFT_OPERAND + ".";
    }
  } else {
    if (RIGHT_OPERAND.split(".").join("").length === MAX_DIGITS) {
      console.log("can't add decimals");
      return;
    }
    if (!RIGHT_OPERAND.includes(".")) {
      RIGHT_OPERAND = RIGHT_OPERAND + ".";
    }
  }
}

function handleBackspace() {
  if (DISPLAYING_TOTAL) {
    console.log("can't backspace the result");
    return;
  }
  if (DISPLAY_TOTAL) {
    if (LEFT_OPERAND.slice(0, 1) === "-") {
      if (LEFT_OPERAND === "-0") {
        LEFT_OPERAND = "0";
        return;
      }
      if (LEFT_OPERAND.length === 2) {
        LEFT_OPERAND = "-0";
      } else {
        LEFT_OPERAND = LEFT_OPERAND.slice(0, LEFT_OPERAND.length - 1);
      }
    } else {
      if (LEFT_OPERAND.length === 1) {
        LEFT_OPERAND = "0";
      } else {
        LEFT_OPERAND = LEFT_OPERAND.slice(0, LEFT_OPERAND.length - 1);
      }
    }
  } else {
    if (!RIGHT_OPERAND) {
      console.log("nothing to delete");
      DISPLAY_TOTAL = true;
      return;
    }
    if (RIGHT_OPERAND === "0") {
      // make it highlight the selected operator button again
      OPERATORS.forEach((button) => {
        // console.log(button);
        if (button.value === OPERATOR) {
          button.setAttribute("aria-current", "true");
        }
      });
      return;
    }
    if (RIGHT_OPERAND.slice(0, 1) === "-") {
      if (RIGHT_OPERAND === "-0") {
        RIGHT_OPERAND = "0";
        // make it highlight the selected operator button again
        OPERATORS.forEach((button) => {
          // console.log(button);
          if (button.value === OPERATOR) {
            button.setAttribute("aria-current", "true");
          }
        });
        return;
      }
      if (RIGHT_OPERAND.length === 2) {
        RIGHT_OPERAND = "-0";
      } else {
        RIGHT_OPERAND = RIGHT_OPERAND.slice(0, RIGHT_OPERAND.length - 1);
      }
    } else {
      if (RIGHT_OPERAND.length === 1) {
        RIGHT_OPERAND = "0";

        // make it highlight the selected operator button again
        OPERATORS.forEach((button) => {
          // console.log(button);
          if (button.value === OPERATOR) {
            button.setAttribute("aria-current", "true");
          }
        });
      } else {
        RIGHT_OPERAND = RIGHT_OPERAND.slice(0, RIGHT_OPERAND.length - 1);
      }
    }
  }
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
    const percenteButton = document.querySelector("button.percent");
    if (e.key === "Enter" && document.activeElement === document.body) {
      equalButton.click();
    }
    if (e.key === "=") {
      equalButton.click();
    }
    if (e.key === "Backspace") {
      backspaceButton.click();
    }
    if (e.key === "%") {
      percenteButton.click();
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
    // ERROR = false;
    return;
  }
  if (DISPLAY_TOTAL === true) {
    // DISPLAY.textContent = LEFT_OPERAND;
    DISPLAY.textContent = roundDecimals(LEFT_OPERAND);
  } else {
    DISPLAY.textContent = RIGHT_OPERAND;
  }
}

function enterDigit(digit, operand) {
  let operandLength;
  if (Math.sign(+operand) === -1 || Math.sign(+operand) === -0) {
    operandLength = operand.slice(1).split(".").join("").length;
  } else {
    operandLength = operand.split(".").join("").length;
  }
  if (operandLength >= MAX_DIGITS) {
    console.log("Maximum amount of digits reached");
    return operand;
  }
  // operand = operand === "0" ? digit : operand + digit;
  if (operand === "0") {
    operand = digit;
  } else if (operand === "-0") {
    operand = "-" + digit;
  } else {
    operand = operand + digit;
  }
  return operand;
}

function resetOperatorsHighlight() {
  OPERATORS.forEach((operator) => {
    operator.setAttribute("aria-current", "false");
  });
}

function roundDecimals(value) {
  let parts = value.split(".");
  let integer = parts[0];
  if (value.slice(0, 1) === "-") {
    integer = integer.slice(1);
  }
  let decimals = parts[1];
  if (!decimals) {
    return value;
  }
  let roundTo;
  if (decimals > MAX_DIGITS - 1) {
    roundTo = integer.length > MAX_DIGITS - 1 ? 0 : MAX_DIGITS - integer.length;
  } else {
    roundTo = MAX_DIGITS - 1;
  }
  return (+value).toFixed(roundTo);
}

function operate(operation) {
  if (
    (operation > 0 && operation < 1e-100) ||
    (operation < 0 && operation > -1e-100)
  ) {
    ERROR = true;
    console.log("Result has too many decimal places");
    return;
  }

  if (operation < -1e160) {
    ERROR = true;
    console.log("Result is too small");
    return;
  }

  if (operation > 1e160) {
    ERROR = true;
    console.log("Result is too big");
    return;
  }
  // let rounded = roundDecimals(operation.toString());
  // LEFT_OPERAND = rounded;
  LEFT_OPERAND = operation.toString();
}

function convertToExponential(value) {
  // value is a string
  // value = 999_999_999;
  // value = 0.00000001;
  // value = -999_999_999;
  // value = -0.00000001;

  // value = "123_4567.891"; // with null it becomes = 1.234567891e+6,
  // 6 digits between the first and the .
  // 3 decimal digits
  // with 6 as fractionDigits, it becomes valid: 1.234568e+6

  // value = "234567891011.121314"; // with null: 2.345678910111213e+11
  // 11 digits between the first and the .
  // 6 decmial digits
  // with 5 as fractionDigits, it becomes valid: 2.34568e+11

  // value = "345.678910111213"; // with null it becomes = 3.45678910111213e+2
  // 2 digits between the first and the .
  // with 6 as fractionDigits, it becomes valid: 3.456789e+2
  // console.log(value.toExponential(6));

  // value = "3459284291864298649281649821649.6789101384736284362874362811213"; //
  // with 6: 3.459284e+30

  // value = "123";
  // 1.230000e+2, unnecessary because value < MAX_DIGITS (9)

  // value = "1234567891"; // 10 digits
  // 1.234568e+9 with 6

  let tMAX_DIGITS = 9;
  // value = "-123453928739816.7891";
  // value = "-98438479184721987291847291847291847198.0098473298431093740917304973091743091709317";
  // value = "123";
  // value = "-1234567891"; // 10 digits
  // value = "-0.00000001";
  // value = "-123456789.1"
  // value = "-9.84385e+37";

  let fractionDigits = 6;
  if (value.includes(".")) {
    // it's a floating number
    let parts = value.split(".");
    let integer = parts[0];
    let decimals = parts[1];

    // digit amount (distance) between first digit and decimal point
    let distance =
      integer.slice(0, 1) === "-" ? integer.length - 2 : integer.length - 1;

    if (distance > 9 && 100 > distance) {
      fractionDigits = 5;
    } else if (distance > 99) {
      fractionDigits = 4;
    }
    if (decimals.includes("e")) {
      fractionDigits = fractionDigits - 1;
    }
  }
  console.log(value);
  console.log("fractionDigits:", fractionDigits);
  // console.log(value.slice(1).split(".").join("").length);
  // console.log(value.slice(1).split(".").join("").length > tMAX_DIGITS);
  // console.log(value.slice(1).split(".").join(""));

  if (value.split(".").join("").length > tMAX_DIGITS) {
    if (value.slice(0, 1) === "-") {
      // console.log("HERE 1");
      // negative number
      if (value.slice(1).split(".").join("").length > tMAX_DIGITS) {
        // console.log("HERE 2");
        // still more than 9 digits
        console.log((+value).toExponential(fractionDigits).toString());
      } else {
        // less than or equal to 9 numbers
        // console.log("HERE 3");
        console.log(value);
      }
    } else {
      // positive number
      console.log((+value).toExponential(fractionDigits).toString());
    }
  } else {
    console.log(value);
  }

  // console.log((+value).toExponential(fractionDigits));
  // the fractionDigits depends on the distance between first number and .
  // fractionDigits = 6
  // if 100 > distance > 9: fractionDigits = 5
  // if distance > 99: fractionDigits = 4

  // e counts as a digit
  // - and , does not count as digits
}

// ON LOAD -------------------------------------------------------

init();
