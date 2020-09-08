const fs = require('fs');

const deleteFile = (next, filePath, callback) => {
  fs.unlink(filePath, callback);
};

module.exports = deleteFile;
