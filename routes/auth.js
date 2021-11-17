const jwt = require('jsonwebtoken')
const config = require('config')
const { User} = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi')

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send("Wrong password or username");
    }

    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
        return res.status(400).send("Wrong password or username");
    }

    const token = user.genToken() 
    
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
  }

module.exports = router;