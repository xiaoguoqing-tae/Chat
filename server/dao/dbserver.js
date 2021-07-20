var bcrypt = require("../dao/bcryptjs")
var dbmodule = require("../model/dbmodule")
var User = dbmodule.model('User')
var jwt = require("../dao/jwt")

var dbmodule = require("../model/dbmodule")
var User  = dbmodule.model("User")
var Friend = dbmodule.model("Friend")
var Group = dbmodule.model("Group")
var GroupUser = dbmodule.model("GroupUser")
var Message = dbmodule.model("Message")
var GroupMsg = dbmodule.model('GroupMsg')
var MomentMsg = dbmodule.model('MomentMsg')
var Qiandao = dbmodule.model('Qiandao')
var Mouse = dbmodule.model('Mouse')
//新建用户
exports.buildUser = function (name,mail,pwd,res) {
    //密码加密
    let password = bcrypt.encryption(pwd)
    let data = {
        name:name,
        email: mail,
        psw:password,
        time:new Date()
    }
    let user = new User(data);
    user.save(function (err,result) {
        if(err){
            res.send({status:500});
        }else {
            res.send({status:200})
        }
    })
}
exports.countUserValue = function (data,type,res) {
    let wherestr = {}
    wherestr[type] = data;
    User.countDocuments(wherestr,function (err,result) {
        if(err){
            res.send({status:500});
        }else {
            res.send({status:200,result});
        }
    })
}
//用户验证
exports.userMatch = function (data,pwd,res) {
    let wherestr = {$or:[{'name':data},{'email':data}]}
    let out = {'name':1,'imgurl':1,'psw':1,'bgurl':1}

    User.find(wherestr,out,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            if(result == ""){
                res.sendStatus(400)
            }
            result.map(function (e) {
                const pwdMatch = bcrypt.verification(pwd,e.psw);
                if(pwdMatch){
                    let token = jwt.generateToken(e._id)
                    let back = {
                        id:e._id,
                        name:e.name,
                        imgurl: e.imgurl,
                        bgurl:e.bgurl,
                        token:token,
                    }
                    res.send({status:200,back})
                }else {
                    res.sendStatus(400)
                }
            })
        }
    })
}

//搜索用户
exports.searchUser = function (data,res) {
    let wherestr
    if(data == "Taeyeon"){
         wherestr = {}
    }else {
         wherestr = {$or:[{name:{$regex:data}},{email:{$regex: data}}]}
    }
    let out = {
        'name':1,
        'email':1,
        'imgurl':1
    }
    User.find(wherestr,out,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200,result})
        }
    })
}
//判断是否为好友
exports.isFriend = function (uid,fid,res) {
    let wherestr = {'userID':uid,'friendID':fid,'state':0}

    Friend.findOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            if(result){
                res.send({status:200})
            }else {
                res.send({status:400})
            }
        }
    })
}
//群成员添加表
exports.addGroupUser = function (data,res) {
    let msg = {
        groupID:data.groupID,
        userID:data.userID,
        imgurl:data.img,
        name:data.name,
        time:new Date(),
        state:0
    }
    let groupuser = new GroupUser(msg);
    groupuser.save(function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//申请进群
exports.applyToGroup = function (data,res) {
    let wherestr = {'groupID':data.groupID,'userID':data.userID};
    GroupUser.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            if(result == 0){
                this.addGroupUser(data,res)
            }else {
                let wherestr = {'groupID':data.groupID,'userID':data.userID};
                let updatestr = {'time':new Date()}
                GroupUser.updateOne(wherestr,updatestr,function (err,result) {
                    if(err){
                        console.log("通讯时间出错")
                    }
                })
            }
            //添加消息
            this.insertGroupMsg(data.groupID,data.userID,data.msg,0,res)
        }
    })
}
//群主入群
function addGroup(data){
    let msg = {
        groupID:data.groupID,
        userID:data.userID,
        imgurl:data.img,
        name:data.name,
        time:new Date(),
        state:1
    }
    let groupuser = new GroupUser(msg);
    groupuser.save(function (err,result) {
        if(err){
            console.log("入群失败")
        }
    })
}
//群主审批
exports.headerapply = function(data,res){
    if(data.todo==0){
        this.deleteGroupUser(data,res)
    }else {
        let wherestr = {'groupID':data.groupID,'userID':data.userID};
        let updatestr = {'state':1}
        GroupUser.updateOne(wherestr,updatestr,function (err,result) {
            if(err){
                res.send({status:500})
            }else {
                res.send({status:200})
            }
        })
    }
}
//创建群
exports.buildGroup = function (data,res){
    let msg = {
        userID:data.userID,
        name:data.name,
        imgurl:data.imgurl,
        time:new Date(),
        notice:data.notice
    }
    let group = new Group(msg);
    group.save((err,result)=> {
        if(err){
            res.send({status:500});
        }else {
            let result_data = {
                groupID:result._id,
                userID:result.userID,
                name:data.username,
                img:data.img
            }
            addGroup(result_data)
            this.insertGroupMsg(result.userID,result._id,"大家好，我是群主",0,0,res)
            res.send({status:200})
        }
    })
}
//查询群
exports.searchGroup = function (data,res) {
    let wherestr
    if(data == "Taeyeon"){
         wherestr = {}
    }else {
         wherestr = {'name':{$regex:data}}
    }
    let out = {
        'name':1,
        'imgurl':1
    }
    Group.find(wherestr,out,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200,result})
        }
    })
}
//是否在群
exports.isInGroup = function (uid,gid,res) {
    let wherestr = {'userID':uid,'groupID':gid,'state':1}

    GroupUser.findOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            if(result){
                res.send({status:200})
            }else {
                res.send({status:400})
            }
        }
    })
}
//群详情
exports.groupDetail = function(id,res){
    let wherestr = {'_id':id};
    Group.findOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500});
        }else {
            res.send({status:200,result})
        }
    })
}

//好友详情
exports.userDetail = function (id,res) {
    let wherestr = {'_id':id};
    let out = {'psw':0};
    User.findOne(wherestr,out,function (err,result) {
        if(err){
            res.send({status:500});
        }else {
            res.send({status:200,result})
        }
    })
}

//用户信息修改
function update (data,update,res){
    User.findByIdAndUpdate(data,update,function (err,resu) {
        if(err){
            res.send({status:500})
        }else {
            res.sendStatus(200)
        }
    })
}
//群信息修改
exports.GroupUpdate = function(data,res){
    let updatestr = {}
    updatestr[data.type] = data.data
    Group.findByIdAndUpdate(data.id,updatestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
exports.userUpdate = function (data,res) {
    let updatestr = {}
    if(typeof(data.pwd)!=='undefined'){
        User.find({'_id':data.id},{"psw":1},function (err,result) {
            if(err){
                res.send({status:500})
            }else {
                result.map(function (e) {
                    const pwdMatch = bcrypt.verification(data.pwd,e.psw);
                    if(pwdMatch){
                        if(data.type=="psw"){
                            let password = bcrypt.encryption(data.data)
                            updatestr[data.type] = password
                            update(data.id,updatestr,res)
                        }else {
                            updatestr[data.type] = data.data;
                            User.countDocuments(updatestr,function (err,result) {
                                if(err){
                                    res.send({status:500})
                                }else {
                                    if(result==0){
                                        update(data.id,updatestr,res);
                                    }else {
                                        res.send({status:300})
                                    }
                                }
                            })
                        }
                    } else {
                        res.sendStatus(400)
                    }
                })
            }
        })
    }else if(data.type == 'name'){
        updatestr[data.type] = data.data
        User.countDocuments(updatestr,function (err,result) {
            if(err){
                res.send({status:500})
            }else {
                if(result==0){
                    update(data.id,updatestr,res);
                }else {
                    res.send({status:300})
                }
            }
        })
    }else {
        updatestr[data.type] = data.data;
        update(data.id,updatestr,res)
    }
}
//获取好友昵称
exports.getMarkName = function (data,res) {
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    let outstr = {'markname':1};
    Friend.findOne(wherestr,outstr,function (err,result) {
        if(err){
            res.sendStatus(500)
        }else {
            res.send({status:200,result})
        }
    })
}
//修改好友昵称
exports.updateMarkName = function (data,res) {
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    let updatestr = {'markname':data.name};
    Friend.updateOne(wherestr,updatestr,function (err,result) {
        if(err){
            res.sendStatus(500)
        }else {
            res.sendStatus(200)
        }
    })
}
//添加好友表
exports.bulidFriend = function (uid,fid,state) {
    let data = {
        userID:uid,
        friendID:fid,
        state:state,
        time: new Date(),
        lastTime:new Date()
    }
    let friend = new Friend(data);
    friend.save(function (err,result) {
        if(err){
            console.log("添加好友失败")
        }else {}
    })
}
//好友申请
exports.applyFriend = function(data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    Friend.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            if(result == 0){
                this.bulidFriend(data.uid,data.fid,2)
                this.bulidFriend(data.fid,data.uid,1)
            }else {
                this.upFriendLastTime(data)
            }
            //添加消息
            this.insertMsg(data,res)
        }
    })
}
//一对一对话
exports.insertMsg = function (data,res) {
    let data1 = {}
    if(data.type==2){
        data1={
            userID:data.uid,
            friendID:data.fid,
            message:data.msg,
            types:data.type,
            second:data.second,
            time:new Date(),
            state:1
        }
    }else {
        data1={
            userID:data.uid,
            friendID:data.fid,
            message:data.msg,
            types:data.type,
            time:new Date(),
            state:1
        }
    }
    let message = new Message(data1);
    message.save(function (err,result) {
        if(err){
            if(res){
                res.send({status:500});
            }
        }else {
            if(res){
                res.send({status:200})
            }
        }
    })
}
//群对话
exports.insertGroupMsg = function (uid,gid,msg,type,second,res) {
    console.log("kinlai")
    let data = {}
    if(type==2){
        data={
            groupID:gid,
            userID:uid,
            message:msg,
            second:second,
            types:type,
            time:new Date(),
            state:1
        }
    }else {
        data={
            groupID:gid,
            userID:uid,
            message:msg,
            types:type,
            time:new Date(),
            state:1
        }
    }

    let groupMsg = new GroupMsg(data);
    groupMsg.save(function (err,result) {
        if(err){
            if(res){
                res.send({status:500});
            }
        }else {
                var query = GroupUser.find()
                query.where({'groupID':gid})
                //查询结果
                query.exec().then(function (result) {
                    console.log(result)
                    result.forEach(item=>{
                        item.tip=item.tip+1
                        let wherestr = {'groupID':item.groupID,'userID':item.userID};
                        let updatestr = {'tip':item.tip}
                        GroupUser.updateOne(wherestr,updatestr,function (err,result) {
                            if(err){
                                console.log("修改未读数失败")
                            }else {
                                console.log("修改未读数成功")
                            }
                        })
                    })
                }).catch(err=>{
                    console.log("失败")
                })
        }
    })
}
//好友最后通讯时间
exports.upFriendLastTime = function (data) {
    let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]};
    let updatestr = {'lastTime':new Date()}
    Friend.updateMany(wherestr,updatestr,function (err,result) {
        if(err){
            console.log("好友最后通讯时间出错")
        }
    })
}
//更新好友状态
exports.updateFriendState = function (data,res) {
    let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}
    Friend.updateMany(wherestr,{'state':0,'show':true},function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//聊天页删除好友隐藏起来
exports.updateFriendStateIndex = function (data,res) {
    let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}
    let tj 
    if(data.type=='delete'){
        tj = {'show':false}
    }else{
        tj = {'show':true}
    }
    Friend.updateMany(wherestr,tj,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}

//拒绝或删除好友
exports.deleteFriend = function (data,res) {
    let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}
    Friend.deleteMany(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            Message.deleteMany(wherestr,function (err,result) {
                if(err){
                    res.send({status:500})
                }else {
                    res.send({status:200})
                }
            })
        }
    })
}
//剔除群成员
exports.deleteGroupUser = function(data,res){
    let wherestr = {'userID':data.userID,'groupID':data.groupID}
    GroupUser.deleteOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//解散群
exports.deleteGroup = function(data,res){
    let wherestr = {'groupID':data.groupID}
    Group.deleteOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            GroupUser.deleteMany(wherestr,function (err,result) {
                if(err){
                    res.send({status:500})
                }else {
                    res.send({status:200})
                }
            })
        }
    })
}
//获取pc端首页聊天的好友
exports.getIndex = function (data,res) {
    let query = Friend.find()
    //查询条件
    query.where({'userID':data.uid,'show': true});
    //查找friendID 关联User对象
    query.populate('friendID');
    //排序时间
    query.sort({'lastTime':-1})
    //查询结果
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return{
                id:ver.friendID._id,
                name:ver.friendID.name,
                imgurl:ver.friendID.imgurl,
                markname:ver.markname,
                lastTime:ver.lastTime,
            }
        })
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}

//按要求获取好友列表
exports.getUser = function (data,res) {
    let query = Friend.find()
    //查询条件
    query.where({'userID':data.uid,'state': data.state});
    //查找friendID 关联User对象
    query.populate('friendID');
    //排序时间
    query.sort({'lastTime':-1})
    //查询结果
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return{
                id:ver.friendID._id,
                name:ver.friendID.name,
                imgurl:ver.friendID.imgurl,
                markname:ver.markname,
                lastTime:ver.lastTime,
            }
        })
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//获取好友一对一消息
exports.getOneMsg = function (data,res) {
    let query = Message.findOne({});
    //查询条件
    query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]});
    //排序时间
    query.sort({'time':-1})
    //查询结果
    query.exec().then(function (e) {
            let result = {
                message:e.message,
                time:e.time,
                types:e.types
            }
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//获取群最后一条消息
exports.getlastgroupMsg = function (data,res) {
    let query = GroupMsg.findOne({});
    //查询条件
    query.where({'groupID':data.gid});
    query.populate('userID');
    //排序时间
    query.sort({'time':-1})
    //查询结果
    query.exec().then(function (e) {
        let result = {
            name:e.userID.name,
            message:e.message,
            time:e.time,
            types:e.types
        }
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//汇总未读消息数
exports.unreadMsg = function (data,res) {
    let wherestr = {'userID':data.fid,'friendID':data.uid,'state':1}
    Message.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200,result})
        }
    })
}
//已读未读修改
exports.updateMsg = function (data,res) {
    let wherestr = {'userID':data.fid,'friendID':data.uid,'state':1}
    let updatestr = {'state':0}
    Message.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//群已读未读修改
exports.updateGroupUnread = function(data,res){
    let wherestr = {'groupID':data.gid,'userID':data.uid}
    let updatestr = {'tip':0}
    GroupUser.updateOne(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//获取群列表
exports.getGroup = function (uid,res) {
    let query = GroupUser.find();
    query.where({'userID':uid,'state':1});
    query.populate("groupID")
    query.sort({'time':-1})
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return{
                gid:ver.groupID._id,
                name:ver.groupID.name,
                username:ver.name,
                imgurl:ver.groupID.imgurl,
                lastTime:ver.time,
                tip:ver.tip,
                state:ver.state
            }
        })
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//获取群成员
exports.getgroupUser = function(data,res){
    var query = GroupUser.find()
    query.where({'groupID':data.gid})
    //查询结果
    query.exec().then(function (result) {
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//获取群消息
exports.getOneGroupMsg = function (gid,res) {
    var query = GroupMsg.findOne({})
    query.where({'groupID':gid})
    query.populate('userID')
    query.sort({'Time':-1})
    //查询结果
    query.exec().then(function (e) {
        let result = {
            message:e.message,
            time:e.time,
            types:e.types,
            name:e.userID.name
        }
        res.send({status:200,result})
    }).catch(err=>{
        res.send({status:500})
    })
}
//群已读未读修改
exports.updateGroupMsg = function (data,res) {
    let wherestr = {'userID':data.uid,'groupID':data.gid,'state':1}
    let updatestr = {'tip':0}
    GroupMsg.updateOne(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//消息操作
exports.msg = function (data,res) {
    if(data.nowPage>=0){
        var skipNum = data.nowPage*data.pageSize;
        let query = Message.find({});
        query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]});
        query.sort({'time':-1});
        query.populate('userID')
        query.skip(skipNum)
        query.limit(data.pageSize);
        query.exec().then(function (e) {
            let result = e.map(function (ver) {
                return {
                    id:ver._id,
                    message:ver.message,
                    types:ver.types,
                    second:ver.second,
                    time:ver.time,
                    fromId:ver.userID._id,
                    imgurl:ver.userID.imgurl
                }
            })
            res.send({status:200,result})
        }).catch(function (err) {
            res.send({status:500})
        })
    }
}
//群消息操作
exports.groupmsg = function (data,res) {
    if(data.nowPage>=0) {
        var skipNum = data.nowPage * data.pageSize;
        let query = GroupMsg.find({});
        query.where({'groupID': data.gid});
        query.sort({'time': -1});
        query.populate('userID')
        query.skip(skipNum)
        query.limit(data.pageSize);
        query.exec().then(function (e) {
            let result = e.map(function (ver) {
                return {
                    id: ver._id,
                    name: ver.userID.name,
                    message: ver.message,
                    types: ver.types,
                    second:ver.second,
                    time: ver.time,
                    fromId: ver.userID._id,
                    imgurl: ver.userID.imgurl
                }
            })
            res.send({status: 200, result})
        }).catch(function (err) {
            res.send({status: 500})
        })
    }
}

//发送好友圈消息
exports.moments = function (data,res) {
    let momentMsg={
        userID:data.id,
        name:data.name,
        imgurl:data.imgurl,
        message:data.message,
        url:data.url,
        time:new Date(),
        zan:0
    }
    let momentmsg = new MomentMsg(momentMsg);
    momentmsg.save(function (err,result) {
        if(err){
            if(res){
                res.send({status:500});
            }
        }else {
            if(res){
                res.send({status:200})
            }
        }
    })
}
//删除朋友圈
exports.deleteMoments = function(data,res){
    let wherestr = {'_id':data.id}
    MomentMsg.deleteOne(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200})
        }
    })
}
//获取好友圈动态
exports.getmoments = function (data,res) {
    let query = Friend.find()
    //查询条件
    query.where({'userID':data.uid,'state': data.state});
    //查找friendID 关联User对象
    query.populate('friendID');
    //查询结果
    var friend = []
    var result=[]
    var com = []
    friend.push(data.uid)
    query.exec().then(function (e) {
        e.map(function (ver) {
            friend.push(String(ver.friendID._id))
        })
        let find = MomentMsg.find({});
        find.sort({'time':-1})
        find.exec().then(function (e) {
            e.forEach(item=>{
                if(friend.indexOf(String(item.userID))>=0){
                    result.push(item)
                }
            })
            res.send({status:200,result})
        }).catch(err=>{
            res.send({status:500})
        })
    }).catch(err=>{
        res.send({status:500})
    })
}
//点赞
exports.zan = function (data,res) {
    MomentMsg.findOne({'_id':data.id},function (err,result) {
        if(err){
            res.sendStatus(500)
        }else {
            if(data.state){
                let zanlist = result.zanlist.push(data.userID)
                let wherestr = {'_id':data.id}
                let updatestr = {'zanlist':result.zanlist,'zan':result.zan+1}
                MomentMsg.updateOne(wherestr,updatestr,(err,result)=>{
                    if(err){
                        res.send({status:500})
                    }else {
                        res.send({status:200})
                    }
                })
            }else {
                result.zanlist.forEach((item,index)=>{
                    if(item==data.userID){
                        var zanlist = result.zanlist.splice(index,1)
                    }
                })
                let wherestr = {'_id':data.id}
                let updatestr = {'zanlist':result.zanlist,'zan':result.zan-1}
                MomentMsg.updateOne(wherestr,updatestr,(err,result)=>{
                    if(err){
                        res.send({status:500})
                    }else {
                        res.send({status:200})
                    }
                })
            }
        }
    })
}
//评论
exports.comment = function (data,res) {
    let Msg={
        momentID:data.momentID,
        userID:data.userID,
        friendID:data.friendID,
        name:data.name,
        message:data.message,
        time:new Date(),
    }
    MomentMsg.findOne({'_id':data.momentID},function (err,result) {
        if(err){
            res.sendStatus(500)
        }else {
            let commentslist = result.comments.push(Msg)
            let wherestr = {'_id':data.momentID}
            let updatestr = {'comments':result.comments}
            MomentMsg.updateOne(wherestr,updatestr,(err,result)=>{
                if(err){
                    res.send({status:500})
                }else {
                    res.send({status:200})
                }
            })
        }
    })
}
//用户获取签到日期
exports.qiandaoDate = function(data,res){
    let wherestr
    wherestr = {'userID':data.id}
    Qiandao.find(wherestr,function (err,result) {
        if(err){
            res.send({status:500})
        }else {
            res.send({status:200,result})
        }
    })
}
//用户签到
exports.qiandao = function (data,res) {
    Qiandao.findOne({'userID':data.id},function (err,result) {
        if (err){
            res.send({status:500})
        }else {
            console.log(result)
            if(result==null){
                let msg = {
                    userID:data.id,
                    date:data.date,
                    sumcount: data.sumcount
                }
                let qiandao = new Qiandao(msg);
                qiandao.save(function (err,result) {
                    if(err){
                        res.send({status:500})
                    }else {
                        res.send({status:200})
                    }
                })
            }else {
                let wherestr = {'userID':data.id}
                let updatestr = {'date':data.date,'sumcount':data.sumcount}
                Qiandao.updateOne(wherestr,updatestr,(err,result)=>{
                    if(err){
                        res.send({status:500})
                    }else {
                        res.send({status:200})
                    }
                })
            }
        }
    })
}
//用户打地鼠成绩
exports.mouse = function (data,res) {
    Mouse.findOne({'userID':data.id},function (err,result) {
        if (err){
            res.send({status:500})
        }else {
            console.log(result)
            if(result==null){
                let msg = {
                    userID:data.id,
                    score:data.score
                }
                let mouse = new Mouse(msg);
                mouse.save(function (err,result) {
                    if(err){
                        res.send({status:500})
                    }else {
                        res.send({status:200})
                    }
                })
            }else {
                if(data.score>result.score){
                    let wherestr = {'userID':data.id}
                    let updatestr = {'score':data.score}
                    Mouse.updateOne(wherestr,updatestr,(err,result)=>{
                        if(err){
                            res.send({status:500})
                        }else {
                            res.send({status:300})
                        }
                    })
                }else {
                    res.send({status:400})
                }
            }
        }
    })
}



