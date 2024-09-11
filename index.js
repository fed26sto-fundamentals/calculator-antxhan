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
const CLEAR_BUTTON = document.querySelector("button.clear");
const COPY_BUTTON = document.querySelector("button.copy");
const MAX_DIGITS = 9;

// DISPLAY FUNCTIONS -------------------------------------------

let SWIPE_START;
const SWIPE_LENGTH = 60;

DISPLAY.addEventListener("touchstart", (e) => {
  SWIPE_START = e.changedTouches[0].screenX;
});

DISPLAY.addEventListener("touchend", (e) => {
  handleSwipe(e.changedTouches[0].screenX);
});

function handleSwipe(SWIPE_END) {
  if (Math.abs(SWIPE_START - SWIPE_END) >= SWIPE_LENGTH) {
    handleBackspace();
    updateDisplay();
  }
}

function updateDisplay() {
  if (ERROR) {
    DISPLAY.textContent = "Error";
    adjustFontSize();
    return;
  }
  if (DISPLAY_TOTAL) {
    DISPLAY.textContent = setDisplayText(LEFT_OPERAND);
  } else {
    DISPLAY.textContent = setDisplayText(RIGHT_OPERAND);
  }
  adjustFontSize();
}

function setDisplayText(operand) {
  if (!DISPLAY_TOTAL && !RIGHT_OPERAND) return LEFT_OPERAND;
  if (absoluteValueLength(operand) > MAX_DIGITS) return convertToExp(operand);
  if (operand.includes("e")) return operand;
  return prettify(operand);
}

// BUTTON FUNCTIONS --------------------------------------------

BUTTONS.forEach((button) => {
  button.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    switch (btn.className) {
      case "digit": {
        resetOperatorsHighlight();
        handleDigit(btn.value);
        break;
      }
      case "operator": {
        resetOperatorsHighlight();
        handleOperator(btn);
        return;
      }
      case "equals": {
        resetOperatorsHighlight();
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
        resetOperatorsHighlight();
        handleDecimal();
        break;
      }
      case "backspace": {
        handleBackspace();
        break;
      }
      case "copy": {
        handleCopy();
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
    return;
  }
  if (DISPLAY_TOTAL) {
    LEFT_OPERAND = enterDigit(digit, LEFT_OPERAND);
  } else {
    RIGHT_OPERAND = enterDigit(digit, RIGHT_OPERAND);
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
  if (CLEAR_BUTTON.textContent === "AC" || ERROR) {
    LEFT_OPERAND = "0";
    RIGHT_OPERAND = "";
    DISPLAY_TOTAL = true;
    OPERATOR = "";
    resetOperatorsHighlight();
    DISPLAYING_TOTAL = false;
    ERROR = false;
  } else if (CLEAR_BUTTON.textContent === "C") {
    if (DISPLAY_TOTAL) {
      LEFT_OPERAND = "0";
    } else {
      if (OPERATOR) reHighlightOperator();
      RIGHT_OPERAND = "0";
    }
  }
  CLEAR_BUTTON.textContent = "AC";
}

function handleNegative() {
  if (ERROR) {
    handleClear();
    LEFT_OPERAND = "-0";
    return;
  }
  if (DISPLAY_TOTAL) {
    LEFT_OPERAND = toggleNegative(LEFT_OPERAND);
  } else {
    RIGHT_OPERAND = toggleNegative(RIGHT_OPERAND);
  }
}

function handlePercent() {
  if (ERROR) {
    return;
  }
  if (DISPLAY_TOTAL) {
    LEFT_OPERAND = makePercentage(LEFT_OPERAND);
  } else {
    RIGHT_OPERAND = makePercentage(RIGHT_OPERAND);
  }
}

function handleDecimal() {
  CLEAR_BUTTON.textContent = "C";
  if (DISPLAYING_TOTAL) {
    handleClear();
    LEFT_OPERAND = "0.";
    DISPLAYING_TOTAL = false;
    return;
  }
  if (DISPLAY_TOTAL) {
    LEFT_OPERAND = addDecimal(LEFT_OPERAND);
  } else {
    RIGHT_OPERAND = addDecimal(RIGHT_OPERAND);
  }
}

function handleCopy() {
  const r = document.createRange();
  r.selectNode(DISPLAY);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  try {
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    // console.log("Copied" + r);
  } catch (err) {
    console.log("Unable to copy!");
  }
  const copyMessage = document.querySelector(".display-message");
  copyMessage.style.visibility = "visible";
  setTimeout(hideCopiedMessage, 1000);
}

function handleBackspace() {
  if (DISPLAYING_TOTAL) {
    console.log("can't backspace the result");
    return;
  }
  if (DISPLAY_TOTAL) {
    LEFT_OPERAND = commitBackspace(LEFT_OPERAND);
  } else {
    if (!RIGHT_OPERAND) {
      console.log("nothing to delete");
      return;
    }
    RIGHT_OPERAND = commitBackspace(RIGHT_OPERAND);
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
      equalButton.ariaPressed = "true";
    }
    if (e.key === "=") {
      equalButton.click();
      equalButton.ariaPressed = "true";
    }
    if (e.key === "Backspace") {
      backspaceButton.click();
      backspaceButton.ariaPressed = "true";
    }
    if (e.key === "%") {
      percenteButton.click();
      percenteButton.ariaPressed = "true";
    }
    if (e.key === "_") {
      negativeButton.click();
      negativeButton.ariaPressed = "true";
    }
    BUTTONS.forEach((button) => {
      if (e.key === button.textContent.toLowerCase()) {
        button.click();
        button.ariaPressed = "true";
      }
    });
    OPERATORS.forEach((button) => {
      if (e.key === button.value.toLowerCase()) {
        button.click();
        button.ariaPressed = "true";
      }
    });
  });
  document.addEventListener("keyup", (e) => {
    BUTTONS.forEach((button) => {
      button.ariaPressed = "false";
    });
  });
}

function isNegative(value) {
  return value.slice(0, 1) === "-";
}

function prettify(value) {
  let integer = value.split(".")[0];
  let decimals = value.split(".")[1] ? value.split(".")[1] : "";
  integer = isNegative(integer) ? integer.slice(1) : integer;
  if (integer.length < 4) {
    return value;
  }
  let reverseInteger = integer.split("").reverse().join("");
  let prettyInteger = "";

  for (let i = 0; i < integer.length; i += 3) {
    const batch = reverseInteger
      .slice(i, i + 3)
      .split("")
      .reverse()
      .join("");
    // console.log("bathc:", batch);
    // console.log("BL:", batch.length);
    if (batch.length === 3 && i + 3 <= integer.length) {
      prettyInteger = " " + batch + prettyInteger;
    } else {
      prettyInteger = batch + prettyInteger;
    }
  }

  if (value.includes(".")) {
    if (isNegative(value)) {
      return "-" + prettyInteger.trim() + "." + decimals;
    }
    return prettyInteger.trim() + "." + decimals;
  } else {
    if (isNegative(value)) {
      return "-" + prettyInteger.trim();
    }
    return prettyInteger.trim();
  }
}

function toggleNegative(operand) {
  if (isNegative(operand)) return operand.slice(1);
  if (!operand) return "-0";
  return "-" + operand;
}

function enterDigit(digit, operand) {
  if (absoluteValueLength(operand) >= MAX_DIGITS) {
    console.log("Maximum amount of digits reached");
    return operand;
  }
  if (digit !== "0") CLEAR_BUTTON.textContent = "C";
  if (operand === "0") return digit;
  if (operand === "-0") return "-" + digit;
  return operand + digit;
}

function makePercentage(operand) {
  let operation = +operand / 100;
  if (
    (operation > 0 && operation < 1e-100) ||
    (operation < 0 && operation > -1e-100)
  ) {
    ERROR = true;
    DISPLAY_TOTAL = true;
    console.log("Result has too many decimal places");
    return;
  }
  return operation.toString();
}

function addDecimal(operand) {
  if (!operand) return "0.";
  if (absoluteValueLength(operand) >= MAX_DIGITS) {
    console.log("can't add decimals");
    return operand;
  }
  if (operand.includes(".")) {
    console.log("already has a decimal");
    return operand;
  }
  return operand + ".";
}

function reHighlightOperator() {
  OPERATORS.forEach((button) => {
    if (button.value === OPERATOR) {
      button.setAttribute("aria-current", "true");
    }
  });
}

function commitBackspace(operand) {
  if (
    (isNegative(operand) && operand === "-0") ||
    (!isNegative(operand) && operand.length === 1) ||
    (!isNegative(operand) && operand.length === 2 && operand.slice(1) === ".")
  ) {
    if (!DISPLAY_TOTAL) reHighlightOperator();
    return "0";
  } else if (isNegative(operand) && operand.length === 2) return "-0";
  return operand.slice(0, operand.length - 1);
}

function resetOperatorsHighlight() {
  OPERATORS.forEach((operator) => {
    operator.setAttribute("aria-current", "false");
  });
}

function hideCopiedMessage() {
  const copyMessage = document.querySelector(".display-message");
  copyMessage.style.visibility = "hidden";
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
  LEFT_OPERAND = operation.toString();
}

function removeZeros(coefficient) {
  let fractionDigitsToRemove = 0;
  for (let i = coefficient.length - 1; i > 0; i--) {
    if (coefficient[i] !== "0") break;
    fractionDigitsToRemove += 1;
  }
  return fractionDigitsToRemove;
}

function setFractionDigits(value, fractionDigits = 6) {
  fractionDigits = fractionDigits < 0 ? 0 : fractionDigits;
  value = (+value).toExponential(fractionDigits).toString();
  let coefficient = value.split("e")[0];
  if (coefficient.slice(-1) === "0") {
    fractionDigits -= removeZeros(coefficient);
    return setFractionDigits(value, fractionDigits);
  }
  if (absoluteValueLength(value) > MAX_DIGITS) {
    fractionDigits -= absoluteValueLength(value) - MAX_DIGITS;
    return setFractionDigits(value, fractionDigits);
  }
  return fractionDigits;
}

function absoluteValueLength(value) {
  const charsToIgnore = [".", "+", "-"];
  charsToIgnore.forEach((char) => {
    value = value.replaceAll(char, "");
  });
  return value.length;
}

function convertToExp(value) {
  const fractionDigits = setFractionDigits(value);
  return (+value).toExponential(fractionDigits).toString();
}

function minimizeFontSize(textWidth, displayWidth, fontSize) {
  while (textWidth > displayWidth && fontSize > 10) {
    console.log("MINIMIZING");
    fontSize -= 1;
    DISPLAY.style.fontSize = fontSize + "px";
    textWidth = DISPLAY.scrollWidth;
  }
}

function adjustFontSize() {
  let maxFontSize = 72;
  if (window.innerWidth < 431) {
    maxFontSize = 88;
  }
  let displayWidth = DISPLAY.offsetWidth;
  let textWidth = DISPLAY.scrollWidth;
  let fontSize = parseInt(window.getComputedStyle(DISPLAY).fontSize);

  if (textWidth > displayWidth) {
    minimizeFontSize(textWidth, displayWidth, fontSize);
  } else if (textWidth <= displayWidth) {
    while (textWidth <= displayWidth && fontSize < maxFontSize) {
      console.log("MAXIMIZING");
      fontSize += 1;
      DISPLAY.style.fontSize = fontSize + "px";
      textWidth = DISPLAY.scrollWidth;
    }
    minimizeFontSize(textWidth, displayWidth, fontSize);
  }
}

// ON LOAD -------------------------------------------------------

init();
