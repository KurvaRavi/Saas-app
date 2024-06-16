

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const User = require('./models/User');
const Plan = require('./models/Plan');
const app = express();

// MongoDB connection
connectDB();

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  async email => {
    const user = await User.findOne({ email });
    return user;
  },
  async id => {
    const user = await User.findById(id);
    return user;
  }
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.set('view-engine', 'ejs');

const plans = [
  { id: 1, name: 'Basic Plan', description: 'Limited to 1 user', price: 'Free for 14 days' },
  { id: 2, name: 'Standard Plan', description: 'INR 4999 Per Year, Per User, up to 5 users' },
  { id: 3, name: 'Plus Plan', description: 'INR 3999 Per Year, Per User above 10 users' }
];

// Endpoint to fetch plans
app.get('/plans', (req, res) => {
  res.json({ plans });
});

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { name: req.user.name });
}
);

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', (req, res) => {
  // Clear session or token (example for Express.js session)
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      // Redirect to login page
      res.redirect('/login');
    }
  });
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    res.redirect('/register');
  }
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
  console.log(req.user.role)
  // Role-based redirection
  switch (req.user.role) {
    case 'admin':
      res.render('admin_dashboard.ejs', { user: req.user });
      break;
    case 'superadmin':
      res.render('superadmin_dashboard.ejs', { user: req.user });
      break;
    default:
      res.render('user_dashboard.ejs', { user: req.user });
  }
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  
