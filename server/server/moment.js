var dbserver = require("../dao/dbserver")

exports.moments = function (req,res) {
    let data = req.body;
    dbserver.moments(data,res)
}
exports.getmoments = function (req,res) {
    let data = req.body;
    dbserver.getmoments(data,res)
}
//点赞
exports.zan = function (req,res) {
    let data = req.body;
    dbserver.zan(data,res)
}
//评论
exports.comment = function (req,res) {
    let data = req.body;
    dbserver.comment(data,res)
}
//删除此条朋友圈
exports.deleteMoment = function (req,res) {
    let data = req.body;
    dbserver.deleteMoments(data,res)
}