import AES from 'crypto-js/aes';

/**
 * Checks if an object is empty.
 * @param {object} obj - Object to check
 */
export const isEmptyObject = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

/**
 * Encrypts a sring using AES Encryption.
 * @param {string} clearStr - String to encrypt
 */
export const encrypt = clearStr =>
  AES.encrypt(clearStr, process.env.CRYPTOJS_KEY).toString();

/**
 * Transforms first letter in a character string to upper case.
 * @param {string} str - String to transform
 */
export const firstLetterToUpper = str =>
  str.charAt(0).toUpperCase() + str.slice(1);
