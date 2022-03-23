const { getAllLaunches } = require("../../models/launches.model")

function httpGetLaunches(req, res) {
    res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
    if (!req.body.target || !req.body.mission || !req.body.rocket || !req.body.target) {
        res.status(400).json({
            error: "Missing mission critical data."
        })
    }

    let launchDate = new Date(req.body.launchDate);

    if(isNaN(launchDate.valueOf())) {
        res.status(400).json({
            error: "Invalid Date",
        })
    }

    let fourDaysFromTodayInMs = Date.now() + 345600000;
    
    if(launchDate <= fourDaysFromTodayInMs) {
        res.status(400).json({
            error: "Invalid date. Launches need at least 4 days to get set up."
        })
    }
}

let test = Date.now();

console.log(test)



module.exports = {
    httpGetLaunches,
    httpAddNewLaunch
}