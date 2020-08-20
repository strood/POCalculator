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
        console.log(e.key);
        clearDisplay();
        removeError();
        break;
      case 'Enter':
        // calculate input
        console.log(e.key);
        removeError();
        let output = parseDisplay();
        clearDisplay();
        addToDisplay(output);
        break;
      case 'Backspace':
        // Remove last character of display
        console.log(e.key);
        display.textContent = display.textContent.substring(0,display.textContent.length - 1);
        removeError();
        break;
      case '=':
        console.log(e.key);
        removeError();
        let answer = parseDisplay();
        clearDisplay();
        addToDisplay(answer);
        break;
    }
  } else if (inputKeys.includes(e.key)) {
    // Simply add basic keys to input
    console.log(e.key);
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
        console.log(character);
        removeError();
        let output = parseDisplay();
        clearDisplay();
        addToDisplay(output);
        break;
      case 'Clr':
        // Clear whole display
        console.log(character);
        clearDisplay();
        removeError();
        break;
      case 'Bksp':
        // Remove last character of display
        console.log(character);
        display.textContent = display.textContent.substring(0,display.textContent.length - 1);
        removeError();
        break;
    }
  } else if (inputKeys.includes(character)) {
    // Display basic input chars
    console.log(character);
    addToDisplay(character);
  }
}

function addToDisplay(value) {
  // Add to value to display
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
//  or error if invalid equation in the displaydi
function parseDisplay() {
  let equation = display.textContent.trim().split("");
  console.log(equation)
  // Once i have equation, check to make sure no two operators side by side
  //  as long as that holds, break it down into num, op, num and operate on interval
  if (checkValid(equation)) {
    // break down and display output
    computeEquation(equation);
    return "Valid equation"

  } else {
    return "Invalid Equation"
  }
}

function checkValid(equation) {
  // Equation is valid so long as two operators not side by side
  //  and no divide by 0

  // default true, list operators we looking for
  let valid = true;
  let operators = ["+","-","*","/","."];

  // check each digit of equation for validity
  equation.forEach((char, i) => {

    if (operators.includes(char)) {
      if (operators.includes(equation[i-1]) || operators.includes(equation[i+1]) ) {
        // flag as false
        valid = false;
      } else if (char == "/" && equation[i+1] == 0) {
        // Filter dividing by 0 here
        valid = false;
      }
    }
  });
  // Return validity boolean
  return valid;
}

// Combine numbers, then work through in sequential order solving problem
function computeEquation(equation) {
  let compressedEq = combineNums(equation);
  //  for each element, use tthe operator next to it on the number following that
  // operator. get the return back as accumulator, then do the same for next one
  // Likely use reduce function for this
  // TODO:
}

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
