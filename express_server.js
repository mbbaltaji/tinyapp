const express = require('express');
const bodyParser = require('body-parser');  // required to make POST data request human readable
const morgan = require('morgan'); //console logs GET, POST details
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');



const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['MOOSE'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Mock url database
const urlDatabase = {
  b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
        userID: "aJ48lW"
    },
  sm5xK: {
        longURL: "http://www.google.com",
        userID: "aJ48lW"
    }
};

// Mock user database
const users = {
  '123':{
    id: '123',
    email: 'moose@example.com',
    password: bcrypt.hashSync("asd123", 10)
  },
  '456':{
    id: '456',
    email: 'markie@example.com',
    password: bcrypt.hashSync("asd456", 10)
  }
};

//ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  res.render('urls_index', templateVars);
});


app.get('/urls/new', (req, res) => {
  let session = req.session.user_id;
  
  const templateVars = {
    user: users[session]
  };
  if (session){
  res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
  let session = req.session.user_id;
  const templateVars = {
    user: users[session],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    urlUserID: urlDatabase[req.params.shortURL].userID
  };
  res.render('urls_show', templateVars);
} else {
  res.status(404).send('The short URL entered does not exist');
}
});

app.post('/urls', (req, res) => {
  let session = req.session.user_id;
  if(session) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = { 
      longURL: req.body.longURL,
      userID: session 
    }
    //console.log(urlDatabase);
    res.redirect(`/urls/${shortURL}`);
  } else {
    return res.status(401).send('Unauthorized. Please login first.');
  }
});

app.get('/u/:shortURL', (req, res) => {
  let validUrlId = urlDatabase[req.params.shortURL]
  if (validUrlId) {
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  } else {
    return res.status(404).send('Page NOT found. Wrong id in /u/:id');
  }
  
});


app.post('/urls/:shortURL/delete', (req, res) => {
  const session = req.session.user_id;
  const userURLs = urlsForUser(session);

  for (const url in userURLs) {
    if (url === req.params.shortURL) {
      delete urlDatabase[req.params.shortURL];
      return res.redirect('/urls');
    } 
  }
    res.status(401).send('You are unauthorized to delete this url');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL]['longURL'] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) =>{
  res.render('registration');
});

app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let newUserId = generateRandomString().substring(2,5);

  if (isMissingCredentials(email, password)) {
    return res.status(400).send('Missing email or password');
  }

  if (isValidEmail(email, users)) {
    return res.status(400).send('Email already exists!');
  }

  users[newUserId] = {
    id: newUserId,
    email: req.body.email,
    password: bcrypt.hashSync(password, 10)
  };

  req.session.user_id = newUserId;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = findIdByEmail(email);

  if (!isValidEmail(email, users)) {
    return res.status(403).send('Invalid email.. User does not exist!');
  }
  if (!bcrypt.compareSync(password, users[id].password)) {
    return res.status(403).send('Wrong password!');
  }

  
  req.session.user_id = id;
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

const findIdByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      console.log(users[user]);
      return users[user].id;
    }
  }
};

const urlsForUser = (id) => {
  let userURLS = {}
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLS;
}

//findUserByID