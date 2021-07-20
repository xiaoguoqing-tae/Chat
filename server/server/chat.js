var dbserver = require("../dao/dbserver")

exports.msg = function (req,res) {
    let data = req.body;
    dbserver.msg(data,res)
}
exports.groupmsg = function (req,res) {
    let data = req.body;
    dbserver.groupmsg(data,res)
}