var dbserver = require("../dao/dbserver")
//详情
exports.userDetail = function (req,res) {
    let id = req.body.id;
    dbserver.userDetail(id,res)
}
//用户信息修改
exports.userUpdate = function (req,res) {
    let data = req.body;
    dbserver.userUpdate(data,res)
}
//获取好友昵称
exports.getMarkName = function (req,res) {
    let data = req.body;
    console.log(data)
    dbserver.getMarkName(data,res)
}
//修改好友昵称
exports.updateMarkName = function (req,res) {
    let data = req.body;
    console.log(data)
    dbserver.updateMarkName(data,res)
}
//用户签到
exports.qiandao = function (req,res) {
    let data = req.body
    dbserver.qiandao(data,res)
}
//获取用户签到日期
exports.qiandaoDate = function (req,res) {
    let data = req.body
    dbserver.qiandaoDate(data,res)
}
//用户打地鼠成绩
exports.mouse = function (req,res) {
    let data = req.body
    dbserver.mouse(data,res)
}