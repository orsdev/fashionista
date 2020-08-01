const express = require('express');
require('./src/db/mongoose');
const path = require('path');
const adminRouter = require('./src/routes/admin');
const shopRouter = require('./src/routes/shop');
const userRouter = require('./src/routes/user');
const errorController = require('./src/controllers/error');

const app = express();
const port = process.env.PORT;

const staticPath = path.join(__dirname, 'public');
const viewPath = path.join(__dirname, 'src', 'views', 'templates');

app.set('view engine', 'pug');
app.set('views', viewPath);

app.use(express.static(staticPath));

// ROUTER MIDDLEWARES
app.use('/admin', adminRouter);
app.use(userRouter);
app.use(shopRouter);

// 404 PAGE MIDDLEWARE
app.use('/', errorController.getErrorPage);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 