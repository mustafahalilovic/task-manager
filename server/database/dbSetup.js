const mongoose = require('mongoose');
require('dotenv').config({path: '../vars/.env'});

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true
}).catch((error)=>{
    throw new Error('Problem with connecting to database.');
});