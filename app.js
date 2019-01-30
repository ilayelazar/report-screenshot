const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const exphbs = require("express-handlebars");
const pup = require("./puppeteer.js");
const bodyParser = require("body-parser");

//open form page
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("contact");
});
//start server
app.listen(port, () => console.log(`server listening on port ${port}`));

app.post("/send", (req, res) => {
  console.log(req.body);
  pup.takeSS(req.body.email);
  return res.redirect("/success");
});

app.get("/success", (req, res) => {
  res.render("success");
});
