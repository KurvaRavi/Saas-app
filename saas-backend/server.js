

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
const User = require('./models/user');
const Plan = require('./models/Plan');
const app = express();
const adminRoutes = require('./routes/admin');
const path = require('path');

// MongoDB connection
connectDB();

app.set('view engine', 'ejs');

// Set the views directory - replace '/path/to/your/views' with your actual path
app.set('views', '/Users/kurva/Downloads/saas-backend/views');
app.use('/admin', adminRoutes);

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
app.use('/admin', adminRoutes);

app.use(cors());
const plans = [
  { id: 1, name: 'Basic Plan', description: 'Limited to 1 user', price: 0 },
  { id: 2, name: 'Standard Plan', description: 'INR 4999 Per Year, Per User, up to 5 users', price:4999 },
  { id: 3, name: 'Plus Plan', description: 'INR 3999 Per Year, Per User above 10 users', price:3900 }
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

// app.get('/register', checkAuthenticated, (req, res) => {
//   res.render('register.ejs');
// });

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
      res.render('superadmin_dashboard.ejs', { user: req.user, plans: plans });
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

// PUT request to update a plan
app.put('/superadmin/plans/:id', checkAuthenticated, (req, res) => {
  if (req.user.role === 'superadmin') {
    const planId = parseInt(req.params.id);
    const { name, description, price } = req.body;

    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex !== -1) {
      plans[planIndex] = { id: planId, name, description, price };
      res.status(200).json({ message: 'Plan updated successfully' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// DELETE request to delete a plan
app.delete('/superadmin/plans/:id', checkAuthenticated, (req, res) => {
  if (req.user.role === 'superadmin') {
    const planId = parseInt(req.params.id);
    const planIndex = plans.findIndex(p => p.id === planId);

    if (planIndex !== -1) {
      plans.splice(planIndex, 1);
      res.status(200).json({ message: 'Plan deleted successfully' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// POST request to add a new plan
app.post('/superadmin/plans', checkAuthenticated, (req, res) => {
  if (req.user.role === 'superadmin') {
    const { name, description, price } = req.body;
    const newPlan = { id: plans.length + 1, name, description, price };
    plans.push(newPlan);
    res.status(201).json({ message: 'Plan added successfully' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});


const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  
