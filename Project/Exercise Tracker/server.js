require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const shortId = require('shortid');
const cors = require('cors')
const uri = process.env.MONGO_URI;
const app = express()

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now }
});
const schema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  _id: { type: String, required: true },
  exercise: [exerciseSchema]
});

const User = mongoose.model('User', schema);


function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

app.post('/api/exercise/new-user', (req, res, next) => {
  const new_user = req.body.username;
  if (new_user) {
    User.findOne({ username: new_user }, function(err, data) {
      if (err) next(err);
      if (data !== null) {
        next({ status: 400, message: 'username already exists' });
      } else {
        let user = new User({ username: new_user, _id: shortId.generate() });
        user.save(function(err, data) {
          if (err) {
            next(err);
          }
          res.json({ username: data.username, _id: data._id });
        });
      }
    });
  } else {
    next({ status: 400, message: 'no username given' });
  }
});

app.post('/api/exercise/add', (req, res, next) => {
  console.log('body');
  console.log(req.body);
  let user_id = req.body.userId,
    description = req.body.description,
    duration = req.body.duration,
    date = req.body.date ? new Date(req.body.date) : new Date();

  if (req.body.userId) {
    User.findOne({ _id: user_id }, function(err, data) {
      if (err) {
        next(err);
      }
      if (data === null || data._id !== user_id) {
        next({ status: 400, message: 'no id' });
      } else {
        User.findByIdAndUpdate({ _id: data._id },
          { $push: { exercise: { description, duration, date } } },
          { upsert: true, new: true },
          function(err, data) {
            if (err) {
              next(err);
            }
            if (!data) {
              next({ status: 400, message: 'no valid id' });
            }
            else {
              res.json({
                username: data.username,
                description,
                duration: +duration,
                _id: data._id,
                date: date.toDateString()
              })
            }
          });
      }
    });
  } else { 
    next({ status: 400, message: 'no ID given' }); 
  }

  if (!description) { 
    next({ status: 400, message: 'missing description' }) 
  }
  if (!duration) { 
    next({ status: 400, message: 'missing duration' }) 
  }

});

app.get('/api/exercise/log', (req, res) => {
  User.findOne({ _id: req.query.userId }, (err, data) => {
    if (data === null) {
      res.send({ error: "User not found" });
    } else {
      let exercises = data.exercise;
      const fromDate = new Date(req.query.from);
      const toDate = new Date(req.query.to);
      const limit = Number(req.query.limit);

      if (isValidDate(toDate)) {
        exercises = exercises.filter(item => item.date >= fromDate && item.date <= toDate);
      } else if (isValidDate(fromDate)) {
        exercises = exercises.filter(item => item.date >= fromDate);
      }

      let logs = [];
      for (let i = 0; i < exercises.length; i++) {
        logs.push({
          description: exercises[i].description,
          duration: exercises[i].duration,
          date: exercises[i].date.toDateString(),
        });
      }

      if (!isNaN(limit) && logs.length > limit) {
        logs = logs.slice(0, limit);
      }

      res.send({
        _id: data._id,
        username: data.username,
        count: logs.length,
        log: logs
      });
    }
  });
});

app.get('/api/exercise/users', (req, res) => {
  const logs = { exercise: false };
  User.find({}, logs, (err, data) => {
    if (err) {
      res.send({ error: 'Error users' });
    }
    res.json(data);
  })
});

app.use((req, res, next) => {
  return next({ status: 404, message: 'not found' })
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
