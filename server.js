// Student Exercises: Safe Entry

// Create a new DB
// Create an express / handlebars / node.js / mysql app
// Entry: The page will allow users to input an entry into the database with their name/phone number/message
// Valiate the name so it's only strings
// Valiate the phone number so it's only numbers
// Valiate the message so it's min of 5 characters in length and 500 character at max
// If all the input checks out save it to the database
// Else render to a fail page to tell the user what they entered didn't work

var express = require('express');
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var sequelize = new Sequelize('safe_entry_db', 'root');

var PORT = process.env.NODE_ENV || 3000;

var app = express();

var Note = sequelize.define('Note', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: {
        args: [1, 10],
        msg: "Please enter a title that isn't TOO long"
      }
    }
  },
  body: {
    type: Sequelize.TEXT,
    validate: {
      check: function(bodyVal) {
        if(bodyVal === "jimmy") {
          throw new Error("Nobody likes jimmy");
        }
      }
    }
  }
});

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));


app.get('/', function(req, res) {
  Note.findAll().then(function(notes) {
    res.render('home', {
      notes: notes
    });
  });
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Listening on %s ', PORT);
  });
});