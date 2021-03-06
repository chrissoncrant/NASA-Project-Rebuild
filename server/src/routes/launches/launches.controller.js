const { 
    checkValidPlanet,
    addNewLaunch,
    getAllLaunches,
    launchExists,
    abortLaunch,
 } = require("../../models/launches.model");
const getPagination = require("../../services/query");

async function httpGetLaunches(req, res) {
    const { limit, skip } = getPagination(req.query);
    const launches = await getAllLaunches(limit, skip);
    return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    
    if (!launch.target || !launch.mission || !launch.rocket || !launch.target) {
        return res.status(400).json({
            error: "Missing mission critical data."
        })
    }

    let launchDate = new Date(launch.launchDate);

    if(isNaN(launchDate.valueOf())) {
        return res.status(400).json({
            error: "Invalid Date",
        })
    }

    let fourDaysFromTodayInMs = Date.now() + 345600000;

    if(launchDate <= fourDaysFromTodayInMs) {
        return res.status(400).json({
            error: "Invalid date. Launches need at least 4 days to get set up."
        })
    }

    const planetExists = await checkValidPlanet(launch.target);

    if (!planetExists) {
        return res.status(400).json({
            error: "This planet is not a valid exoplanet."
        })
    }
    
    await addNewLaunch(launch);

    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const flightNumber = Number(req.params.id);
    const check = await launchExists(flightNumber);
    if (!check) {
        return res.status(404).json({
            error: 'Launch does not exist.'
        })
    }

    let updatedLaunch = await abortLaunch(flightNumber);

    return res.status(200).json(updatedLaunch);
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}