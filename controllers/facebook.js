/**
 * Facebook requires some permissions to be added and reviewd by their team in order
 * to send updates to your Facebook profile. I will not go through that review process
 * since this app is not going to be deployed to production.
 *
 * These are the permissions:
 *  - user_location
 *  - user_work_history
 *  - user_about_me
 *  - user_website
 *
 * https://developers.facebook.com/docs/facebook-login/permissions/
 */

const fetch = require('node-fetch');

const { decrypt, constructDataObject } = require('../library/utils');

const ROOT_API_URL = 'https://graph.facebook.com/v2.11/';

const renameFields = {
  location: 'location',
  company: 'work',
  bio: 'about',
  url: 'website',
  profile_pic: 'picture',
  profile_link: 'link'
};

const fetchUser = async credentials => {
  const credentialsParsed = JSON.parse(credentials);
  const fields = constructQueryString();
  const url = `${ROOT_API_URL}me?fields=${fields}&access_token=${decrypt(
    credentialsParsed.accessToken
  )}`;
  const response = await fetch(url);
  const body = await response.json();

  console.log(decrypt(credentialsParsed.accessToken));

  if (response.status !== 200) throw Error(body.message);

  return { ...body, provider: 'facebook' };
};

const updateProfile = async ({ fields, credentials }) => {
  const qs = 'about=BJJ&website=https%3A%2F%2Fesausilva.com';
  const url = `${ROOT_API_URL}me?${qs}&access_token=${decrypt(
    credentials.accessToken
  )}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

/**
 * Private.
 * Constructs the query string that will be passed to the Facebook API call.
 * e.g., fields=location%2Cwork
 * @param {object} data - Data passed to Twitter
 */
const constructQueryString = () => {
  const queryString = Object.keys(renameFields)
    .reduce((acc, key) => (acc += `${renameFields[key]},`), '')
    .slice(0, -1);
  return percentEncode(queryString);
};

/**
 * Private.
 * URL encoding.
 * Original string: Dogs, Cats & Mice.
 * Encoded string: Dogs%2C%20Cats%20%26%20Mice.
 * @param {string} str - String to percent encode
 */
const percentEncode = str =>
  encodeURIComponent(str).replace(
    /[!'()*]/g,
    c => '%' + c.charCodeAt(0).toString(16)
  );

const FacebookAPI = {
  fetchUser,
  updateProfile
};

module.exports = FacebookAPI;
