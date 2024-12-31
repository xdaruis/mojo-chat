/**
 * @param {string} username
 * @returns {boolean}
 */
export function isValidUsername(username) {
  return (
    username != null &&
    username.length >= 4 &&
    username.length <= 10 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
}
