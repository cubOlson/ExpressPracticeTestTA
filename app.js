/**
 * TODO: Create and configure your Express.js application in here.
 *       You must name the variable that contains your Express.js
 *       application "app" because that is what is exported at the
 *       bottom of the file.
 */


// Your code here
const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const { HairColor, Person } = require('./models');

const csrfProtection = csrf({ cookie: true });
const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const app = express();

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.urlencoded());

app.get('/new-person', csrfProtection, asyncHandler(async(req, res) => {

  const hairColors = await HairColor.findAll();

  res.render('new-person', { token: req.csrfToken(), hairColors });
}));

app.post('/new-person', csrfProtection, asyncHandler(async(req, res) => {

  const { firstName, lastName, age, biography, hairColorId } = req.body;

  const person =  Person.create({
    firstName, lastName, age, biography, hairColorId
  });

  res.redirect('/');
}));

app.get('/', asyncHandler(async(req, res) => {
  const people = await Person.findAll({ include: HairColor});

  res.render('list', { people })
}));



app.listen(8081, () => console.log('We are running'));



/* Do not change this export. The tests depend on it. */
try {
  exports.app = app;
} catch(e) {
  exports.app = null;
}