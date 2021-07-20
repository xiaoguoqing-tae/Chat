<template>
    <div class="sidebar">
        <img class="userimg" :src="src" alt="">
        <div class="chat" @click="tourl('msg')">
            <img :src="state==0?iconlist[0]:iconlist[1]" />
        </div>
        <div class="friendlist" @click="tourl('friendlist')">
            <img :src="state==0?iconlist[3]:iconlist[2]"  />
        </div>
    </div>
</template>

<script>
import {loadFromSession} from "@/storage/sessionStorage"
export default {
    data() {
        return {
            iconlist:[require("../assets/chat(1).png"),require("../assets/chat.png"),require("../assets/friendlist(1).png"),require("../assets/frienlist.png")],
            state:0,
            src:""
        };
    },
    created() {

    },
    mounted() {
        const user = loadFromSession("user")
        this.src = this.url+user.imgurl
        this.socket.emit("login", user.id)
    },
    methods: {
        tourl(msg){
            if(msg=="msg"){
                this.state = 0
            }else{
                this.state = 1
            }
            this.$router.push({'name':msg})
        }
    }
};
</script>

<style scoped lang="scss">
.sidebar{
    width: 65px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: #353535;
    .userimg{
        margin-top: 15px;
        margin-bottom: 20px ;
        width: 80%;
        height: 55px;
    }
    .chat,.friendlist{
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img{
            width: 25px;
            height: 25px;
        }
    }
}
</style>