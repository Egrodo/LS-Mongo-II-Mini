const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const server = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

// Your API will be built out here.
// ### Todos:
// ### Extra Credit: 
// * lastly write a `PUT` that updates a users `firstName` `lastName` 

// * write a `GET` request to `/users` that simply returns all the people.
server.get(('/users'), (req, res) => {
  Person.find({}, (err, data) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({ error: 'Failed to get people.' });
    }
    res.json(data);
  });
});

// * write a `GET` request to `/users/:direction` that takes the given string and returns back a list of sorted data alphebetically.
//   * hint direction can be `asc` or `desc` so in your `.sort()` method you'll have to conditionally check, and we are going to be sorting by user `firstName`
// Sort in either ascendnig or descending based off the direction.
server.get(('/users/:direction'), (req, res) => {
  const { direction } = req.params;
  Person.find({})
    // Use a promise to sort by alphabetic first name. Either ascending or descending based off URL parameters.
    .sort( {firstName: direction} )
    .exec((err, data) => {
      if (err) {
        res.status(STATUS_SERVER_ERROR);
        res.json({ error: 'Directional get failed.' });
      }
      res.json(data);
    });
});

// * write a `GET` request `/user-get-friends/:id` that returns a single users's friends.
// I want to return the friends of the id user I give.
server.get(('/user-get-friends/:id'), (req, res) => {
  const { id } = req.params;
  Person.findById(id, (err, data) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Failed to find your friend by id.' });
    }
    res.json(data.friends);
  });
});




mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/people',
  { useMongoClient: true }
);
/* eslint no-console: 0 */
connect.then(() => {
  server.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
