var dbserver = require("../dao/dbserver")
var jwt = require("../dao/jwt")

//登录
exports.signIn = function (req,res) {
    let data = req.body.data;
    let pwd = req.body.pwd;

    dbserver.userMatch(data,pwd,res)
}

