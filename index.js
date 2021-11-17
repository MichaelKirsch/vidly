const express = require('express');
const app = express();
//set routes
require('./startup/routes')(app);
//setup logging and error handling (will terminate the process at uncaught stuff)
require('./startup/errosHandlingInit')();
//connect to database
require ('./startup/databaseInit')();
//start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));