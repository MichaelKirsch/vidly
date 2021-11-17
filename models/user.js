const { response } = require('express');
const Joi = require('joi');
const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const config = require('config');
const string = require('joi/lib/types/string');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlenght:255,
    minlength:5,
    required: true,
  },
  email:{
      type: String,
      required:true,
      maxlenght:255,
      minlength:5,
      unique:true,
  },
  password:{
      type:String,
      maxlenght:1024,
      minlength:5,
      required:true,
  },
  isAdmin: Boolean,
  roles: [String],
  operations:[String]
});

userSchema.methods.genToken = function () {
  return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey')); //this needs to be a environment var
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required(),
    name: Joi.string().min(5).max(255).required()
  });
  return schema.validate(user);
}

exports.userSchema = userSchema;
exports.User = User; 
exports.validate = validateUser;