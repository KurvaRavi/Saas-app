// auth.js

module.exports = {
  checkAuthenticated: function(req, res, next) {
      // Your authentication logic here, e.g., checking if user is logged in
      if (req.isAuthenticated()) {
          return next(); // User is authenticated, proceed to the next middleware/route handler
      }
      // User is not authenticated, redirect to login page or handle as per your app's logic
      res.redirect('/login'); // Adjust the redirection URL as per your application
  },
};
