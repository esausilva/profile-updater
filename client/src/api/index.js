import 'whatwg-fetch';

const URL_GITHUB = '/api/github';
const URL_TWITTER = '/api/twitter';
const URL_FACEBOOK = '/api/facebook';

/**
 * Private.
 * GET API call to get user profile details.
 * @param {string} url - API URL
 * @param {object} credentials - User authentication to connect to API
 */
const fetchUser = async (url, credentials) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-credentials': JSON.stringify(credentials)
    }
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

/**
 * Private.
 * POST API call to update user profile.
 * @param {string} url - API URL
 * @param {object} fields - Profile fields to update
 * @param {object} credentials - User authentication to connect to API
 */
const updateUserProfile = async (url, fields, credentials) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields,
      credentials
    })
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

/**
 * Public.
 * Gets Twitter user profile details.
 * @param {string} handle - Twitter handle
 * @param {object} credentials - User authentication to connect to Twitter API
 */
const fetchTwitterUser = (handle, credentials) =>
  fetchUser(`${URL_TWITTER}?handle=${handle}`, credentials);
/**
 * Public.
 * Updates Twitter user profile.
 * @param {object} fields - Profile fields to update
 * @param {object} credentials - User authentication to connect to Twitter API
 */
const updateTwitterUserProfile = (fields, credentials) =>
  updateUserProfile(URL_TWITTER, fields, credentials);

/**
 * Public.
 * Gets GitHub user profile details.
 * @param {object} credentials - User authentication to connect to GitHub API
 */
const fetchGithubUser = credentials => fetchUser(URL_GITHUB, credentials);
/**
 * Public.
 * Updates GitHub user profile.
 * @param {object} fields - Profile fields to update
 * @param {object} credentials - User authentication to connect to GitHub API
 */
const updateGithubUserProfile = (fields, credentials) =>
  updateUserProfile(URL_GITHUB, fields, credentials);

/**
 * Public.
 * Gets Facebook user profile details.
 * @param {object} credentials - User authentication to connect to Facebook API
 */
const fetchFacebookUser = credentials => fetchUser(URL_FACEBOOK, credentials);

const API = {
  fetchTwitterUser,
  updateTwitterUserProfile,
  fetchGithubUser,
  updateGithubUserProfile,
  fetchFacebookUser
};

export default API;
