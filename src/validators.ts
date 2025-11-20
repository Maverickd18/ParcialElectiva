/**
 * Valida si un string es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si un string contiene solo números
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Convierte texto a mayúsculas
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}
