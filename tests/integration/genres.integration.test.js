
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user')
const mongoose = require('mongoose');

let server;


describe('/api/genres', () => {
    beforeEach(() => {
       server = require('../../index');
    });
    afterEach(async () => {
        await Genre.deleteMany({}) //Remove all documents
        await User.deleteMany({})
        server.close();
        
    });

    afterAll(()=>{
        mongoose.disconnect()
    })

    describe('GET /', () => {
        it('should return all genres', async  () => {
            await Genre.collection.insertMany([{name:"genre1"},{name:"genre2"}]);

            const res = await request(server).get('/api/genres')
        expect(res.status).toBe(200)
        expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();

        });    
    });
    describe('GET /:id', () => {
        it('should return 404 when id not found', async () => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404);
        });

        it('should return 404 when valid id but no genre is found', async () => {
            const genre = new Genre({name:"genre1"})//we are not saving it
            const res = await request(server).get('/api/genres/'+ genre._id);
            expect(res.status).toBe(404)
        });

        it('should return genre when asked valid id', async () => {
            const genre = new Genre({name:"genre1"})
            await genre.save()
            const res = await request(server).get('/api/genres/'+ genre._id);
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name',genre.name);
        });

    });

    describe('POST /', () => {

        let token;
        let genreName;
        const exec = async ()=>{
            
            return await request(server)
            .post('/api/genres/')
            .set('x-auth-token',token)
            .send({name: genreName});
        }

        beforeEach(() => {
            token = new User().genToken();
            genreName = "testGenre"
        });

        it('should return 401 when user not logged in', async () => {
            token ='';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 when genre is less than 5 chars', async () => {
            genreName = "1234";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 when genre is more than 50 chars', async () => {
            genreName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return the db entry when success', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            const query = await Genre.findOne({'name':genreName});
            expect(query).toBeTruthy();
            expect(Genre.findById(mongoose.Types.ObjectId(res.body._id))).toBeTruthy();
        });

    });
});