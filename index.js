const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("./services/userService");

app.use(cors());
app.use(express.json());

// app.options("*", cors());

app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.use("/api", usersRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
