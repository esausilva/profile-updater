const express = require('express');
const router = express.Router();

const TwitterAPI = require('../controllers/twitter');
const GitHubAPI = require('../controllers/github');
const FacebookAPI = require('../controllers/facebook');

router.get('/api/github', (req, res) => {
  GitHubAPI.fetchUser(req.headers['x-credentials'])
    .then(data => res.json(data))
    .catch(err => res.json(err));
});
router.post('/api/github', (req, res) => {
  GitHubAPI.updateProfile(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.get('/api/twitter', (req, res) => {
  TwitterAPI.fetchUser(req.query.handle, req.headers['x-credentials'])
    .then(data => res.json(data))
    .catch(err => res.json(err));
});
router.post('/api/twitter', (req, res) => {
  TwitterAPI.updateProfile(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.get('/api/facebook', (req, res) => {
  FacebookAPI.fetchUser(req.headers['x-credentials'])
    .then(data => res.json(data))
    .catch(err => res.json(err));
});
router.post('/api/facebook', (req, res) => {
  FacebookAPI.updateProfile(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

module.exports = router;
