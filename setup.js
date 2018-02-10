'use strict';

// Copies the contents of .env.example to .env for server and client
const fs = require('fs');
fs.createReadStream('.env.example').pipe(fs.createWriteStream('.env'));
fs
  .createReadStream('./client/.env.example')
  .pipe(fs.createWriteStream('./client/.env'));
