const express = require("express")
const app = express();
require("dotenv").config();
const cookie_parser = require("cookie-parser")
const userRouter = require("./routes/user")
const taskRouter = require("./routes/task")
const cors = require("cors")

const db = require("./db")
db();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);
app.use(express.json())
app.use(cookie_parser())

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res) => {
    res.send("<h1>Nice working</h1>");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`)
})