const mongoose = require("mongoose");
const auth = require("../../../middleware/auth");
const { User } = require("../../../models/user");

describe('auth middleware ', () => {
    it('should populate the req.user with valid token ', () => {
        const user = {_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
        const token = new User(user).genToken();
        const req = {header: jest.fn().mockReturnValue(token)}
        const next = jest.fn();
        const res = {};
        auth(req,res,next)
        expect(req.user).toMatchObject(user);;
    });
});