const mongoose = require('mongoose');
const request = require('supertest');
const auth = require('../../middleware/auth');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
     });

     afterEach(async () => {
        await User.deleteMany({})
        await Genre.deleteMany({})
        server.close();
    });

    afterAll(() => {
        mongoose.disconnect()
    });

    let token;

    const exec = ()=>{
            
        return request(server)
        .post('/api/genres/')
        .set('x-auth-token',token)
        .send({name: "genreName"});
    }

    it('should return 400 when token is invalid',async () => {
        token = "1";
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 401 when no token is provided', async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return payload when when token is valid', async () => {
        token = new User().genToken();
        const res = await exec();
        expect(res.status).toBe(200);
    });

});