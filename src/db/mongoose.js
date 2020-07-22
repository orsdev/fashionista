const mongoose = require('mongoose');
const uri = process.env.DB_URI;

try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
} catch (error) {
  console.log(error);
}
