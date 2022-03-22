const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets = [];

function isHabitablePlanet(planet) {
    return planet.koi_disposition === 'CONFIRMED' && planet.koi_insol > 0.36 && planet.koi_insol < 1.11 && planet.koi_prad < 1.6
}

fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', planet => {
        if (isHabitablePlanet(planet)) {
            planets.push(planet);
        }
    })
    .on('error', err => {
        console.log('Error received', err);
    })
    .on('end', () => {
        console.log(`${planets.length} habitable planets found!`);
    })

function getHabitablePlanets() {
    return planets;
}

    module.exports = getHabitablePlanets;