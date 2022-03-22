const express = require('express');
const { 
    httpGetLaunches, 
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetLaunches);

module.exports = launchesRouter;