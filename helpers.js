
// generates a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

// checks if the email and password fields are empty 
const isMissingCredentials = (email, password) => {
  if (!email || !password) {
    return true;
  }
  return false;
};

// validates if email exists in the database
const isValidEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user].email) {
      return true;
    }
  }
  return false;
};

//fetches a user's id by their email
const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
};

// fetches user's urls based on their id (cookie)
const urlsForUser = (id, urlDatabase) => {
  let userURLS = {}
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLS;
}


module.exports = { 
  generateRandomString, 
  isMissingCredentials, 
  isValidEmail, 
  getUserByEmail,
  urlsForUser  
}