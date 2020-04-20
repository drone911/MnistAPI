const express = require("express");
const Routes = require("./routes");
const path = require('path');

let app = express();
app.set('port', process.env.PORT || 3000)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.static(path.join(__dirname,'static')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", Routes);

app.listen(app.get('port'), () => {
  console.log("started server "+ app.get('port'));
});

