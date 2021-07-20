const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost:27017/test', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.info("数据库连接成功")
});
module.exports = db