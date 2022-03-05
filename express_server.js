const express = require('express');
const bodyParser = require('body-parser');  // required to make post data request readable
const { redirect } = require('express/lib/response');
const app = express();
const PORT = 8080;  // default port 8080

app.set('view engine', 'ejs');
//will convert request body from a Buffer into a string so it can be read
//It then adds the data tot he req object under the key body
app.use(bodyParser.urlencoded({extended: true}));

// Mock database
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//get route to show the form 
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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




