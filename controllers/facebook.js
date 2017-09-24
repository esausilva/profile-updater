const fetch = require('node-fetch');
const { constructDataObject } = require('../library/utils');

const ROOT_API_URL = '';
const ACCESS_TOKEN = '';

const renameFields = {
  location: 'location',
  company: 'company',//list<WorkExperience>
  bio: 'about',//string
  url: 'website'//string
};

const fetchUser = async () => {
}

const updateProfile = async (fields) => {
}

const FacebookAPI = {
  fetchUser,
  updateProfile
};

module.exports = FacebookAPI;