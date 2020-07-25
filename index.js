require('./src/db/mongoose');
const express = require('express');
const path = require('path');
const adminRouter = require('./src/routes/admin');
const userRouter = require('./src/routes/user');

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

// 404 PAGE MIDDLEWARE
app.use('/', (req, res) => {
  res.status(404).send('404 page');
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 