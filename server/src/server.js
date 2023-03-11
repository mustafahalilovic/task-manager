const express = require('express');
const cors = require('cors');
const employeeRoute = require('../routes/employeeRoute');
const taskRoute = require('../routes/taskRoute');
const app = express();
require('dotenv').config({path: '../vars/.env'});
require('../database/dbSetup');



// middleware functions
app.use(cors());
app.use(express.json());

// routes
app.use(employeeRoute);
app.use(taskRoute);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () =>{
    console.log(`Server started at port: ${PORT}`);
});
