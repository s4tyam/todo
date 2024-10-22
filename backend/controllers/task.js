const Task = require("../models/tasks");

const newTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let userTasks = await Task.findOne({ email: user.email });
    if (!userTasks) {
      userTasks = new Task({
        email: user.email,
        tasks: [],
      });
    }

    const new_task = {
      title: title,
      description: description,
      isCompleted: false,
    };

    userTasks.tasks.push(new_task);
    await userTasks.save();

    return res
      .status(201)
      .json({ message: "Task created successfully", task: new_task });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllTask = async (req, res) => {
  try {
    const user_email = req.user.email;

    const userTask = await Task.findOne({ email: user_email });
    return res.status(200).json({
      success: true,
      tasks: userTask.tasks,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const user = req.user;

    let userTasks = await Task.findOne({ email: user.email });
    if (!userTasks) {
      return res.status(404).json({ success: false, message: "User tasks not found" });
    }

    const taskIndex = userTasks.tasks.findIndex(
      (task) => task._id.toString() === id
    );
    if (taskIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    userTasks.tasks.splice(taskIndex, 1);
    await userTasks.save();

    return res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { newTask, getAllTask, deleteTask};
