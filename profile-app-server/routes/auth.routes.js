const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', (req, res, next) => {
  const { username, password, campus, course } = req.body;

  // Check if username or password or campus or course are provided as empty string
  if (username === '' || password === '' || campus === '' || course === '') {
    res
      .status(400)
      .json({ message: 'Provide username, password, campus and course' });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  // Check the users collection if a user with the same username already exists
  User.findOne({ username })
    .then((foundUser) => {
      // If the user with the same username already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      // If username is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({
        username,
        password: hashedPassword,
        campus,
        course,
      });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { username, campus, course, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { username, campus, course, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// POST  /auth/login - Verifies username and password and returns a JWT
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // Check if username or password are provided as empty string
  if (username === '' || password === '') {
    res.status(400).json({ message: 'Provide username and password.' });
    return;
  }

  // Check the users collection if a user with the same username exists
  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, username, campus, course } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, username, campus, course };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '6h',
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: 'Unable to authenticate the user' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'Internal Server Error' }));
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, async (req, res, next) => {
  try {
    // req.payload._id is from your verified JWT
    const fullUser = await User.findById(req.payload._id).select('-password');
    res.status(200).json(fullUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
