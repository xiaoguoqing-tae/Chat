var dbserver = require("../dao/dbserver")
var emai = require("../dao/emailServer")
//用户注册
exports.signUp = function (req,res) {
    let name = req.body.name;
    let mail = req.body.mail;
    let pwd = req.body.pwd;
    emai.emailSignUp(mail)
    dbserver.buildUser(name,mail,pwd,res)
}
//判断邮箱是否占用
exports.judgeValue = function (req,res) {
    let data = req.body.data;
    let type = req.body.type;
    // res.send({data,type})
    dbserver.countUserValue(data,type,res)
}