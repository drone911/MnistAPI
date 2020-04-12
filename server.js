const express = require("express");
const Routes = require("./routes");
let app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", Routes);

app.listen(3000, () => {
  console.log("started server at 3000");
});
