/**
 * Password validation utilities for Travally
 * Enforces:
 * - Minimum 8 characters
 * - At least one uppercase letter (Cap)
 * - At least one lowercase letter (small)
 * - At least one number
 * - At least one special character
 */

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export function evaluatePassword(password: string): PasswordCriteria {
  const p = password || "";
  const minLength = p.length >= 8;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(p);
  const isValid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isValid,
  };
}

export function getPasswordErrorMessage(criteria: PasswordCriteria): string | null {
  if (criteria.isValid) return null;
  const missing: string[] = [];
  if (!criteria.minLength) missing.push("min 8 characters");
  if (!criteria.hasUppercase) missing.push("1 uppercase letter (A-Z)");
  if (!criteria.hasLowercase) missing.push("1 lowercase letter (a-z)");
  if (!criteria.hasNumber) missing.push("1 number (0-9)");
  if (!criteria.hasSpecialChar) missing.push("1 special character (!@#$%...)");

  return `Password requires: ${missing.join(", ")}.`;
}
