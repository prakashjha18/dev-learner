const path = require('path');
const fileupload = require('express-fileupload');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

//connect to db
connectDB(); 

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

//Body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//file uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname,'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

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