let X;
let OPERATOR;
let Y;
let showingResults = false;

function clear() {
  X = null;
  Y = null;
  OPERATOR = null;
  showingResults = false;
  display.textContent = "0";
}

function operate(display) {
  let result;
  X = +X;
  Y = +Y;
  if (OPERATOR === "+") {
    result = X + Y;
  } else if (OPERATOR === "-") {
    result = X - Y;
  } else if (OPERATOR === "*") {
    result = X * Y;
  } else if (OPERATOR === "/") {
    if (Y === 0) {
      clear();
      display.textContent = "Error";
      return;
    } else {
      result = X / Y;
    }
  }
  result = Math.round((result + Number.EPSILON) * 100_000_000) / 100_000_000;
  display.textContent = result;
  X = result;
  Y = null;
  OPERATOR = null;
}

function negativeToggle() {
  if (!OPERATOR) {
    if (Math.sign(+X) === 1) {
      X = `${-Math.abs(+X)}`;
    } else if (Math.sign(+X) === -1) {
      X = `${Math.abs(+X)}`;
    } else {
      X = X;
    }
    display.textContent = X;
  } else {
    if (Math.sign(+Y) === 1) {
      Y = `${-Math.abs(+Y)}`;
    } else if (Math.sign(+Y) === -1) {
      Y = `${Math.abs(+Y)}`;
    } else {
      Y = Y;
    }
    display.textContent = Y;
  }
}

function percent() {
  //   if (!OPERATOR) {
  //     if (Math.sign(+X) === 1) {
  //       X = `${-Math.abs(+X)}`;
  //     } else if (Math.sign(+X) === -1) {
  //       X = `${Math.abs(+X)}`;
  //     } else {
  //       X = X;
  //     }
  //     display.textContent = X;
  //   } else {
  //     if (Math.sign(+Y) === 1) {
  //       Y = `${-Math.abs(+Y)}`;
  //     } else if (Math.sign(+Y) === -1) {
  //       Y = `${Math.abs(+Y)}`;
  //     } else {
  //       Y = Y;
  //     }
  //     display.textContent = Y;
  //   }
}

const display = document.querySelector(".display");

const digits = document.querySelectorAll(".digit");
digits.forEach((digit) => {
  digit.addEventListener("click", () => {
    const value = digit.textContent;
    if (!OPERATOR) {
      if (showingResults) {
        X = value;
        showingResults = false;
      } else {
        if (X === "0") {
          X = value;
        } else {
          X = X ? X + value : value;
        }
      }
      display.textContent = X;
    } else {
      if (Y === "0") {
        Y = value;
      } else {
        Y = Y ? Y + value : value;
      }
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

const funcs = document.querySelectorAll(".func");
funcs.forEach((func) => {
  func.addEventListener("click", () => {
    const value = func.textContent;
    if (value === "+/-") {
      negativeToggle();
    } else if (value === "%") {
      percent();
    }
  });
});

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", () => {
  clear();
});

const equalsButton = document.querySelector(".equals");
equalsButton.addEventListener("click", () => {
  if (X && OPERATOR && Y) {
    operate(display);
    showingResults = true;
  }
});

function init() {
  clear();
}

init();
