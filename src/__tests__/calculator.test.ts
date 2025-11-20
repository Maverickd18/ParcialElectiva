import { Calculator } from '../calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('debe sumar dos números positivos', () => {
      expect(calculator.add(5, 3)).toBe(8);
    });

    it('debe sumar números negativos', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    it('debe sumar números mixtos', () => {
      expect(calculator.add(10, -7)).toBe(3);
    });

    it('debe retornar 0 cuando suma 0 + 0', () => {
      expect(calculator.add(0, 0)).toBe(0);
    });
  });

  describe('subtract', () => {
    it('debe restar dos números positivos', () => {
      expect(calculator.subtract(10, 5)).toBe(5);
    });

    it('debe restar números negativos', () => {
      expect(calculator.subtract(-10, -5)).toBe(-5);
    });

    it('debe retornar número negativo cuando se resta mayor de menor', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('debe multiplicar dos números positivos', () => {
      expect(calculator.multiply(4, 5)).toBe(20);
    });

    it('debe multiplicar números negativos', () => {
      expect(calculator.multiply(-4, 5)).toBe(-20);
    });

    it('debe retornar 0 cuando multiplica por 0', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('debe dividir dos números', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('debe lanzar error cuando divide por cero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('División por cero no permitida');
    });

    it('debe retornar número decimal', () => {
      expect(calculator.divide(5, 2)).toBe(2.5);
    });
  });

  describe('factorial', () => {
    it('debe calcular factorial de 0', () => {
      expect(calculator.factorial(0)).toBe(1);
    });

    it('debe calcular factorial de 5', () => {
      expect(calculator.factorial(5)).toBe(120);
    });

    it('debe calcular factorial de 1', () => {
      expect(calculator.factorial(1)).toBe(1);
    });

    it('debe lanzar error con número negativo', () => {
      expect(() => calculator.factorial(-5)).toThrow('Factorial no definido para números negativos');
    });
  });
});
