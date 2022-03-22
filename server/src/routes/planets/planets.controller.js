const { getHabitablePlanets } = require('../../models/planets.model')

function httpGetAllPlanets(req, res) {
    res.status(200).json(getHabitablePlanets())
}

module.exports = {
    httpGetAllPlanets
}