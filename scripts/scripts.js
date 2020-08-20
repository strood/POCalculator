import { operate as calc } from './calculator.js';
// Variables
let darkBlue = '#0B3954';
let darkPurple = '#401F3E';
let lightBlue = '#759AAB';

const content = document.querySelector('.content');
const calculator = document.querySelector('.calculatorBody');
const display = document.querySelector('.calculatorScreen');
const buttons = Array.from(document.getElementsByClassName('button'));
const submitButton = document.querySelector('.equalsButton');


buttons.forEach((button, i) => {
  // Button effects handeled in JS
  button.addEventListener('mousedown', () => {
    button.style.border = '2px solid yellow';
    button.style.color = 'red';
  });
  button.addEventListener('mouseup', () => {
    button.style.border = `2px solid ${darkBlue}`;
    button.style.color = `${darkPurple}`;
  });
  button.addEventListener('mouseenter', () => {
    button.style.border = `2px solid ${lightBlue}`;
  });
  button.addEventListener('mouseleave', () => {
    button.style.border = `2px solid ${darkBlue}`;
    button.style.color = `${darkPurple}`;

  });


  // On click i want to capture the click, and paste that number into the display
  button.addEventListener('click', (e) => {
    let clickedButton = e.target.textContent.trim();
    logClick(clickedButton);
  });

});

// Capture keypresses to make usable from keyboard
document.addEventListener('keydown', logKey);

// Take keystrokes in and filter for ones we want, calling addToDisplay when clicked
function logKey(e) {
  // Lists of keys im listening for, divided up base don what ill do.
  let inputKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '*', '/', '+', '.'];
  let actionKeys = ['Delete', 'Enter', 'Backspace', '='];
  if (actionKeys.includes(e.key)) {
    // Swap between cases if an action key is pressed
    switch (e.key) {
      case 'Delete':
        // Clear whole display
        clearDisplay();
        removeError();
        break;
      case 'Enter':
        // calculate input
        removeError();
        let output = parseDisplay();
        clearDisplay();
        addToDisplay(output);
        break;
      case 'Backspace':
        // Remove last character of display
        display.textContent = display.textContent.substring(0,display.textContent.length - 1);
        removeError();
        break;
      case '=':
        removeError();
        let answer = parseDisplay();
        clearDisplay();
        addToDisplay(answer);
        break;
    }
  } else if (inputKeys.includes(e.key)) {
    // Simply add basic keys to input
    addToDisplay(e.key);
  }
}

function logClick(character) {
  // Lists of keys im listening for, divided up base don what ill do.
  let inputKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '*', '/', '+', '.'];
  let actionKeys = ['=', 'Clr', 'Bksp'];
  if (actionKeys.includes(character)) {
    // console.log(character);
    switch (character) {
      case '=':
        // Calculate input
        removeError();
        let output = parseDisplay();
        clearDisplay();
        addToDisplay(output);
        break;
      case 'Clr':
        // Clear whole display
        clearDisplay();
        removeError();
        break;
      case 'Bksp':
        // Remove last character of display
        display.textContent = display.textContent.substring(0,display.textContent.length - 1);
        removeError();
        break;
    }
  } else if (inputKeys.includes(character)) {
    // Display basic input chars
    addToDisplay(character);
  }
}

// ============== Display Functions ================

function addToDisplay(value) {
  // Add to value to display
  if (display.textContent.includes("equation")) {
    clearDisplay();
  }

  if (display.textContent.length < 30) {
    display.textContent += value;

  } else {
    // Display error if too many digits, delete existing error if present
    removeError();
    createError();
  }
}

function clearDisplay() {
  display.textContent = "";
}

// Parse what is in display, pass operations to operator and return answer
//  or error if invalid equation in the display
function parseDisplay() {
  let equation = display.textContent.trim().split("");
  // Once i have equation, check to make sure no two operators side by side
  //  as long as that holds, break it down into num, op, num and operate on interval
  if (checkValid(equation)) {

    // recombine numbers properly to be operated on
    let compressedEq = combineNums(equation);

    // in BEDMAS order operate on all parts of equation, return result
    let answer = computeEquation(compressedEq);

    return answer; // This is what will get printed to screen

  } else {
    return "Invalid equation"; // This is what will get printed to screen

  }
}

// ======= Computation Functions ======

function checkValid(equation) {
  // Equation is valid so long as two operators not side by side
  //  and no divide by 0
  // default true, list operators we looking for
  let operators = ["+","-","*","/","."];
  // default valid
  let valid = true;

  // check each digit of equation for validity
  equation.forEach((char, i) => {

    if (operators.includes(char)) {
      // if it is an operator, check conditions, nums are fine
      if (operators.includes(equation[i-1]) || operators.includes(equation[i+1]) ) {
        // False if two operators in a row
        valid = false;
      } else if (char == "/" && equation[i+1] == 0) {
        // False if dividing by 0
        valid = false;
      } else if ((i == 0 && operators.includes(char)) ||(i == equation.length - 1 && operators.includes(char))) {
        // False if equations starting or ending with operator
        valid = false;
      }
    }
  });
  // Return validity boolean
  return valid;
}


function combineNums(equation) {
  // operators and new equation
  let operators = ["+","-","*","/"];
  let shortEquation = [];

  // check each item to combine into short eq
  equation.forEach((item, i) => {

    if (operators.includes(item)) {
      // add operators to the new equation by default
      shortEquation.push(item);
    } else {
      // current item is a number, decide what to do with it
      if(operators.includes(equation[i + 1])) {
        // if next digit operator, its fine add current num to new eq
        shortEquation.push(item);
      } else if (i == equation.length - 1) {
        // if last digit, push to list
        shortEquation.push(item);
      } else {
        // if currrent and next item a digit, concat this item to next
        // We will check it on next loop
        equation[i + 1] = item + equation[i + 1];
      }
    }
  });
  // return our new eq to be computed
  return shortEquation;
}

// in BEDMAS order operate on all parts of equation, return result
function computeEquation(equation) {
  // Recursvily recomb through equation. Each time filtering through
  // BEDMAS, doing operation if present, then calling computeEquation on
  //  the new array it makes Once completed will hit end with just filtered equation
  // being our final  answer

  if(equation.includes("/")) {
    // grab index, and use that to grab numbers to calc
    let i = equation.indexOf("/");
    let num1 = equation[i - 1];
    let num2 = equation[i + 1];
    let newNum = calc(num1, '/', num2);
    // splice out used number and insert our new  number
    equation.splice((i-1), 3);
    equation.splice((i-1), 0, newNum);
    // pass function back to continue computing
    computeEquation(equation);
  }
  if(equation.includes("*")) {
    // grab index, and use that to grab numbers to calc
    let i = equation.indexOf("*");
    let num1 = equation[i - 1];
    let num2 = equation[i + 1];
    let newNum = calc(num1, '*', num2);
    // splice out used number and insert our new  number
    equation.splice((i-1), 3);
    equation.splice((i-1), 0, newNum);
    // pass function back to continue computing
    computeEquation(equation);
  }
  if(equation.includes("+")) {
    // grab index, and use that to grab numbers to calc
    let i = equation.indexOf("+");
    let num1 = equation[i - 1];
    let num2 = equation[i + 1];
    let newNum = calc(num1, '+', num2);
    // splice out used number and insert our new  number
    equation.splice((i-1), 3);
    equation.splice((i-1), 0, newNum);
    // pass function back to continue computing
    computeEquation(equation);
  }
  if(equation.includes("-")) {
    // grab index, and use that to grab numbers to calc
    let i = equation.indexOf("-");
    let num1 = equation[i - 1];
    let num2 = equation[i + 1];
    let newNum = calc(num1, '-', num2);
    // splice out used number and insert our new  number
    equation.splice((i-1), 3);
    equation.splice((i-1), 0, newNum);
    // pass function back to continue computing
    computeEquation(equation);
  }
  return equation;
}


//  ====== Error Functions ======

// Remove error message
function removeError() {
  if (document.getElementById('error')) {
    let div = document.getElementById('error');
    div.parentNode.removeChild(div);
  }
}

// Add error message
function createError() {
  let error = document.createElement('div');
  error.setAttribute('id', 'error');
  error.style.color = 'red';
  error.textContent = 'Input Limit Reached'
  calculator.insertBefore(error, display);
}
