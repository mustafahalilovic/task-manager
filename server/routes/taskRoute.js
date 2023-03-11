const express = require('express');
const route = new express.Router();
const Task = require('../models/task');
const convertDate = require('../utils/dateConverter');

route.post('/task', async (req, res) => {
    const task = new Task(req.body);

    try {

        const saved = await task.save();

        if(!saved){
            return res.status(400).send();
        }

        const newSaved = convertDate(saved);

        res.send(newSaved);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});


route.get('/task', async (req, res) => {
    try {

        const tasks = await Task.find({});

        if(!tasks){
            return res.status(404).send();
        }

        const newTasks = tasks.map((task) => {
            return convertDate(task);
        })

        res.send(newTasks);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/task/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        
        const task = await Task.findById(_id);

        if(!task){
            return res.status(404).send();
        }

        const newTask = convertDate(task);

        res.send(newTask);

    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.delete('/task/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        
        const deleted = await Task.findByIdAndDelete(_id);

        if(!deleted){
            return res.status(404).send();
        }
        
        const allTasks = await Task.find({});

        const newAllTasks = allTasks.map((task) => {
            return convertDate(task);
        });

        res.send(newAllTasks);

    } catch (error) {
        res.status(500).send(error.message);
    }

});

route.patch('/task/:id', async (req, res) => {
    const _id = req.params.id;
    const keys = ['title', 'description', 'due_date', 'asignee'];
    const addedKeys = Object.keys(req.body);

    const match = addedKeys.every((key) => {
        return keys.includes(key);
    });

    if(!match){
        res.status(400).send('Property not found!');
    }

    try {

        /*
        const updated = await Task.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        });*/

        const task = await Task.findById(_id);

        if(!task){
            return res.status(404).send();
        }

        addedKeys.map((key) => {
            task[key] = req.body[key];
        });

        await task.save();

        const newUpdated = convertDate(task);

        res.send(newUpdated);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});

module.exports = route;