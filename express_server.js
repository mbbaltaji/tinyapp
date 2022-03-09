const express = require('express');
const bodyParser = require('body-parser');  // required to make POST data request human readable
const morgan = require('morgan'); //console logs GET, POST details
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

// Mock url database
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Mock user database
const users = {
  '123':{
    id: '123',
    email: 'moose@example.com',
    password: 'asd123'
  },
  '456':{
    id: '456',
    email: 'markie@example.com',
    password: 'asd456'
  }
};

//ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  let id = req.cookies["user_id"];
  const templateVars = {
    user: users[id],
    urls: urlDatabase
  };

  res.render('urls_index', templateVars);
});


app.get('/urls/new', (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    user: users[id]
  };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/register', (req, res) =>{
  res.render('registration');
});

app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = generateRandomString().substring(2,5);

  if (isMissingCredentials(email, password)) {
    return res.status(400).send('Missing email or password');
  }

  if (isValidEmail(email, users)) {
    return res.status(400).send('Email already exists!');
  }

  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password
  };

  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!isValidEmail(email, users)) {
    return res.status(403).send('Invalid email.. User does not exist!');
  }
  if (!isValidPassword(password, email)) {
    return res.status(403).send('Wrong password!');
  }

  let id = findIdByEmail(email);
  res.cookie('user_id', id);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// helper functions
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

const isMissingCredentials = (email, password) => {
  if (!email || !password) {
    return true;
  }
};

const isValidEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user].email) {
      return true;
    }
  }
  return false;
};

const isValidPassword = (password, email) => {
  for (const user in users) {
    if (users[user].email === email && users[user].password === password) {
      return true;
    }
  }
  return false;
};

const findIdByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      console.log(users[user]);
      return users[user].id;
    }
  }
};