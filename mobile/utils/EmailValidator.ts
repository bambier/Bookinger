/**
 * Validates an email address using a regular expression.
 * Returns `true` if the email address is valid, and `false` otherwise.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} `true` if the email address is valid, and `false` otherwise.
 */
export default function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
