const express = require('express');
require('./src/db/mongoose');
const path = require('path');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const morgan = require('morgan');
const adminRouter = require('./src/routes/admin');
const shopRouter = require('./src/routes/shop');
const userRouter = require('./src/routes/user');
const orderRouter = require('./src/routes/order');
const authRouter = require('./src/routes/auth');
const errorController = require('./src/controllers/error');

const app = express();
const port = process.env.PORT;

const urlencoded = bodyParser.urlencoded({ extended: false });
const csrfProtection = csrf();

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: process.env.SESSION_COLLECTION
});


const sess = {
  secret: process.env.SESSION_SECRET,
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
};


const staticPath = path.join(__dirname, 'public');
const viewPath = path.join(__dirname, 'src', 'views', 'templates');

app.set('view engine', 'pug');
app.set('views', viewPath);


app.use(express.static(staticPath));

app.use(morgan('dev'));

app.use(urlencoded);
app.use(bodyParser.json());
app.use(session(sess));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ROUTER MIDDLEWARES
app.use('/admin', adminRouter);
app.use(authRouter);
app.use(userRouter);
app.use(shopRouter);
app.use(orderRouter);

// 404 PAGE MIDDLEWARE
app.use('/', errorController.getErrorPage);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 