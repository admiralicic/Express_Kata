var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', function () {
    console.log('Connected to database on ' + process.env.DB_URI);
});

mongoose.connection.on('error', function () {
    console.log('Error connecting to database on ' + process.env.DB_URI);
});

mongoose.connection.on('disconnected', function () {
    console.log('Disconneced from the database');
});


function gracefullShutdown(msg, callback) {
    mongoose.connection.close(function () {
        console.log('Connection to database closed due to ' + msg);
        callback();
    });
}

process.once('SIGUSR2', function () {
    gracefullShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function () {
    gracefullShutdown('app termination', function () {
        process.exit(0);
    });
});

process.on('SIGTERM', function () {
    gracefullShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./user');



