const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express.js on Netlify!' });
});

module.exports.handler = serverless(app);
