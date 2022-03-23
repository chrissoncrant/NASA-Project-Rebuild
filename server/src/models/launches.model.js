let flightNumber = 100;

const launch1 = {
    flightNumber: 100,
    launchDate: "12 December 2022",
    mission: "To the Stars",
    rocket: "M143",
    target: "Kepler-234 b",
    customers: ['NASA'],
    upcoming: true,
    success: true,
}

flightNumber++;

const launch2 = {
    flightNumber: flightNumber,
    launchDate: "12 December 2022",
    mission: "Flight of the Bumblebee",
    rocket: "Istanbul",
    target: "Kepler-92 f",
    customers: ['NASA', 'Oz'],
    upcoming: true,
    success: true,
}

const launch3 = {
    launchDate: "12 December 2065",
    mission: "Flight of the Navigator",
    rocket: "Constantinople",
    target: "Kepler-292 d"
}

const launches = new Map();

launches.set(launch1.flightNumber, launch1);
launches.set(launch2.flightNumber, launch2);

function getAllLaunches() {
    return Array.from(launches.values());
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


module.exports = {
    getAllLaunches,
    addNewLaunch,
}