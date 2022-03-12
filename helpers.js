
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

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
};

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