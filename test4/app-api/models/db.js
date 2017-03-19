const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to database on ${process.env.DB_URI}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Disconnected from database on ${process.env.DB_URI}`);
});

mongoose.connection.on('error', () => {
  console.log(`Error connecting to database on ${process.env.DB_URI}`);
});

function gracefulShutdown(msg) {
  return new Promise((resolve, reject) => {
    mongoose.connection.close(() => {
      console.log(`Database connection closed through ${msg}`);
      return resolve(true);
    });
  });
}

process.once('SIGUSR2', () => {
  gracefulShutdown('Nodemon restart').then(() => {
    process.kill(process.pid, 'SIGUSR2');
  }).catch((err) => {
    console.log('Error: ' + err.message);
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('application termination').then(() => {
    process.exit(0); 
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('Heroku restart').then(() => {
    process.exit(0); 
  });
});

require('./user');