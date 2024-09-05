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
    // DISPLAY.textContent = roundDecimals(LEFT_OPERAND);
    DISPLAY.textContent = convertToExponential(LEFT_OPERAND);
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

function convertToExponential1(value) {
  if (value.split(".").join("").length > MAX_DIGITS) {
    let fractionDigits = 6;
    if (value.includes(".")) {
      // it's a floating number
      let parts = value.split(".");
      let integer = parts[0];
      console.log("intereget:", integer);
      let decimals = parts[1];

      // digit amount (distance) between first digit and decimal point
      let distance =
        integer.slice(0, 1) === "-" ? integer.length - 2 : integer.length - 1;

      console.log("val:", value);
      console.log("distance:", distance);

      if (distance > 9 && 100 > distance) {
        fractionDigits = 5;
      } else if (distance > 99) {
        fractionDigits = 4;
      }
      if (decimals.includes("e")) {
        fractionDigits = fractionDigits - 1;
        console.log("this:", decimals.slice(decimals.length - 2));
        if (+decimals.slice(decimals.length - 2) > 99) {
          fractionDigits = fractionDigits - 1;
        }
      }
    }
    // console.log(value);
    // console.log("fractionDigits:", fractionDigits);
    //   if (value.split(".").join("").length > MAX_DIGITS) {
    //     if (value.slice(0, 1) === "-") {
    //       // negative number
    //       if (value.slice(1).split(".").join("").length > MAX_DIGITS) {
    //         // still more than 9 digits
    //         return (+value).toExponential(fractionDigits).toString();
    //       } else {
    //         // less than or equal to 9 numbers
    //         return value;
    //       }
    //     } else {
    //       // positive number
    //       return (+value).toExponential(fractionDigits).toString();
    //     }
    //   } else {
    //     return value;
    //   }
    // }
    let finalValue;

    if (value.slice(0, 1) === "-") {
      // negative number
      if (value.slice(1).split(".").join("").length > MAX_DIGITS) {
        // still more than 9 digits

        return (+value).toExponential(fractionDigits).toString();
      } else {
        // less than or equal to 9 numbers
        return value;
      }
    } else {
      // positive number
      finalValue = (+value).toExponential(fractionDigits).toString();
      const preE = finalValue.split("e")[0];
      console.log("preE:", preE);
      console.log("finalVal:", finalValue);
      return (+value).toExponential(fractionDigits).toString();
    }
  } else {
    return value;
  }
}

function setFractionDigits(value) {
  console.log("====================================");
  let fractionDigits = 6;
  console.log("FRAC #1:", fractionDigits);
  value = (+value).toExponential(fractionDigits).toString();
  console.log("VALUE #1:", value);

  valueLength = value.split(".").join("").length;
  let coefficient = value.split("e")[0];
  console.log("COEFFICIENT:", coefficient);
  console.log("COEFFICIENT LENGTH - 1:", coefficient.length - 1);
  let exponent = value.split("e")[1];
  console.log("EXPONENT:", exponent);

  for (let i = coefficient.length - 1; i > 0; i--) {
    let digit = coefficient[i];
    if (digit === "0") {
      fractionDigits -= 1;
      continue;
    } else if (digit !== "0") {
      break;
    }
  }

  console.log("FRAC #2:", fractionDigits);

  // Checking if still need to reduce fractionDigits
  value = (+value).toExponential(fractionDigits).toString();
  coefficient = value.split("e")[0];
  exponent = value.split("e")[1];
  let coefficientLength = calculateValueLength(coefficient);
  console.log("VALUE #2:", value);
  console.log("RAW LENGTH:", coefficientLength + exponent.length);
  let fullLength = coefficientLength + exponent.length;
  if (fullLength > MAX_DIGITS) {
    // fractionDigits -= exponent.length - 1;
    // delete the överflöd över max digits
    fractionDigits -= fullLength - MAX_DIGITS;
  }

  // should only kick in if the new coefficient is too long
  // if (fractionDigits > 0) {
  //   fractionDigits -= exponent.length - 1;
  // }

  console.log("FRAC #3:", fractionDigits);

  fractionDigits = fractionDigits < 0 ? 0 : fractionDigits;

  console.log("FRAC #4:", fractionDigits);

  return fractionDigits;
}

function calculateValueLength(value) {
  let valueLength = value.split(".").join("").length;
  valueLength = value.slice(0, 1) === "-" ? valueLength - 1 : valueLength;
  return valueLength;
}

function convertToExponential(value) {
  let valueLength = calculateValueLength(value);
  if (valueLength > MAX_DIGITS) {
    let fractionDigits = setFractionDigits(value);
    return (+value).toExponential(fractionDigits).toString();
  } else {
    return value;
  }

  // let fractionDigits = 6;
  // if (value.includes(".")) {
  //   // it's a floating number
  //   let parts = value.split(".");
  //   let integer = parts[0];
  //   console.log("intereget:", integer);
  //   let decimals = parts[1];
  //   // digit amount (distance) between first digit and decimal point
  //   let distance =
  //     integer.slice(0, 1) === "-" ? integer.length - 2 : integer.length - 1;
  //   console.log("val:", value);
  //   console.log("distance:", distance);
  //   if (distance > 9 && 100 > distance) {
  //     fractionDigits = 5;
  //   } else if (distance > 99) {
  //     fractionDigits = 4;
  //   }
  //   if (decimals.includes("e")) {
  //     fractionDigits = fractionDigits - 1;
  //     console.log("this:", decimals.slice(decimals.length - 2));
  //     if (+decimals.slice(decimals.length - 2) > 99) {
  //       fractionDigits = fractionDigits - 1;
  //     }
  //   }
  // }
  //   let finalValue;
  //   if (value.slice(0, 1) === "-") {
  //     // negative number
  //     if (value.slice(1).split(".").join("").length > MAX_DIGITS) {
  //       // still more than 9 digits
  //       return (+value).toExponential(fractionDigits).toString();
  //     } else {
  //       // less than or equal to 9 numbers
  //       return value;
  //     }
  //   } else {
  //     // positive number
  //     finalValue = (+value).toExponential(fractionDigits).toString();
  //     const preE = finalValue.split("e")[0];
  //     console.log("preE:", preE);
  //     console.log("finalVal:", finalValue);
  //     return (+value).toExponential(fractionDigits).toString();
  //   }
  // } else {
  //   return value;
}

// ON LOAD -------------------------------------------------------

init();
