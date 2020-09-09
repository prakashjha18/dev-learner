const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

//connect to db
connectDB(); 

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);


//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //console.log('dsds');
    // Close server & exit process
    //server.close(() => process.exit(1));
  });
//mongodb://localhost:27017/dev-learn