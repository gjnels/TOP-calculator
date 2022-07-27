"use strict";

const defaultOperation = { a: "", b: "", operator: "" };

let previousOperation = { ...defaultOperation };
let currentOperation = { ...defaultOperation };

// element selectors
const currentOperationDisplay = document.querySelector(".current");
const previousOperationDisplay = document.querySelector(".previous");

const btns = [...document.querySelectorAll("button")];

// math operations
const add = (a, b) => +a + +b;
const subtract = (a, b) => +a - +b;
const multiply = (a, b) => +a * +b;
const divide = (a, b) => +a / +b;

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

// ui update functions
function currentOperationIsEmpty() {
  const { a, b, operator, result } = currentOperation;
  if (!a && !b && !operator && !result) return true;
  return false;
}

function clearOperations() {
  if (currentOperationIsEmpty()) previousOperation = { ...defaultOperation };
  else currentOperation = { ...defaultOperation };
}

function createDisplayString(operation) {
  return (
    `${operation.a} ${operation.operator} ${operation.b} ${
      operation.result ? `= ${operation.result}` : ""
    }`.trim() || " "
  );
}

function updateDisplay() {
  previousOperationDisplay.textContent = createDisplayString(previousOperation);
  currentOperationDisplay.textContent = createDisplayString(currentOperation);
}

function updateCurrent(value, operator) {
  if (operator) {
    currentOperation.operator = value;
    return;
  } else if (currentOperation.operator) {
    currentOperation.b += value;
  } else {
    currentOperation.a += value;
  }
}

// event listener callback functions
function handleButtonClick(e) {
  const value = e.target.dataset.key;
  const operator = e.target.classList.contains("operator");

  if (value === "clear") {
    clearOperations();
  } else if (currentOperation.result) {
    previousOperation = { ...currentOperation };
    currentOperation = { ...defaultOperation };
    updateCurrent(value, operator);
  } else if (value === "=") {
    const result = operate(currentOperation);
    currentOperation = { ...currentOperation, result };
  } else {
    updateCurrent(value, operator);
  }
  console.log(currentOperation);
  updateDisplay();
}

// event listeners
btns.forEach((btn) => btn.addEventListener("click", handleButtonClick));
