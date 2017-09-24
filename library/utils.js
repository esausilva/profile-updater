const AES = require('crypto-js/aes');
const UTF8 = require('crypto-js/enc-utf8');

/**
 * Dynamically add non-empty fields to 'data' object.
 * Returns:
 * {
 *    location: '...',
 *    description: '...',
 *    url: '...'
 * }
 * @param {object} fields - profile-updater generic input field names
 * @param {object} renameFields - Social provider specific field names
 */
exports.constructDataObject = (fields, renameFields) =>
  Object.keys(renameFields).reduce((data, key) => {
    if (fields[key].trim() !== '') {
      data[renameFields[key]] = fields[key];
    }
    return data;
  }, {});

/**
 * Dencrypts a sring from AES Encryption to clear text.
 * @param {string} encryptedStr - String to decrypt 
 */
exports.decrypt = encryptedStr =>
  AES.decrypt(encryptedStr, process.env.CRYPTOJS_KEY).toString(UTF8);
