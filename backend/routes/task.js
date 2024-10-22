const exoress = require("express");
const Protect = require("../middlewears/auth");
const { newTask, getAllTask, deleteTask } = require("../controllers/task");

const router = exoress.Router();

router.route("/new").post(Protect, newTask)
router.route("/all").get(Protect, getAllTask)
router.route("/:id").delete(Protect, deleteTask)


module.exports = router;