
const winston = require('winston');

module.exports = function(err,req,res,next){
    //log
    winston.error(err.message,err);
      //error
      //warn
      //info
      //debug
      //verbose
      //silly

    res.status(500).send("Internal Server Error.")
  };