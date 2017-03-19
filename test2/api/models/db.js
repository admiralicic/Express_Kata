const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to database on ${process.env.DB_URI}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(`Disconnected from the database ${process.env.DB_URI}`);
});

mongoose.connection.on('error', () => {
    console.log(`Error connecting to ${process.env.DB_UIR}`);
});

function gracefulShutdown(msg) {
    return new Promise((resolve, reject) => {
        mongoose.connection.close(() => {
            console.log(`Database connection closed through ${msg}`);
            resolve();
        });
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart')
        .then(() => {
            process.kill(process.pid, 'SIGUSR2');
        });
});


process.on('SIGINT', () => {
    gracefulShutdown('application termination')
        .then(() => {
            process.exit(0);
        });
});


process.on('SIGTERM', () => {
    gracefulShutdown('Heroku restart')
        .then(() => {
            process.exit(0);
        });
});

require('./user');