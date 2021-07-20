<template>
    <div class="friendInfo">
        <div class="info-box">
            <div class="head">
                <div>{{name}}</div>
                <img :src="url+'/'+bgimg" alt="">
            </div>
            <div class="center">
                <div class="center-item">
                    <div>账号：</div>
                    <div class="detail">{{email}}</div>
                </div>
                <div class="center-item">
                    <div>简介：</div>
                    <div>{{explain}}</div>
                </div>
            </div>
            <div class="bottom">
                <div class="btn" @click="tosend">发消息</div>
            </div>
        </div>
    </div>
</template>

<script>
import apis from "../api/api"
export default {
    data() {
        return {
            uid:"",
            explain:"",
            name:"",
            bgimg:"",
            email:""
        };
    },
    created() {

    },
    mounted() {
        this.uid =  this.$route.params.uid
        const data = {
            id: this.uid
        }
        apis.getFriendInfo(data).then(res=>{
            if(res.status==200){
                this.name = res.result.name
                this.bgimg = res.result.bgurl
                this.email = res.result.email
                if(typeof(res.result.explain)=='undefined'){
                    this.explain = "这个人很懒，什么都没有留下"
                }else{
                    this.explain = res.result.explain
                }
            }
            console.log(res)
        })
    },
    methods: {
        tosend(){
            let params = {
                fid:this.uid,
                img:this.bgimg,
                name:this.name
            }
            this.$router.push({'name':'chatroom','query':params})
        }
    }
};
</script>

<style scoped lang="scss">
    .friendInfo{
        flex: 1;
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        .info-box{
            margin-top: 80px;
            width: 500px;
            height:550px;
            .head{
                display: flex;
                align-items: flex-start;
                justify-content: space-around;
                height: 150px;
                border-bottom: 1px solid #bbbbbb;
                div{
                    padding-top: 10px;
                    font-size: 25px;
                }
                img{
                    width: 80px;
                    height: 80px;
                }
            }
            .center{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                height: 200px;
                .center-item{
                    display: flex;
                    align-items: center;
                    padding-left: 50px;
                    padding-top: 30px;
                    .detail{
                        padding-top: 4px;
                        font-size: 19px;
                    }
                }
            }
            .bottom{
                display: flex;
                justify-content: center;
                border-top:1px solid #bbbbbb;
                padding-top: 30px;
                .btn{
                    width: 160px;
                    height: 45px;
                    background: #269726;
                    line-height: 45px;
                    color: #ffffff;
                }
            }
        }
    }
</style>
