const express = require('express');
require('./src/db/mongoose');
const path = require('path');
const fs = require('fs');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const morgan = require('morgan');
const adminRouter = require('./src/routes/admin');
const shopRouter = require('./src/routes/shop');
const userRouter = require('./src/routes/user');
const orderRouter = require('./src/routes/order');
const authRouter = require('./src/routes/auth');
const error404Controller = require('./src/controllers/404');
const error500Controller = require('./src/controllers/500');

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
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

// Multer image storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const imagePath = path.join(__dirname, 'images');
    if (!fs.existsSync(imagePath)) {
      fs.mkdir(imagePath, () => {
        cb(null, 'images');
      });
    } else {
      cb(null, 'images');
    }
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

const staticPath = path.join(__dirname, 'public');
const imgPath = path.join(__dirname, 'images');
const viewPath = path.join(__dirname, 'src', 'views', 'templates');

app.set('view engine', 'pug');
app.set('views', viewPath);

app.use(express.static(staticPath));
app.use('/images', express.static(imgPath));

app.use(morgan('dev'));

app.use(urlencoded);
app.use(bodyParser.json());
app.use(multer({
  storage,
  fileFilter(req, file, cb) {
    if (!/\.(jpe?g|png|gif)$/i.test(file.originalname)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 1000000 // 1 megabyte
  }
}).single('productImage'));
app.use(session(sess));
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ROUTER MIDDLEWARES
app.use(adminRouter);
app.use(authRouter);
app.use(userRouter);
app.use(shopRouter);
app.use(orderRouter);

// 404 PAGE MIDDLEWARE
app.use(error404Controller.get404Page);
// 500 PAGE MIDDLEWARE
app.use(error500Controller.get500Page);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
