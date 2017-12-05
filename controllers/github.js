const fetch = require('node-fetch');

const { decrypt, constructDataObject } = require('../library/utils');

const ROOT_API_URL = 'https://api.github.com/';

/**
 * Field name mapping from generic profile-updater input fields to
 * GitHub name fields.
 */
const renameFields = {
  location: 'location',
  company: 'company',
  bio: 'bio',
  url: 'blog'
};

const fetchUser = async credentials => {
  const credentialsParsed = JSON.parse(credentials);
  const url = `${ROOT_API_URL}user?access_token=${decrypt(
    credentialsParsed.accessToken
  )}`;
  const response = await fetch(url);
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return { ...body, provider: 'github' };
};

const updateProfile = async ({ fields, credentials }) => {
  const url = `${ROOT_API_URL}user?access_token=${decrypt(
    credentials.accessToken
  )}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(constructDataObject(fields, renameFields))
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

const GitHubAPI = {
  fetchUser,
  updateProfile
};

module.exports = GitHubAPI;
