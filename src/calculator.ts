export class Calculator {
  /**
   * Suma dos números
   */
  public add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Resta dos números
   */
  public subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiplica dos números
   */
  public multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Divide dos números
   */
  public divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('División por cero no permitida');
    }
    return a / b;
  }

  /**
   * Calcula el factorial de un número
   */
  public factorial(n: number): number {
    if (n < 0) {
      throw new Error('Factorial no definido para números negativos');
    }
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * this.factorial(n - 1);
  }
}
