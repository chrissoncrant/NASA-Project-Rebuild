const express = require('express');
const { 
    httpGetLaunches, 
    httpAddNewLaunch, 
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetLaunches);
launchesRouter.post('/', httpAddNewLaunch);

module.exports = launchesRouter;