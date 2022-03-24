const { getHabitablePlanets } = require('../../models/planets.model')

async function httpGetAllPlanets(req, res) {
    res.status(200).json(await getHabitablePlanets())
}

module.exports = {
    httpGetAllPlanets
}