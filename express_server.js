const express = require('express');
const bodyParser = require('body-parser');  // required to make post data request readable
const { redirect } = require('express/lib/response');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;  // default port 8080

app.set('view engine', 'ejs');

//will convert request body from a Buffer into a string so it can be human readable
//It then adds the data to the req object under the key body
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// Mock database
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//ROUTE HANDLERS

//Root
app.get('/', (req, res) => {
  res.cookie(username, req.body.username);
  console.log(res.cookie);
  res.send('Hello!');
});

<<<<<<< HEAD

//Render index
=======
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//render index
>>>>>>> feature/cookies
app.get('/urls', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//Render form 
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render('urls_new', templateVars);
});

//Displays longURL and shortURL 
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = () => {
  // const chars = 'ABCDEFGHIJKLMNOPQRSTYUVWXYZ0123456789abcdefghijklmnopqrstuvxyz';
  // let randomString = '';
  // for (let i = 0; i < 6; i++) {
  //   randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  // }
  // return randomString;
  return Math.random().toString(36).substring(2,8);
}




