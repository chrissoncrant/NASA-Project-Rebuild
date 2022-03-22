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

const launch2 = {
    flightNumber: 101,
    launchDate: "12 December 2022",
    mission: "Flight of the Bumblebee",
    rocket: "Istanbul",
    target: "Kepler-92 f",
    customers: ['NASA', 'Oz'],
    upcoming: true,
    success: true,
}

const launches = new Map();

launches.set(launch1.flightNumber, launch1);
launches.set(launch2.flightNumber, launch2);

function getAllLaunches() {
    return Array.from(launches.values());
}

module.exports = {
    getAllLaunches
}