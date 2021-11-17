
const { User, validate } = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authMiddleware  = require('../middleware/auth');

router.get('/me', authMiddleware ,async(req,res)=>{
    const user = User.findById(req.user._id).select('-password'); //exclude password
    res.send(user);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).send("User already existing");
    }

    user = new User(_.pick(req.body,['name',"email","password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();

    const token = user.genToken();
    
    res.header('x-auth-token',token).send(_.pick(user,['_id','name']));
});

module.exports = router;

