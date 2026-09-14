const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Filter the users array to check if the username already exists
  let userwithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userwithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  // Check if there is a matching username and password in the users array
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
  }

  if (authenticatedUser(username, password)) {
      // Generate JWT token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store token and username in the session
      req.session.authorization = {
          accessToken, 
          username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  // Assuming the review is passed as a query parameter (e.g., ?review=great_book)
  const review = req.query.review || req.body.review; 
  // Extract the username from the active session
  const username = req.session.authorization.username;

  if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
  }

  if (!review) {
      return res.status(400).json({message: "Review content is required"});
  }

  // Add or overwrite the review for this specific user
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({
      message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

