const launchesDatabase = require('./launches.mongo');
const { findOne } = require('./planets.mongo');
const planetsDatabase = require('./planets.mongo');
const axios = require('axios');

//Initial Launch:
const launch1 = {
    flightNumber: 100, //flight_number
    launchDate: "12 December 2022", //date_utc
    mission: "To the Stars", //name
    rocket: "M143", //rocket.name
    target: "Kepler-442 b", //not applicable
    customers: ['NASA'], //payloads.customers
    upcoming: true, //upcoming
    success: true, //success
}
//Initializes the database with the first launch:
// saveLaunch(launch1);

async function axiosRequest(body) {
    const response = await axios.post('https://api.spacexdata.com/v4/launches/query', body);
    if (response.status !== 200) {
        console.log("Problem downloading data from SpaceX API");
        throw new Error("Launch data not downloaded from SpaceX API");
    }
    return response;
}

async function checkForSpaceXUpdate() {
    const latestLaunchInDatabase = await getLatestFlightNumber();
    const axiosBody = {
        query: {
            flight_number: {
                $gt: latestLaunchInDatabase
            }
        },
        options: {}
    };
    const response = await axiosRequest(axiosBody);
    return response.data.docs.length;;
}

async function populateLaunchData() {
    const body = {
        query: {},
        options: {
            pagination: false,
            select: [
                "flight_number",
                "date_local",
                "name",
                "upcoming",
                "success"
            ],
            populate: [
                {
                    path: "rocket",
                    select: "name"
                },
                {
                    path: "payloads",
                    select: "customers"
                }
            ]
        }
    };
    const response = await axiosRequest(body);
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const customers = launchDoc.payloads.flatMap(payload => payload.customers);
        const launch = {
            flightNumber: launchDoc.flight_number,
            launchDate: launchDoc.date_local,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        }
        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const spaceXDatabaseUpdated = await checkForSpaceXUpdate();
    if(!spaceXDatabaseUpdated) {
        console.log('SpaceX Database up to date.')
    } else {
        await populateLaunchData();
    }
    console.log('SpaceX Data loaded...');
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

async function getAllLaunches() {
    return await launchesDatabase
        .find({}, '-_id -__v')
        .sort('flightNumber');
}

async function launchExists(flightNumber) {
    const flightExists = await launchesDatabase.findOne({
        flightNumber: flightNumber
    })
    return flightExists;
}

async function abortLaunch(flightNumber) {
    let updatedLaunch = await launchesDatabase.updateOne({
        flightNumber: flightNumber
    }, {
        upcoming: false,
        success: false
    });
    if(!updatedLaunch.modifiedCount) {
       return {
           error: "Launch already aborted."
       };
    } 
    return {
        message: "Launch aborted successfully."
    };
}

module.exports = {
    loadLaunchData,
    checkValidPlanet,
    addNewLaunch,
    getAllLaunches,
    launchExists,
    abortLaunch,
}

