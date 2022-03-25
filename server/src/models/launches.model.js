const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');

//Initial Launch:
const launch1 = {
    flightNumber: 100,
    launchDate: "12 December 2022",
    mission: "To the Stars",
    rocket: "M143",
    target: "Kepler-442 b",
    customers: ['NASA'],
    upcoming: true,
    success: true,
}

async function checkValidPlanet(planetName) {
    const planetExists = await planetsDatabase.findOne({
        keplerName: planetName
    });
    return planetExists;
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne({})
        .sort('-flightNumber');
    console.log(latestLaunch.flightNumber)
    return latestLaunch.flightNumber;
}

async function completeLaunch(launch) {
    const flightNumber = await getLatestFlightNumber() + 1;
    Object.assign(launch, {
        flightNumber,
        customers: ['NASA', 'Chris'],
        upcoming: true,
        success: true
    })
    return launch;
}

async function saveLaunch(completedLaunch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: completedLaunch.flightNumber
    }, completedLaunch, {
        upsert: true
    })
}

async function addNewLaunch(launch) {
    const completedLaunch = await completeLaunch(launch);
    saveLaunch(completedLaunch);
    return completedLaunch;
}

// function addNewLaunch(launch) {
//     flightNumber++,
//     Object.assign(launch, {
//         flightNumber: flightNumber,
//         customers: ['NASA', 'Chris'],
//         upcoming: true,
//         success: true
//     })
//     launches.set(launch.flightNumber, launch);
//     return launch;
// }

// function launchExists(flightNumber) {
//     return launches.get(flightNumber);
// }

async function getAllLaunches() {
    return await launchesDatabase.find({}, '-_id -__v');
}

async function launchExists(flightNumber) {
    const flightExists = await launchesDatabase.findOne({
        flightNumber: flightNumber
    })
    return flightExists;
}

function abortLaunch(flightNumber) {
    let updatedLaunch = launches.get(flightNumber);
    Object.assign(updatedLaunch, {
        upcoming: false,
        success: false,
    });

    return updatedLaunch;
}

module.exports = {
    checkValidPlanet,
    addNewLaunch,
    getAllLaunches,
    launchExists,
    abortLaunch,
}

