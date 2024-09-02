let X = "0";
let Y = "";
let OPERATOR = "";

const display = document.querySelector(".display");
const clearButton = document.querySelector("button.clear");
clearButton.addEventListener("click", () => {
  init();
});

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

const digits = document.querySelectorAll(".digit");
digits.forEach((digit) => {
  digit.addEventListener("click", (e) => {
    const input = e.target.textContent;
    if (!OPERATOR) {
      // sets first number (X)
      if (input === "0" && X === "0") {
        return;
      }
      if (X === "0") {
        X = prettifyNumber(input);
      } else {
        X = prettifyNumber(X + input);
      }
      display.textContent = X;
    } else {
      // sets second number (Y)
    }
  });
});

function init() {
  X = "0";
  //   X = prettifyNumber("4561.5678");
  Y = "";
  OPERATOR = "";
  display.textContent = X;
}

init();
