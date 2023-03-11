const express = require('express');
const route = new express.Router();
const Employee = require('../models/employee');

route.post('/employee', async (req, res) => {
    const employee = new Employee(req.body);

    try {
        
        const saved = await employee.save();

        if(!saved){
            return res.status(500).send('Problem with saving user.');
        }

        const token = await saved.generateAuthToken();

        res.status(201).send({
            saved,
            token
        });

    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.post('/employee/login', async (req, res) => {
    try {
        
        const employee = await Employee.findByCredentials(req.body);

        if(!employee){
            return res.status(400).send();
        }

        const token = await employee.generateAuthToken();

        res.send({
            employee,
            token
        });

    } catch (error) {
        res.status(400).send(error.message);
    }

});


route.get('/employee', async (req, res) => {

    try {

        const empoyees = await Employee.find({});

        if(!empoyees){
            return res.status(404).send();
        }

        res.send(empoyees);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.get('/employee/:id', async (req, res) => {
    const _id = req.params.id;

    try {

        const employee = await Employee.findById(_id);

        if(!employee){
            return res.status(404).send();
        }

        res.send(employee);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.delete('/employee/:id', async (req, res) => {
    const _id = req.params.id;

    try {

        const deleted = await Employee.findByIdAndDelete(_id);

        if(!deleted){
            return res.status(404).send();
        }

        res.send(deleted);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.patch('/employee/:id', async (req, res) => {
    const _id = req.params.id;
    const propertys = ['name', 'email', 'password', 'phone_number', 'birthday', 'monthly_salary'];
    const protpertysToChange = Object.keys(req.body);

    const valid = protpertysToChange.every((property) => {
        return propertys.includes(property);
    });

    if(!valid){
        return res.status(400).send('Property not defined!');
    }

    try {

        /* Bypasses mongoose middleware functions
        const employee = await Employee.findByIdAndUpdate(_id, req.body, {
            new: true, 
            runValidators: true
        });
        */
        const employee = await Employee.findById(_id);

        if(!employee){
            return res.status(404).send();
        }

        protpertysToChange.map((property) => {
            employee[property] = req.body[property];
        })

        await employee.save();

        res.send(employee);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});

module.exports = route;