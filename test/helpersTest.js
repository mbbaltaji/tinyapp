const { assert } = require('chai');
const { it } = require('mocha');

const { getUserByEmail, isMissingCredentials, isValidEmail, urlsForUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

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

describe('#getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });
  it('should return undefined for non-existent email', () =>{
    const user = getUserByEmail('',undefined);
    assert.strictEqual(user, undefined);
  });
});

describe('#isMissingCredentials', () => {
  it('should return true if email is missing', () => {
    const missingEmail = isMissingCredentials('','asd123');
    const expectedOutput = true;
    assert.strictEqual(missingEmail,expectedOutput);
    });
  it('should return true if password is missing', () => {
    const missingPassword = isMissingCredentials('abc@gmail.com','');
    const expectedOutput = true;
    assert.strictEqual(missingPassword,expectedOutput);
    });
  it('should return false if email and password is not missing', () => {
    const validInput = isMissingCredentials('abc@gmail.com','abc123');
    const expectedOutput = false;
    assert.strictEqual(validInput,expectedOutput);
    });
  });

describe('#isValidEmail', () =>{
  it('should return true if email is valid', () => {
    const validEmail = isValidEmail("user@example.com",testUsers);
    const expectedOutput = true;
    assert.strictEqual(validEmail,expectedOutput);
  });
  it('should return false if email is invalid', () => {
    const validEmail = isValidEmail("asfgs@example.com",testUsers);
    const expectedOutput = false;
    assert.strictEqual(validEmail,expectedOutput);
  });
});

describe('#urlsForUser', () =>{
  it('should return user\'s urls given a valid id', () =>{
    const id = "aJ48lW";
    const expectedOutput = {
      b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
        userID: "aJ48lW"
      },
      sm5xK: {
        longURL: "http://www.google.com",
        userID: "aJ48lW"
      }
    }
    const res = urlsForUser(id,urlDatabase);
    assert.deepEqual(res,expectedOutput);
  });

  it('should return empty object if URLs don\'t exist for a given id', () => {
    const invalidID = urlsForUser('123', urlDatabase);
    const expectedOutput = {}
    assert.deepEqual(invalidID, expectedOutput);
  });
});


