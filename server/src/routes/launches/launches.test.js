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

    const invalidDateLaunch = {
        launchDate: "Hello",
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
        console.log("test", response.body)
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchWithoutDate);
    });

    test('Missing Data: Should respond with 400', async () => {
        const response = await request(app)
            .post('/launches')
            .send(incompleteLaunch)
            .expect('Content-Type', /json/)
            .expect(400)
        expect(response.body).toStrictEqual({
            error: "Missing mission critical data."
        })
    });

    test('Invalid Date: Should respond with 400', async () => {
        const response = await request(app)
            .post('/launches')
            .send(invalidDateLaunch)
            .expect('Content-Type', /json/)
            .expect(400)
        expect(response.body).toStrictEqual({
            error: "Invalid Date",
        })
    })

    test('Date Too Soon: Should respond with 400', async () => {
        const response = await request(app)
            .post('/launches')
            .send(badDateLaunch)
            .expect('Content-Type', /json/)
            .expect(400)
        expect(response.body).toStrictEqual({
            error: "Invalid date. Launches need at least 4 days to get set up."
        })
    })
})

describe('Test DELETE /launches', () => {
    const launch = {
        flightNumber: 100,
        launchDate: "12 December 2022",
        mission: "To the Stars",
        rocket: "M143",
        target: "Kepler-234 b",
        customers: ['NASA'],
        upcoming: false,
        success: false,
    }
    
    test('Should respond with 200', async () => {
        const response = await request(app)
            .delete('/launches/100')
            .expect('Content-Type', /json/)
            .expect(200)
        expect(response.body).toStrictEqual(launch)
    })

    test('Should respond with 404 Not Found', async () => {
        const response = await request(app)
            .delete('/launches/999')
            .expect('Content-Type', /json/)
            .expect(404)
        expect(response.body).toStrictEqual({
            error: 'Launch does not exist.'
        })
    })
})

