var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// --> 7)  Mount the Logger middleware here
app.use(function middleware(req, res, next){
    var string = req.method + ' ' + req.path + ' - ' + req.ip;
    console.log(string);
    next();
})

// --> 11)  Mount the body-parser middleware  here
app.use(bodyParser.urlencoded({ extended: false}));

/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
// app.get('/', function(req, res){
//     res.send("Hello Express")
// })

/** 3) Serve an HTML file */
app.get('/', function(req, res){
    res.sendFile(__dirname + "/views/index.html")
})

/** 4) Serve static assets  */
var path = __dirname + "/public/"
var middleware = express.static(path)
app.use(middleware)

/** 5) serve JSON on a specific route */
app.get("/json", function(req, res){
    res.json({"message": "Hello json"})
})

/** 6) Use the .env file to configure the app */
app.get("/json", function(req, res){
    var json = {"message": "Hello json"};

    if(process.env.MESSAGE_STYLE === "uppercase")
        json.message = json.message.toUpperCase()
    res.json(json)
})

/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */
//using a middleware to /now route to respond with req.time
app.get('/now', function(req, res, next){
    req.time = new Date().toString();
    next();
}, function(req, res){
    res.json({time: req.time});
})

/** 9)  Get input from client - Route parameters */
app.get('/:word/echo', function(req, res){
    let word = req.params.word;
    res.json({echo: word})
})

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
app.get("/name", function(req, res){
    let firstname = req.query.first
    let lastname = req.query.last
    res.json({name: firstname + " " +lastname})
})

/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */
app.post("/name", function(req, res){
    let firstname = req.body.first
    let lastname = req.body.last
    res.json({name: firstname + " " +lastname})
})


// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

module.exports = app;
