const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const app = express();


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
   cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax',             // important for cross-site cookies
    secure: false}
}));
// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected (Frontend)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Home Page Route
app.get('/', (req, res) => {
  res.render('home', { session: req.session });
});


// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/parcels', require('./routes/parcelRoutes'));
app.use(express.static(path.join(__dirname, 'public')));

// Default Error Page 404
app.use((req, res) => {
  res.status(404).render('error', { message: "Page Not Found(404)" });
});
// Optional: 500 Handler (Server Error)
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).render('error', { message: "Internal Server Error (500)" });
});
// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
