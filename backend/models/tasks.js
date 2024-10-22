const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const userTaskSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    tasks: [taskSchema]
})

const Task = mongoose.model("Task", userTaskSchema);
module.exports = Task;