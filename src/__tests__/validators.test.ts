import { isValidEmail, isNumeric, toUpperCase } from '../validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('debe validar un email correcto', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('debe rechazar email sin @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('debe rechazar email sin dominio', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('debe rechazar email vacío', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('debe rechazar email con espacios', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });

    it('debe validar email con subdomain', () => {
      expect(isValidEmail('user@mail.co.uk')).toBe(true);
    });
  });

  describe('isNumeric', () => {
    it('debe retornar true para string con solo números', () => {
      expect(isNumeric('12345')).toBe(true);
    });

    it('debe retornar false para string con letras', () => {
      expect(isNumeric('123abc')).toBe(false);
    });

    it('debe retornar false para string vacío', () => {
      expect(isNumeric('')).toBe(false);
    });

    it('debe retornar false para string con espacios', () => {
      expect(isNumeric('123 456')).toBe(false);
    });

    it('debe retornar false para string con caracteres especiales', () => {
      expect(isNumeric('123.456')).toBe(false);
    });
  });

  describe('toUpperCase', () => {
    it('debe convertir texto minúsculo a mayúsculo', () => {
      expect(toUpperCase('hello')).toBe('HELLO');
    });

    it('debe mantener texto ya en mayúscula', () => {
      expect(toUpperCase('HELLO')).toBe('HELLO');
    });

    it('debe manejar texto mixto', () => {
      expect(toUpperCase('HeLLo WoRLd')).toBe('HELLO WORLD');
    });

    it('debe manejar string vacío', () => {
      expect(toUpperCase('')).toBe('');
    });

    it('debe manejar números y caracteres especiales', () => {
      expect(toUpperCase('test123!@#')).toBe('TEST123!@#');
    });
  });
});
