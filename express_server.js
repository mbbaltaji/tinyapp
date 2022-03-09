const express = require('express');
const bodyParser = require('body-parser');  // required to make post data request readable
const { redirect } = require('express/lib/response');
const morgan = require('morgan'); //console logs GET, POST details
const cookieParser = require('cookie-parser');  

const app = express();
const PORT = 8080;  // default port 8080

app.set('view engine', 'ejs'); 

//will convert request body from a Buffer into a string so it can be read
//It then adds the data tot he req object under the key body
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
}

//ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send('Hello!');
});

//render index
app.get('/urls', (req, res) => {
  let id = req.cookies["user_id"];
  const templateVars = {
    user: users[id],
    urls: urlDatabase 
  };
  console.log(templateVars);
  console.log(users);
  res.render('urls_index', templateVars);
});

//get route to show the form 
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"]
  }
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

// user will be redirected to urls/:shortURL when submit is clicked
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// redirect to long URL of short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//delete URL entry -> redirect to /urls
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//edit long URL -> redirect to /urls
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});


app.post('/login', (req, res) => {
  res.cookie('user_id', req.body.user_id);
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
  console.log(req.body.email);
  let id = generateRandomString().substring(2,5);
  if (isMissingCredentials(email, password)){
    res.status(400).send('Missing email or password');
  }

  if(isValidEmail(email, users)){
    res.status(400).send('Email already exists!');
  }
  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', id);
  // console.log('cookies: ', req.cookies);
  // console.log('users: ', users);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// helper functions 
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
}

const isMissingCredentials = (email, password, users ) => {
  if(!email || !password){
    return true;
  }
}

const isValidEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user].email) {
      return true;
    }
  }
  return false;
}

