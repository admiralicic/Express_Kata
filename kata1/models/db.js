const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to the database`);
});

mongoose.connection.on('error', () => {
  console.log(`Error connecting to the database on ${process.env.DB_URI}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from the database');
});

function gracefulShutdown(msg) {
  return new Promise((resolve, reject) => {
    mongoose.connection.close().then(() => {
      console.log(`Database connection closed due to ${msg}`);
      resolve();
    });
  });
}

process.once('SIGUSR2', () => {
  gracefulShutdown('Nodemon restart').then(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('application shutdown').then(() => {
    process.exit(0); 
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('Heroku restart').then(() => {
    process.exit(0);
  });
});

require('./user');