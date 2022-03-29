const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect
} = require('../../services/mongo');

describe('Launches API', () => {
    
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
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
    
        const invalidPlanetLaunch = {
            launchDate: "12 December 2023",
            mission: "To the Stars",
            rocket: "M143",
            target: "Kepler-45 b",
        }
        
        test('Should respond with 201 Created', async ()=> {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunch)
                .expect('Content-Type', /json/)
                .expect(201);
            const requestDate = new Date(completeLaunch.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchWithoutDate);
        });
    
        test('Missing Data: Should respond with 400', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(incompleteLaunch)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: "Missing mission critical data."
            })
        });
    
        test('Invalid Date: Should respond with 400', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(invalidDateLaunch)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: "Invalid Date",
            })
        })
    
        test('Date Too Soon: Should respond with 400', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(badDateLaunch)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: "Invalid date. Launches need at least 4 days to get set up."
            })
        })
    
        test('Invalid Planet: Should respond with 400', async () => {
            const response = await request(app)
                .post('/v1/launches')    
                .send(invalidPlanetLaunch)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: "This planet is not a valid exoplanet."
            })
        })
    })
    
    // describe('Test DELETE /launches', () => {
    //     test('Launch Doesn\'t Exist: Should respond with 404 Not Found', async () => {
    //         const response = await request(app)
    //             .delete('/v1/launches/999')
    //             .expect('Content-Type', /json/)
    //             .expect(404)
    //         expect(response.body).toStrictEqual({
    //             error: 'Launch does not exist.'
    //         })
    //     })

    //     test('Launch Aborted Successfully: Should respond with 200', async () => {
    //         const response = await request(app)
    //             .delete('/v1/launches/105')
    //             .expect('Content-Type', /json/)
    //             .expect(200)
    //         expect(response.body).toStrictEqual({
    //             message: "Launch aborted successfully."
    //         })
    //     })

    //     test('Launch Not Aborted: Should respond with 200', async () => {
    //         const response = await request(app)
    //             .delete('/v1/launches/105')
    //             .expect('Content-Type', /json/)
    //             .expect(200)
    //         expect(response.body).toStrictEqual({
    //             error: "Launch already aborted."
    //         })
    //     })
    
        
    // })

})



