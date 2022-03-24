const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

describe('Test POST /launches', () => {
    const completeLaunch = {
        launchDate: "12 December 2022",
        mission: "To the Stars",
        rocket: "M143",
        target: "Kepler-452 b",
    }

    const launchWithoutDate = {
        mission: "To the Stars",
        rocket: "M143",
        target: "Kepler-452 b",
    }

    const badDateLaunch = {
        launchDate: "12 December 2021",
        mission: "To the Stars",
        rocket: "M143",
        target: "Kepler-452 b",
    }

    const incompleteLaunch = {
        launchDate: "12 December 2022",
        mission: "",
        rocket: "M143",
        target: "Kepler-452 b",
    }
    
    test('Should respond with 201 Created', async ()=> {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunch)
            .expect('Content-Type', /json/)
            .expect(201);
        const requestDate = new Date(completeLaunch.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(response.body).toMatchObject(launchWithoutDate);
        expect(responseDate).toBe(requestDate);
    })
})
