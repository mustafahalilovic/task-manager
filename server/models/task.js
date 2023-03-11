const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    asignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    due_date: {
        type: Date,
        required: true
    }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;