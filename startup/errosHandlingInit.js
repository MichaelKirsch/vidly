const winston = require('winston');
const config = require('config')

module.exports = function () {
    winston.add(new winston.transports.File({ filename: "logfile.log" }))
    //winston.add(new winston.transports.Console());
    winston.info('App started');

    //log everything that failed directly to the file
    process.on('uncaughtException', (ex) => {
        console.log('Uncaught Exception!! See logfile for more info')
        winston.error(ex.message, ex);
        process.exit(1);
    })
    process.on("unhandledRejection", (ex) => {
        console.log('Unhandled Promise Rejection!! See logfile for more info')
        winston.error(ex.message, ex);
        process.exit(1);
    })

    if (!config.get('jwtPrivateKey')) {
        console.log('Fatal error. private key is fucked')
        process.exit(1);
    }
}