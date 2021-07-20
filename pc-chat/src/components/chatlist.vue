<template>
  <div class="container">
    <div class="left">
      <search @searchlist="acceptsearch"></search>
      <div
        class="infoItem"
        v-for="(item, index) in friendList"
        :key="index"
        @click="openchatroom(index, item)"
        :class="{ 'infoItem-active': active == item.id }"
        v-show="show"
      >
        <div class="info-img">
          <img :src="item.imgurl" />
        </div>
        <div class="info-tip" v-if="item.tip > 0">{{ item.tip }}</div>
        <div class="info-msg">
          <div class="msg-box">
            <div class="name">{{ item.name }}</div>
            <div class="message">{{ item.msg }}</div>
          </div>
        </div>
        <div class="info-time">
          <div class="time-box">
            <div class="time">{{ item.lastTime }}</div>
            <div class="message"></div>
          </div>
        </div>
      </div>

      <div class="searchlist" v-show="!show">
        <div class="user_info" v-for="(item, index) in datalist" :key="index">
          <div>
            <img :src="item.imgurl" />
            <div class="infobox">
              <div class="name" v-html="item.name"></div>
              <div class="email" v-html="item.email"></div>
            </div>
          </div>
          <div
            v-if="item.isFriend"
            class="btn"
            :ref="item._id"
            @click="applyfriend(item)"
          >
            加好友
          </div>
          <div
            v-if="!item.isFriend"
            class="btn"
            @click="sendmsg(item)"
            style="background: #3cc51f"
          >
            发消息
          </div>
        </div>
      </div>
    </div>
    <router-view :key="id"></router-view>
  </div>
</template>

<script>
import apis from "../api/api";
import search from "../components/search.vue";
import { dateTime } from "../utils/myfunction";
import { mapGetters } from "vuex";
import api from "../api/api";
import { loadFromSession } from "@/storage/sessionStorage";
export default {
  data() {
    return {
      active: -1,
      friendList: [],
      tip: 0,
      id: "",
      show: true,
      datalist: [],
      myname: "",
    };
  },
  components: {
    search,
  },
  created() {
    
  },
  mounted() {
    console.log(this.$route.query);
    const user = loadFromSession("user");
    this.myname = user.name;
    const data = {
      uid: this.GET_UID,
    };
    this.active = this.$route.query.fid;
    apis.getchatlist(data).then((res) => {
      if (res.status == 200) {
        if (res.result.length > 0) {
          this.friendList = res.result;
          for (let i = 0; i < this.friendList.length; i++) {
            this.friendList[i].imgurl =
              this.url + "/" + this.friendList[i].imgurl;
            this.friendList[i].lastTime = dateTime(this.friendList[i].lastTime);
            this.getmsg(this.friendList, i);
            this.getunread(this.friendList, i);
          }
        }
      }
    });
    this.receivemsg();
  },
  computed: {
    ...mapGetters(["GET_UID", "GET_TOKEN"]),
  },
  methods: {
    acceptsearch(data) {
      if (data.value == "") {
        this.show = true;
      } else {
        this.show = false;
      }
      let arr = data.data;
      let exp = eval("/" + data.value + "/g");
      arr.forEach((item) => {
        if (this.GET_UID != item._id) {
          if (
            item.name.search(data.value) != -1 ||
            item.email.search(data.value) != -1
          ) {
            item.imgurl = this.url + item.imgurl;
            item.name = item.name.replace(
              exp,
              "<span style='color:#4AAAFF;'>" + data.value + "</span>"
            );
            item.email = item.email.replace(
              exp,
              "<span style='color:#4AAAFF;'>" + data.value + "</span>"
            );
            this.datalist.push(item);
          }
        }
      });
      for (let i = 0; i < this.datalist.length; i++) {
        let obj = {
          uid: this.GET_UID,
          fid: this.datalist[i]._id,
        };
        api.isfriend(obj).then((res) => {
          if (res.status == 200) {
            this.datalist[i].isFriend = false;
            this.datalist.splice(i, 1, this.datalist[i]);
          } else if (res.status == 400) {
            this.datalist[i].isFriend = true;
            this.datalist.splice(i, 1, this.datalist[i]);
          }
        });
      }
      console.log(data);
    },
    getmsg(arr, i) {
      const data = {
        fid: arr[i].id,
        uid: this.GET_UID,
        token: this.GET_TOKEN,
      };
      apis.getmsg(data).then((res) => {
        if (res.status == 200) {
          let resData = res.result;
          if (resData.types == 0) {
            //文字
          } else if (resData.types == 1) {
            resData.message = "[图片]";
          } else if (resData.types == 2) {
            resData.message = "[语音]";
          } else if (resData.types == 3) {
            resData.message = "[位置]";
          }
          arr[i].msg = resData.message;
          arr.splice(i, 1, arr[i]);
        } else if (res.data.status == 500) {
          this.$message.error("服务器错误");
        } else if (res.data.status == 300) {
          this.$router.push({ name: "login" });
        }
      });
    },
    getunread(arr, i) {
      const data = {
        fid: arr[i].id,
        uid: this.GET_UID,
        token: this.GET_TOKEN,
      };
      api.getunread(data).then((res) => {
        if (res.status == 200) {
          let resData = res.result;
          arr[i].tip = resData;
          this.tip = this.tip + resData;
          arr.splice(i, 1, arr[i]);
        }
      });
    },
    openchatroom(i, it) {
      const data = {
        fid: it.id,
        uid: this.GET_UID,
        token: this.GET_TOKEN,
      };
      api.updatemsg(data);
      let e = this.friendList[i];
      e.tip = 0;
      this.friendList.splice(i, 1, e);
      this.$router.push({
        name: "chatroom",
        query: { fid: it.id, img: it.imgurl, name: it.name },
      });
      this.active = it.id;
      this.id = it.id;
    },
    receivemsg() {
      this.socket.on("msg", (msg, fromid, toid) => {
        console.log(msg, fromid, toid);
        let nmsg = "";
        if (msg.types == 0) {
          nmsg = msg.message;
        } else if (msg.types == 1) {
          nmsg = "[图片]";
        }
        //  else if (msg.types == 2) {
        // 	nmsg = '[音频]'
        // } else if (msg.types == 3) {
        // 	nmsg = '[位置]'
        // }
        if (toid == 0) {
          for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].id == fromid) {
              let e = this.friendList[i];
              e.lastTime = dateTime(new Date());
              e.msg = nmsg;
              e.tip++;
              this.tip++;
              this.friendList.splice(i, 1);
              this.friendList.unshift(e);
            }
          }
        }
      });
    },
    sendmsg(it) {
      this.$router.push({
        name: "chatroom",
        query: { fid: it._id, img: it.imgurl, name: it.name },
      });
      this.active = it._id;
      this.id = it._id;
    },
    applyfriend(it) {
      const obj = {
        uid: this.GET_UID,
        fid: it._id,
        type: 0,
        token: this.GET_TOKEN,
        msg: this.myname + "请求添加您为好友",
      };
      api.addfriend(obj).then((res) => {
        console.log(res);
        this.$refs[it._id][0].innerHTML = "已发送";
        this.$refs[it._id][0].style.background = "#f0e8d1";
        this.$refs[it._id][0].style.color = "#c24768";
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  .left {
    width: 300px;
    height: 100vh;
    background: #e4e2e2;
    .infoItem {
      width: 100%;
      height: 90px;
      display: flex;
      cursor: pointer;
      position: relative;
      .info-img {
        width: 70px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 85%;
          height: 70%;
        }
      }
      .info-tip {
        position: absolute;
        padding: 1px 5px 1px 5px;
        color: #ffffff;
        border-radius: 50%;
        background: red;
        left: 50px;
        top: 5px;
      }
      .info-msg {
        width: 140px;
        height: 90px;
        display: flex;
        align-items: center;
        .msg-box {
          width: 80%;
          height: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          .name {
            font-size: 18px;
            font-weight: bold;
          }
          .message {
            width: 140px;
            font-size: 13px;
            display: flex;
            justify-content: flex-start;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #aca8a8;
          }
        }
      }
      .info-time {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-right: 10px;
        .time-box {
          width: 100%;
          height: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-end;
          .time {
            float: right;
            font-size: 13px;
            color: #aca8a8;
          }
          .message {
            visibility: hidden;
          }
        }
      }
    }
    .infoItem-active {
      background: #cfcccc;
    }

    .searchlist {
      .user_info {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          float: left;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .infobox {
          padding-left: 10px;
          display: flex;
          flex-direction: column;
        }
        .email {
          float: left;
          font-size: 13px;
          color: #272832;
          display: inline;
          // padding: 10rpx 0 0 20rpx;
        }
        .name {
          text-align: left;
          font-size: 17px;
          color: #272832;
          display: inline;
          // padding: 10rpx 0 0 20rpx;
        }
        .btn {
          float: right;
          width: 60px;
          height: 24px;
          background: #5ea9c9;
          margin-right: 16px;
          margin-top: 5px;
          border-radius: 5px;
          font-size: 12px;
          color: #272832;
          text-align: center;
          line-height: 24px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
