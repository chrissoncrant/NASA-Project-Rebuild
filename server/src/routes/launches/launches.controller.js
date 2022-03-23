const { 
    getAllLaunches,
    addNewLaunch
 } = require("../../models/launches.model")

function httpGetLaunches(req, res) {
    res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
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
    
    addNewLaunch(launch);

    return res.status(201).json(launch);
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch
}