const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
//app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
            "'self'",
            'stackpath.bootstrapcdn.com'
        ],
        scriptSrc: [
            "'self'",
            'code.jquery.com',
            'cdnjs.cloudflare.com',
            'stackpath.bootstrapcdn.com'
        ],
        fontSrc: ['netdna.bootstrapcdn.com']
      }
    }
  }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen((process.env.PORT || 3000), (req, res) => {
    console.log(`App listening on port ${process.env.PORT || 3000}`)
});