let X;
let OPERATOR;
let Y;
let showingResults = false;

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

function operate(display) {
  let result;
  X = +X;
  Y = +Y;
  if (OPERATOR === "+") {
    result = add(X, Y);
  } else if (OPERATOR === "-") {
    result = subtract(X, Y);
  } else if (OPERATOR === "*") {
    result = multiply(X, Y);
  } else if (OPERATOR === "/") {
    result = divide(X, Y);
  }
  result = Math.round((result + Number.EPSILON) * 100_000_000) / 100_000_000;
  display.textContent = result;
  X = result;
  Y = null;
  OPERATOR = null;
}

const display = document.querySelector(".display");

const digits = document.querySelectorAll(".digit");
digits.forEach((digit) => {
  digit.addEventListener("click", () => {
    const value = digit.textContent;
    if (!OPERATOR) {
      if (showingResults) {
        X = value;
      } else {
        X = X ? X + value : value;
      }
      display.textContent = X;
    } else {
      Y = Y ? Y + value : value;
      display.textContent = Y;
    }
  });
});

const operators = document.querySelectorAll(".operator");
operators.forEach((operator) => {
  operator.addEventListener("click", () => {
    const value = operator.textContent;
    if (X && !Y) {
      OPERATOR = value;
    }
  });
});

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", () => {
  X = null;
  Y = null;
  OPERATOR = null;
  display.textContent = null;
});

const equalsButton = document.querySelector(".equals");
equalsButton.addEventListener("click", () => {
  if (X && OPERATOR && Y) {
    operate(display);
    showingResults = true;
  }
});
