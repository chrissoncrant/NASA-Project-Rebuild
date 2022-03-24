const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planetsDatabase = require('./planets.mongo');

function isHabitablePlanet(planet) {
    return planet.koi_disposition === 'CONFIRMED' && planet.koi_insol > 0.36 && planet.koi_insol < 1.11 && planet.koi_prad < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async planet => {
                if (isHabitablePlanet(planet)) {
                    savePlanets(planet);
                };
            })
            .on('error', err => {
                console.log('Error received while parsing planet data...', err);
                reject(err);
            })
            .on('end', async () => {
                const planets = await planetsDatabase.find({});
                // console.log(`${planets.length} habitable planets found!`);
                console.log(`${planets.length} habitable planets found!`);
                resolve();
            })
    })
}

async function savePlanets(planet) {
    try {
        await planetsDatabase.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch(err) {
        console.log("Could not save the planet...", err);
    };
}
        

async function getHabitablePlanets() {
    return await planetsDatabase.find({}, '-_id -__v');
}

module.exports = {
    loadPlanetsData,
    getHabitablePlanets
};

