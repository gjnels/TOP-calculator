"use strict";

const defaultOperation = { a: "", b: "", operator: "", result: "" };

let previousOperation = { ...defaultOperation };
let currentOperation = { ...defaultOperation };

// element selectors
const currentOperationDisplay = document.querySelector(".current");
const previousOperationDisplay = document.querySelector(".previous");

const allBtns = [...document.querySelectorAll("button")];

const btnClear = document.querySelector("button.clear");
const btnBackspace = document.querySelector("button.backspace");
const btnCalcluate = document.querySelector("button.calculate");
const btnsNumeric = [...document.querySelectorAll("button.numeric")];
const btnsOperator = [...document.querySelectorAll("button.operator")];

// math operations
const add = (a, b) => +a + +b;
const subtract = (a, b) => +a - +b;
const multiply = (a, b) => +a * +b;
const divide = (a, b) => {
  if (+b === 0) {
    alert("What are you thinking?! You cannot divide by zero!");
    return;
  }
  return +a / +b;
};

const operate = ({ a, b, operator }) => {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
};

// helper functions
function operationIsEmpty(operation) {
  const { a, b, operator, result } = operation;
  if (!a && !b && !operator && !result) return true;
  return false;
}

function isValidOperation(operation) {
  const { a, b, operator } = operation;
  if (!a || !b || !operator) return false;
  return true;
}

function clearOperations() {
  // this makes it so you have to click clear twice to remove the previous operation as well
  if (operationIsEmpty(currentOperation))
    previousOperation = { ...defaultOperation };
  else currentOperation = { ...defaultOperation };
}

function createDisplayString(operation) {
  const { a, b, operator, result } = operation;
  return result ? result : `${a} ${operator} ${b}`.trim();
}

function updateDisplay() {
  previousOperationDisplay.textContent = createDisplayString(previousOperation);
  currentOperationDisplay.textContent = createDisplayString(currentOperation);
}

function updateCurrent(value, operator = false) {
  // when the current operation has a result, any numeric or operator button will trigger a new operation
  if (currentOperation.result) {
    previousOperation = { ...currentOperation };
    currentOperation = { ...defaultOperation };

    if (operator) currentOperation.a = previousOperation.result;
  }

  // if the button is an operator, the current operation does not have a result, and it is a valid operation, calculate it and start a new operation with the result
  if (operator && isValidOperation(currentOperation)) {
    currentOperation.result = operate(currentOperation);
    previousOperation = { ...currentOperation };
    currentOperation = { ...defaultOperation };
    currentOperation.a = previousOperation.result;
  } else if (
    operator &&
    previousOperation.result &&
    operationIsEmpty(currentOperation)
  ) {
    currentOperation.a = previousOperation.result;
  }

  if (!operator && currentOperation.operator) {
    if (value === "." && currentOperation.b.includes(".")) return;
    currentOperation.b += value;
  } else if (operator) {
    currentOperation.operator = value;
  } else {
    if (value === "." && currentOperation.a.includes(".")) return;
    currentOperation.a += value;
  }
}

// event listener callback functions
function handleNumericClick(e) {
  const value = e.target.dataset.value;
  updateCurrent(value);
  updateDisplay();
}

function handleOperatorClick(e) {
  const value = e.target.dataset.value;
  updateCurrent(value, true);
  updateDisplay();
}

function handleCalculateClick() {
  if (!isValidOperation(currentOperation)) return;
  currentOperation.result = +operate(currentOperation).toFixed(5);
  updateDisplay();
}

function handleClearClick() {
  clearOperations();
  updateDisplay();
}

function handleBackspaceClick() {
  const { a, b, operator, result } = currentOperation;
  if (b) {
    if (result) currentOperation.result = "";
    currentOperation.b = b.slice(0, b.length - 1);
  } else if (operator) {
    currentOperation.operator = "";
  } else if (a) {
    currentOperation.a = a.slice(0, a.length - 1);
  }
  updateDisplay();
}

function handleKeyPress(e) {
  const { keyCode, shiftKey } = e;
  const btn = allBtns.find((btn) => {
    if (shiftKey) {
      return btn.dataset.keycodeShift && +btn.dataset.keycode === keyCode;
    }
    return (
      !btn.dataset.keycodeShift &&
      (+btn.dataset.keycode === keyCode ||
        +btn.dataset.keycodeAlt === keyCode ||
        +btn.dataset.keycodeNumpad === keyCode)
    );
  });
  if (btn) btn.click();
}

// event listeners
btnsNumeric.forEach((btn) => btn.addEventListener("click", handleNumericClick));
btnsOperator.forEach((btn) =>
  btn.addEventListener("click", handleOperatorClick)
);
btnCalcluate.addEventListener("click", handleCalculateClick);
btnClear.addEventListener("click", handleClearClick);
btnBackspace.addEventListener("click", handleBackspaceClick);

window.addEventListener("keyup", handleKeyPress);
