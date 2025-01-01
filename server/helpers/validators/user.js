const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 15;

/**
 * @param {string} username
 * @returns {boolean}
 */
export function isValidUsername(username) {
  return (
    username != null &&
    username.length >= MIN_USERNAME_LENGTH &&
    username.length <= MAX_USERNAME_LENGTH &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
}
