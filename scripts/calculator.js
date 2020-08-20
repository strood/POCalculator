function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function sum(numArray) {
  return (numArray.length < 1) ? 0 : numArray.reduce((num, sum) => sum += num);
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
	return a / b;
}

function power(a, b) {
  let sum = a
  while (b > 1) {
    sum *= a
    b--
  }
  return sum
}

function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num *= factorial(num - 1)
  }
}

export function operate(num1, operator, num2) {
  switch (operator) {
    case '+':
			return add(num1, num2);
      break;
    case '-':
			return subtract(num1, num2);
      break;
    case '/':
			return divide(num1, num2);
      break;
    case '*':
			return multiply(num1, num2);
      break;

  }
}
