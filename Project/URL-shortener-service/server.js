require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const shortId = require('shortid');
const bodyParser = require('body-parser');
const uri = process.env.MONGO_URI;
const app = express();
const dns = require('dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
options.all = true;
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Create Schema
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: String
})
const URL = mongoose.model("URL", urlSchema);
let urlExtractor = function(url) {
  let urlSplit;
  if (url.indexOf("https") > -1) {
    urlSplit = url.split("https://");
  } else if (url.indexOf("http") > -1) {
    urlSplit = url.split("http://");
  }
  if (urlSplit === undefined) {
    return urlSplit;
  } else {
    return urlSplit[1].split("/")[0];
  }
};
app.post('/api/shorturl/new', async function(req, res) {

  const url = req.body.url
  const urlCode = shortId.generate()

  let testURL = req.body.url;
  testURL = urlExtractor(testURL);

  if (testURL) {
    dns.resolve(testURL, async (err, address, family) => {
      if (err) {
        res.json({ error: 'invalid URL' });
      } else {
        try {
          // check if its already in the database
          let findOne = await URL.findOne({
            original_url: url
          })
          if (findOne) {
            res.json({
              original_url: findOne.original_url,
              short_url: findOne.short_url
            })
          } else {
            // if its not exist yet then create new one and response with the result
            findOne = new URL({
              original_url: url,
              short_url: urlCode
            })
            await findOne.save()
            res.json({
              original_url: findOne.original_url,
              short_url: findOne.short_url
            })
          }
        } catch (err) {
          console.error(err)
          res.status(500).json('Server erorr...')
        }
      }
    });
  } else {
    res.json({ error: 'invalid URL' });
  }

});

app.get('/api/shorturl/:short_url?', async function(req, res) {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url
    })
    if (urlParams) {
      return res.redirect(urlParams.original_url)
    } else {
      return res.status(404).json('No URL found')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json('Server error')
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

