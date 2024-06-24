const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as per your file structure

router.get('/register_user', (req, res) => {
    res.render('register_user'); // Render register_user.ejs
});

// router.get('/registration_success', (req, res) => {
//     res.render('registration_sucess'); // Render register_user.ejs
// });
// POST route for user registration form submission
router.post('/register_user', (req, res) => {
    console.log(req.body); // Output req.body to console

    // Attempt to destructure properties from req.body
    const { username, password, role } = req.body;

    // Check if username, password, and role are defined
    if (!username || !password || !role) {
        return res.status(400).send('Missing username, password, or role');
    }

    // Create a new instance of User model
    const newUser = new User({
        username,
        password,
        role
    });

    // Save user to database
    newUser.save()
        .then(() => {
            console.log(`User registered: ${username}, Role: ${role}`);
            res.render('registration_success', { username });
        })
        .catch(err => {
            console.error('Error registering user:', err);
            // Handle error, possibly redirect to an error page or render a specific view
            res.status(500).send('Error registering user. Please try again later.');
        });
});

// Other routes...

module.exports = router;


