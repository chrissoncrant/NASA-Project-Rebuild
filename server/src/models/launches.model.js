const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');

// let flightNumber = 100;

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

// flightNumber++;

// const launch2 = {
//     flightNumber: flightNumber,
//     launchDate: "12 December 2022",
//     mission: "Flight of the Bumblebee",
//     rocket: "Istanbul",
//     target: "Kepler-92 f",
//     customers: ['NASA', 'Oz'],
//     upcoming: true,
//     success: true,
// }

// const launches = new Map();

// launches.set(launch1.flightNumber, launch1);
// launches.set(launch2.flightNumber, launch2);

async function saveLaunch(launch) {
    const planetExists = await planetsDatabase.findOne({
        keplerName: launch.target
    });

    if (!planetExists) {
        throw Error('Planet is not valid!')
    };

    await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

saveLaunch(launch1);

function launchExists(flightNumber) {
    return launches.get(flightNumber);
}

// function getAllLaunches() {
//     return Array.from(launches.values());
// }

async function getAllLaunches() {
    return await launchesDatabase.find({}, '-_id -__v');
}

function addNewLaunch(launch) {
    flightNumber++,
    Object.assign(launch, {
        flightNumber: flightNumber,
        customers: ['NASA', 'Chris'],
        upcoming: true,
        success: true
    })
    launches.set(launch.flightNumber, launch);
    return launch;
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
    launchExists,
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
}