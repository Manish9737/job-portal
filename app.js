const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const app = express();
require("dotenv").config();
const db = require("./DB/conn");
const cors = require('cors');

const port = process.env.PORT || 3000;

// routers
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const companyRouter = require("./routes/company");
const jobsRouter = require("./routes/jobs");
const applicationRouter = require("./routes/applications");
const notificationRouter = require("./routes/notifications");

// view enjine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/jobs", jobsRouter);
app.use("/applications", applicationRouter);
app.use("/notifications", notificationRouter);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // console.error(err.stack);
  if (err.status === 404) {
    res.status(404).send("Not Found");
  } else {
    res.status(500).send("Something went wrong!");
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Server listning on http://localhost:${port}`);
});
