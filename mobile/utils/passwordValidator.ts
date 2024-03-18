/**
 * Validates the password using a regular expression.
 * Checks if password contains upper case letter.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export function UpperCasePasswordValidator(password: string): boolean {
  return /[A-Z]/.test(password);
}

/**
 * Validates the password using a regular expression.
 * Checks if password contains lower case letter.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export function LowerCasePasswordValidator(password: string): boolean {
  return /[a-z]/.test(password);
}

/**
 * Validates the password using a regular expression.
 * Checks if password contains digits.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export function DigitPasswordValidator(password: string): boolean {
  return /\d/.test(password);
}

/**
 * Validates the password using a regular expression.
 * Checks if password contains special letter.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export function SpecialLetterPasswordValidator(password: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

/**
 * Validates the password using a regular expression.
 * Checks if password satisfied minimum length.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export function MinimumLengthValidator(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validates the password using validators.
 * Returns `true` if the password is valid, and `false` otherwise.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} `true` if the passwordis valid, and `false` otherwise.
 */
export default function IsPasswordValid(password: string): boolean {
  let errors: boolean[] = [];

  errors.push(UpperCasePasswordValidator(password));
  errors.push(LowerCasePasswordValidator(password));
  errors.push(DigitPasswordValidator(password));
  errors.push(SpecialLetterPasswordValidator(password));
  errors.push(MinimumLengthValidator(password));

  return !Boolean(errors.indexOf(false) > -1);
}
