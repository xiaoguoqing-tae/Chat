var mongoose = require("mongoose")
var db = require("../config/db")
var Schema = mongoose.Schema
var UserSchema = new Schema({
    name:{type:String},
    psw:{type:String},
    email:{type:String},
    sex:{type:String,default:'asexual'},
    birth:{type:String},
    phone:{type:String},
    explain:{type:String},//介绍
    imgurl:{type:String,default: '/user/user.png'},
    bgurl:{type:String,default: '/user/user.png'},
    time:{type:Date},
});
var FriendSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    friendID:{type:Schema.Types.ObjectID,ref:'User'},
    state:{type:String},
    show:{type:Boolean,default:false},
    time:{type:Date},
    markname:{type:String},
    lastTime:{type:Date},
});
var MessageSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    friendID:{type:Schema.Types.ObjectID,ref:'User'},
    message:{type:String},
    second:{type:Number,default:0},
    types:{type:String},
    time:{type:Date},
    state:{type:Number},
});
var GroupSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    name:{type:String},
    imgurl:{type:String,default: '/user/group.png'},
    time:{type:Date},
    notice:{type:String},
});
var GroupUserSchema = new Schema({
    groupID:{type:Schema.Types.ObjectID,ref:'Group'},
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    name:{type:String},
    imgurl:{type:String},
    tip:{type:Number,default:0},//未读消息数
    time:{type:Date},
    state:{type:Number,default:0},//申请入群（0申请中，1已入群）
    shield:{type:Number,default:0},//是否屏蔽（0不，1是）
});
var GroupMsgSchema = new Schema({
    groupID:{type:Schema.Types.ObjectID,ref:'Group'},
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    message:{type:String},
    second:{type:Number,default:0},
    types:{type:String},
    time:{type:Date},
    state:{type:Number},
});
var MomentMsgSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    name:{type:String},
    imgurl:{type:String},
    message:{type:String},
    url:{type:String},
    time:{type:Date},
    zanlist:{type:Array},
    zan: {type:Number},
    zanboolean:{type:Boolean,default:false},
    comments:[],
});
var QiandaoSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    date:{type:Array},
    sumcount:{type:Number,default:0}
})
var MouseSchema = new Schema({
    userID:{type:Schema.Types.ObjectID,ref:'User'},
    score:{type:Number,default:0}
})

module.exports=db.model('User',UserSchema)
module.exports=db.model('Friend',FriendSchema)
module.exports=db.model('Message',MessageSchema)
module.exports=db.model('Group',GroupSchema)
module.exports=db.model('GroupUser',GroupUserSchema)
module.exports=db.model('GroupMsg',GroupMsgSchema)
module.exports=db.model('MomentMsg',MomentMsgSchema)
module.exports=db.model('Qiandao',QiandaoSchema)
module.exports=db.model('Mouse',MouseSchema)