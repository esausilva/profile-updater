const fetch = require('node-fetch');
const OAuth = require('oauth-1.0a');
const Base64 = require('crypto-js/enc-base64');
const HmacSHA1 = require('crypto-js/hmac-sha1');

const { decrypt, constructDataObject } = require('../library/utils');

const ROOT_API_URL = 'https://api.twitter.com/1.1/';
const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

/**
 * Field name mapping from generic profile-updater input fields to 
 * Twitter name fields.
 */
const renameFields = {
  location: 'location',
  bio: 'description',
  url: 'url'
};

const fetchUser = async (screenName, credentials) => {
  const credentialsParsed = JSON.parse(credentials);
  const url = `${ROOT_API_URL}users/lookup.json?screen_name=${screenName}`;

  const response = await fetch(url, {
    method: HTTP_GET,
    headers: generateOAutHeaders(url, HTTP_GET, credentialsParsed)
  });
  let body = await response.json();
  body = body[0];

  if (response.status !== 200) throw Error(body.message);

  return { ...body, provider: 'twitter' };
};

const updateProfile = async ({ fields, credentials }) => {
  const data = constructDataObject(fields, renameFields);
  const queryStrings = constructQueryString(data);
  const url = `${ROOT_API_URL}account/update_profile.json?${queryStrings}`;

  const response = await fetch(url, {
    method: HTTP_POST,
    headers: generateOAutHeaders(url, HTTP_POST, credentials)
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

/**
 * Private.
 * "The signature is calculated by passing the signature base string and signing 
 * key to the HMAC-SHA1 hashing algorithm".
 * * https://dev.twitter.com/oauth/overview/creating-signatures#calculating-the-signature
 * @param {string} baseString - 
 * @param {string} signingKey - 
 */
const calculateTheSignature = (baseString, signingKey) =>
  Base64.stringify(HmacSHA1(baseString, signingKey));

/**
 * Private.
 * Generates authentication headers to send to Twitter API call.
 * * https://dev.twitter.com/oauth/overview/authorizing-requests
 * @param {string} url - Twitter API URL
 * @param {string} method - HTTP request method
 * @param {object} credentials - Object with user authentication token and secret
 */
const generateOAutHeaders = (url, method, credentials) => {
  const oauth = OAuth({
    consumer: {
      key: CONSUMER_KEY,
      secret: CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: calculateTheSignature
  });

  const token = {
    key: decrypt(credentials.accessToken),
    secret: decrypt(credentials.secret)
  };

  const request_data = {
    url: `${url}`,
    method: `${method}`
  };

  return oauth.toHeader(oauth.authorize(request_data, token));
};

/**
 * Private.
 * URL encoding.
 * Original string: Dogs, Cats & Mice.
 * Encoded string: Dogs%2C%20Cats%20%26%20Mice.
 * * https://dev.twitter.com/oauth/overview/percent-encoding-parameters
 * @param {string} str - String to percent encode
 */
const percentEncode = str =>
  encodeURIComponent(str).replace(
    /[!'()*]/g,
    c => '%' + c.charCodeAt(0).toString(16)
  );

/**
 * Private.
 * Constructs the query string that will be passed to the Twitter API call.
 * e.g., status=Hello%20Ladies%20%2b%20Gentlemen&
 * @param {object} data - Data passed to Twitter
 */
const constructQueryString = data =>
  Object.keys(data)
    .reduce((acc, key) => (acc += `${key}=${percentEncode(data[key])}&`), '')
    .slice(0, -1);

const TwitterAPI = {
  fetchUser,
  updateProfile
};

module.exports = TwitterAPI;
