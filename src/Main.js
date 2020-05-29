'use strict';
const NeuralNetwork = require('./Classes.js').NeuralNetwork;
const process = require('process');
const getPolynom = require('./PolynomInput.js').getPolynom;
const readline = require('readline');

const nn = new NeuralNetwork(1, 5, 1);
let consoleMode = 'c';
const COMMANDS = 'qtcfh';
const NORM_KOEF = 100;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const help = () => {
  console.log('Commands:');
  console.log('q - quit,');
  console.log('t - enter training example,');
  console.log('c - count value from input,');
  console.log('f - enter a function, generate 100 examples and train neural network');
  console.log('h - help,');
}
const invalInput = () => {
  console.log('Invalid input. Enter h for help');
}

const generateExamples = fn => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 2 * NORM_KOEF - NORM_KOEF;
    data[i] = [[x / NORM_KOEF], [fn(x) / NORM_KOEF]];
  }
  return data;
}
const trainNN = data => {
  for (const example of data) {
    nn.train(example[0], example[1]);
  }
}

rl.on('line', input => {
  if (input.length === 1 && COMMANDS.indexOf(input) != -1) {
    switch (input) {
      case 'q':
        rl.close();
        break;
      case 'h':
        help();
        break;
      case 'c':
        consoleMode = 'c';
        console.log('Enter a value and neural network will count the result');
        break;
      case 't':
        consoleMode = 't';
        console.log('Enter a value and the right answer. Format: "x y"');
        break;
      case 'f':
        consoleMode = 'f';
        console.log('Enter koefs near the powers of polynom');
        console.log('For example, 5x^2-3 will be "5 0 -3"');
        break;
    }
  } else {
    let x;
    let y;
    switch (consoleMode) {
      case 'c':
        x = parseInt(input) / NORM_KOEF;
        if (!isNaN(x)) {
          console.log('Result: ' + Math.round(nn.calcValues([x])[0]) * NORM_KOEF);
        }
        else invalInput();
        break;
      case 't':
        x = parseInt(input.split(' ')[0]) / NORM_KOEF;
        y = parseInt(input.split(' ')[1]) / NORM_KOEF;
        if (!isNaN(x) && !isNaN(y)) {
          nn.train([x], [y]);
        } else invalInput();
        break;
      case 'f':
        const fn = getPolynom(input);
        trainNN(generateExamples(fn));
        break;
    }
  }
});

help();
