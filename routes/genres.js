const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const adminMiddleware = require("../middleware/admin");
const asyncCatch = require('../middleware/asyncCatch');
const validID = require('../middleware/validID')

router.get('/',asyncCatch( async (req, res,next) => {
  Genre.find().sort('name')
    .then((r)=>res.send(r))
    .catch((ex)=>next(ex));
}));

router.get('/:id',validID, asyncCatch( async (req, res) => {

  const genre = await Genre.findById(req.params.id);
  if (!genre){
    return res.status(404).send('The genre with the given ID was not found.');
  } 
    return res.send(genre);
  }));


router.post('/',authMiddleware, asyncCatch( async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
}));

router.put('/:id',[authMiddleware,validID], asyncCatch( async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
}));

router.delete('/:id',[authMiddleware,adminMiddleware,validID], asyncCatch(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
}));


module.exports = router;