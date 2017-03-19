const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to database on ${process.env.DB_URI}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Disconnected from database on ${process.env.DB_URI}`);
});

mongoose.connection.on('error', () => {
  console.log(`Error connecting to database in ${process.env.DB_URI}`);
});


function gracefulShutdown(msg, callback) {
  return new Promise((resolve, reject) => {
    mongoose.connection.close(() => {
      console.log(`Database connecion closed through ${msg}`);
      resolve();
    });
  });
}

process.once('SIGUSR2', () => {
  gracefulShutdown('Nodemon restart')
    .then(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('Application termination')
    .then(() => {
      process.exit(0);
    });
});

process.on('SIGTERM', () => {
  gracefulShutdown('Heroku application restart')
    .then(() => {
      process.exit(0);
    });
});

require('./user');