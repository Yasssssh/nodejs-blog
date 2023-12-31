require("dotenv").config();
const express = require("express");

const ejs = require("ejs");
const expresslayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");

const app = express();

//connect to db
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie: {maxAge: new Date (Date.now() + (3600000))}
  })
);

//templates
app.use(expresslayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main.js"));
app.use("/", require("./server/routes/admin.js"));

app.listen(3000 || process.env.PORT, () => {
  console.log(`listening on port `, process.env.PORT);
});
