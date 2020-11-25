// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/timestamp", function (req, res) {
  res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/timestamp/:date", function (req, res) {
  let dateString = req.params.date
  //5 digits or more must be a unix time, until we reach a year 10,000 
  if(/\d{5,}/.test(dateString)) {
    let dateInteger = parseInt(dateString);
    res.json({unix: dateString, utc: new Date(dateInteger).toUTCString()});
  }
  let dateObj = new Date(dateString);
  if(dateObj.toString() === 'Invalid Date'){
    res.json({error: 'Invalid Date'});
  } else{
    res.json({ unix: dateObj.valueOf(), utc: dateObj.toUTCString() });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});