/* eslint-disable no-console */
import { Calculator } from './calculator';
import { isValidEmail, isNumeric, toUpperCase } from './validators';

const calc = new Calculator();

console.log('=== Calculadora ===');
console.log(`5 + 3 = ${calc.add(5, 3)}`);
console.log(`5 - 3 = ${calc.subtract(5, 3)}`);
console.log(`5 * 3 = ${calc.multiply(5, 3)}`);
console.log(`5 / 3 = ${calc.divide(5, 3).toFixed(2)}`);
console.log(`5! = ${calc.factorial(5)}`);

console.log('\n=== Validadores ===');
console.log(`Email "test@example.com" válido: ${isValidEmail('test@example.com')}`);
console.log(`Email "invalid" válido: ${isValidEmail('invalid')}`);
console.log(`"12345" es numérico: ${isNumeric('12345')}`);
console.log(`"abc" es numérico: ${isNumeric('abc')}`);
console.log(`toUpperCase("hello") = ${toUpperCase('hello')}`);
