const express = require('express');
const axios = require('axios'); // Required for Tasks 10-13
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let userExists = users.filter((user) => user.username === username);
    if (userExists.length > 0) {
      return res.status(400).json({message: "User already exists!"});
    } else {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Username and password are required."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
  } else {
      return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);

  if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
  } else {
      return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});


// =========================================================================
// TASKS 10-13: AXIOS & PROMISES IMPLEMENTATION
// (These satisfy the requirement to use async/await and promises with Axios)
// =========================================================================

// Task 10: Get all books using async/await with Axios
const getBooksAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Task 10 - All Books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error);
    }
};

// Task 11: Search by ISBN using Promises with Axios
const getBookByISBNAxios = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Task 11 - Book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error);
        });
};

// Task 12: Search by Author using async/await with Axios
const getBooksByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Task 12 - Books by ${author}:`, response.data);
    } catch (error) {
        console.error("Error fetching books by author:", error);
    }
};

// Task 13: Search by Title using Promises with Axios
const getBooksByTitleAxios = (title) => {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Task 13 - Books with title ${title}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching books by title:", error);
        });
};

module.exports.general = public_users;
