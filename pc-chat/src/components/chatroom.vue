<template>
  <div class="chatroom">
    <div class="head">
      <div class="name">{{ name }}</div>
      <img src="../assets/more.png" alt="" />
    </div>
    <div class="chatpanel" ref="chatpanel" @scroll="showscroll">
      <p v-show="showloading">{{ tip }}</p>
      <loading v-show="!showloading" />
      <div
        class="chat-ls"
        v-for="(item, index) in chatlist" 
        :key="index"
        :ref="`msg${item.id}`"
      >
        <div class="chat-time" v-if="item.Ntime != ''">{{ item.time }}</div>
        <div class="msg-m msg-left" v-if="item.fromId !== GET_UID">
          <img :src="item.imgurl" class="user-img" />
          <div class="message" v-if="item.types == '0'">
            <div class="msg-text">{{ item.message }}</div>
          </div>
          <div class="message" v-if="item.types == '1'">
            <img
              :src="item.message"
              class="msg-img"
              mode="widthFix"
              @tap="prediv(item.message)"
            />
          </div>
          <!-- <div class="message" v-if="item.types=='2'">
							<div class="msg-text voice" :style="{width:item.second*3+'px'}" @tap="playVoice(item.message)">
								<img src="../../static/voice.png"/>
								<text>{{item.second}}"</text>
							</div>
						</div>
						<div class="message-map" v-if="item.types=='3'">
							<div class="map" @tap=lookMap(item)>
								<div class="map-name">{{item.message.name}}</div>
								<div class="map-location">{{item.message.address}}</div>
								<img src="../../static/unnamed.jpg"/>
							</div>
						</div> -->
        </div>
        <div class="msg-m msg-right" v-if="item.fromId == GET_UID">
          <img :src="item.imgurl" class="user-img" />
          <div class="message" v-if="item.types == '0'">
            <div class="msg-text">{{ item.message }}</div>
          </div>
          <div class="message" v-if="item.types=='1'">
							<img :src="item.message" class="msg-img" mode="widthFix" @load="imgload" @tap="prediv(item.message)"/>
						</div>
						<!-- <div class="message" v-if="item.types=='2'">
							<div class="msg-text voice" :style="{width:item.second*3.5+'px'}" @tap="playVoice(item.message)">
								<img src="../../static/voice.png"/>
								<text>{{item.second}}"</text>
							</div>
						</div>
						<div class="message-map" v-if="item.types=='3'">
							<div class="map" @tap=lookMap(item)>
								<div class="map-name">{{item.message.name}}</div>
								<div class="map-location">{{item.message.address}}</div>
								<img src='../../static/unnamed.jpg'/>
							</div>
						</div> -->
        </div>
      </div>
    </div>
    <div class="chatinput">
      <div class="tools">
        <div class="tool" @click="opennemoji">
          <img src="../assets/emoji.png" alt="" />
        </div>
        <div class="tool">
          <form>
            <input
              multiple="multiple"
              type="file"
              id="file"
              ref="input_file"
              @change="fileChange"
            />
          </form>
          <label for="file">
            <img src="../assets/image.png" alt="" />
          </label>
        </div>
      </div>
      <textarea @focus="focus" v-model="value" />
      <button @click="sendmsg">发送</button>
    </div>
    <emoji @sendemoji="accept" v-show="emoji"></emoji>
  </div>
</template>

<script>
import emoji from "../components/emoji.vue";
import loading from "../components/loading.vue";
import { mapGetters } from "vuex";
import api from "../api/api";
import { dateTime, spaceTime, fileName } from "../utils/myfunction";
import { loadFromSession } from "@/storage/sessionStorage";
import qs from "qs";
export default {
  data() {
    return {
      myname: "",
      myimg: "",
      emoji: false,
      value: "",
      base64Img: [],
      name: "",
      urlimg: "",
      fid: "",
      nowpage: 0,
      pageSize: 10,
      chatlist: [],
      oldTime: new Date(),
      showloading: true,
      scrollTop: 0,
      tip: "查看更多消息",
    };
  },
  components: {
    emoji,
    loading,
  },
  computed: {
    ...mapGetters(["GET_UID", "GET_TOKEN"]),
  },
  created() {},
  mounted() {
    const user = loadFromSession("user");
    this.myimg = this.url + user.imgurl;
    this.myname = user.name;
    const params = this.$route.query;
    this.name = params.name;
    this.imgurl = params.img;
    this.fid = params.fid;
    console.log(params);
    this.receivemsg();
    this.getmsg().then((res) => {
      console.log(this.nowpage);
      if (this.nowpage == 1 || this.nowpage == -1) {
        this.scrollbottom();
      }
    });
  },
  methods: {
    getmsg() {
      const obj = {
        uid: this.GET_UID,
        fid: this.fid,
        nowPage: this.nowpage,
        pageSize: this.pageSize,
        token: this.GET_TOKEN,
      };
      this.showloading = false;
      return new Promise((resolve, reject) => {
        api.getchatmsg(obj).then((res) => {
          console.log(res);
          let status = res.status;
          let msgs = [];
          if (status == 200) {
            let msg = res.result;
            if (msg.length > 0) {
              for (var i = msg.length - 1; i >= 0; i--) {
                let t = spaceTime(this.oldTime, msg[i].time);
                if (t != "") {
                  this.oldTime = t;
                }
                msg[i].Ntime = t;
                msg[i].time = dateTime(t);
                msg[i].imgurl = this.url + "/" + msg[i].imgurl;
                if (msg[i].types == "1") {
                  msg[i].message = this.url + "/" + msg[i].message;
                  // this.previewList.unshift(msg[i].message);
                }
                if (msg[i].types == "3") {
                  msg[i].message = JSON.parse(msg[i].message);
                }
                msgs.push(msg[i]);
              }
            }
            if (this.nowpage == 0 && msg.length < 10) {
              this.chatlist = msgs;
              this.showloading = true;
              this.tip = "";
            }
            if (msg.length == 10) {
              this.nowpage++;
            } else {
              this.nowpage = -1;
            }
            if (this.nowpage == 1) {
              this.chatlist = msgs;
            }
            resolve(msgs);
          }
        });
      });
    },
    showscroll() {
      let st = this.$refs["chatpanel"].scrollTop;
      if (st == 0) {
        if (this.nowpage > 0) {
          let get = async () => {
            let data = await this.getmsg();
            console.log(data);
            let pageid = `msg${this.chatlist[0].id}`;
            this.chatlist = [...data, ...this.chatlist];
            this.$nextTick(() => {
              this.$refs[pageid][0].scrollIntoView();
              this.showloading = true;
              console.log(this.$refs[pageid]);
            });
          };
          get();
        } else {
          this.tip = "无更多消息";
          return;
        }
      }
    },
    scrollbottom() {
      console.log(5555555555555)
      this.$nextTick(() => {
        var container = this.$refs["chatpanel"];
        container.scrollTop = container.scrollHeight;
      });
    },
    opennemoji() {
      this.emoji = true;
    },
    focus() {
      this.emoji = false;
    },
    accept(msg) {
      console.log(msg);
      this.value += msg;
    },
    /* 由于无法获取到图片的绝对路径，故只能将文件转换后在显示 */
    fileChange(e) {
      let files = e.target.files;
      let images = [];
      for (let i = 0; i < files.length; i++) {
        let url = fileName(new Date());
        var data = new FormData();
        data.append("url", url);
        data.append(
          "name",
          new Date().getTime() + this.GET_UID + Math.ceil(Math.random() * 10)
        );
        data.append("file", files[i]);
        api.uploadimg(data).then((res) => {
          const obj = {
            message: res,
            types: 1,
          };
          this.socket.emit("msg", obj,this.GET_UID, this.fid);
          console.log(res);
          var len = this.chatlist.length;
          let t = spaceTime(this.oldTime, new Date());
          if (t != "") {
            this.oldTime = t;
          }
          let Ntime = t;
          let time = dateTime(t);
          let msg = {
            fromId: this.GET_UID,
            imgurl: this.myimg,
            message: window.webkitURL.createObjectURL(files[i]),
            types: 1,
            time: time,
            Ntime: Ntime,
            id: len,
          };
          this.chatlist.push(msg);
          this.$nextTick(() => {
            this.scrollbottom();
          });
          let para = {
            fid: this.fid,
            uid: this.GET_UID,
            type: "add",
          };
          api.updateFriendStateIndex(para);
        });
      }
    },
    imgload(){
      // this.scrollbottom()
    },
    //消息修改已读
    updatemsg() {
      const obj = {
        fid: this.fid,
        uid: this.GET_UID,
        token: this.GET_TOKEN,
      };
      api.updatemsg(obj);
    },
    //接收socket推送的消息
    receivemsg() {
      this.socket.on("msg", (msg, fromid, tip) => {
        this.updatemsg();
        if (fromid == this.fid && tip == 0) {
          console.log(msg);
          let len = this.chatlist.length;
          let t = spaceTime(this.oldTime, new Date());
          if (t != "") {
            this.oldTime = t;
          }
          let Ntime = t;
          let time = dateTime(t);
          // if (msg.types == 1 || msg.types == 2) {
          // 	msg.message = this.serverUrl + msg.message
          // } else if (msg.types == 3) {
          // 	msg.message = JSON.parse(msg.message)
          // }
          let data = {
            fromId: fromid,
            imgurl: this.imgurl,
            message: msg.message,
            types: msg.types,
            time: time,
            second: msg.second,
            Ntime: Ntime,
            id: len,
          };
          this.chatlist.push(data);
          this.$nextTick(() => {
            this.scrollbottom();
          });
        }
      });
    },
    //发送消息
    sendmsg() {
      console.log(this.value);
      let data = {
        message: this.value,
        types: 0,
        imgurl: this.myimg,
        name: this.myname,
      };
      var len = this.chatlist.length;
      let t = spaceTime(this.oldTime, new Date());
      if (t != "") {
        this.oldTime = t;
      }
      let Ntime = t;
      let time = dateTime(t);
      let msg = {
        fromId: this.GET_UID,
        imgurl: this.myimg,
        message: this.value,
        types: 0,
        time: time,
        Ntime: Ntime,
        id: len,
      };
      this.chatlist.push(msg);
      this.value = ""
      this.$nextTick(() => {
        this.scrollbottom();
      });
      this.socket.emit("msg", data,this.GET_UID,this.fid);
      let para = {
        fid: this.fid,
        uid: this.GET_UID,
        type: "add",
      };
      api.updateFriendStateIndex(para);
    },
  },
};
</script>

<style scoped lang="scss">
::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  //滚动条的宽度
  width: 9px;
}
::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #dddddd;
  background-clip: padding-box;
  border-radius: 20px;
  height: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
.chatroom {
  flex: 1;
  border-right: 1px solid #f7f3f3;
  border-left: 1px solid #f7f3f3;
  position: relative;
  .head {
    width: 100%;
    height: 60px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f7f3f3;
    .name {
      padding-left: 50px;
      font-size: 25px;
      font-weight: bold;
    }
    img {
      width: 30px;
      padding-right: 20px;
    }
  }
  .chatpanel {
    p {
      font-size: 15px;
      color: #3399ff;
      cursor: pointer;
    }
    p:hover {
      text-decoration: underline;
    }
    overflow-y: auto;
    height: calc(100vh - 210px);
    .chat-ls {
      .chat-time {
        font-size: 15px;
        color: rgba(39, 40, 50, 0.3);
        line-height: 17px;
        padding: 10px 0;
        text-align: center;
      }

      .msg-m {
        display: flex;
        padding: 10px 0;

        .user-img {
          flex: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .message {
          max-width: 240px;
        }

        .msg-text {
          font-size: 16px;
          color: rgba(39, 40, 50, 1);
          line-height: 22px;
          padding: 8px 12px;
          word-wrap: break-word;
        }

        .voice {
          min-width: 60px;

          image {
            width: 45px;
            height: 25px;
          }
        }

        .map {
          background: #ffffff;
          width: 275px;

          .map-name {
            font-size: 16px;
            color: rgba(39, 40, 50, 1);
            line-height: 22px;
            padding: 9px 12px 0 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }

          .map-location {
            font-size: 16px;
            color: rgba(39, 40, 50, 0.4);
            padding: 0 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }

          image {
            padding: 2px;
            width: 275px;
            height: 150px;
          }
        }

        .msg-img {
          max-width: 200px;
        }
      }

      .msg-left {
        flex-direction: row;
        padding-left: 20px;

        .msg-text {
          margin-left: 8px;
          background-color: #ffffff;
          border-radius: 0 10px 10px 10px;
        }

        .voice {
          display: flex;
          justify-content: space-between;
        }

        .message-map {
          padding-left: 5px;
        }

        .msg-img {
          padding-left: 8px;
        }
      }

      .msg-right {
        flex-direction: row-reverse;

        .msg-text {
          margin-right: 8px;
          background-color: #3399ff;
          border-radius: 10px 0 10px 10px;
        }

        .voice {
          display: flex;
          justify-content: space-between;
          flex-direction: row-reverse;
        }

        .message-map {
          padding-right: 5px;
        }

        .msg-img {
          padding-right: 5px;
        }
      }
    }
  }
  .chatinput {
    width: 100%;
    height: 150px;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    .tools {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      .tool {
        display: flex;
        width: 25px;
        height: 25px;
        margin: 15px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        label {
          cursor: pointer;
        }
        input[type="file"] {
          position: absolute;
          visibility: hidden;
        }
      }
    }
    textarea {
      width: 95%;
      height: 75px;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 15px;
    }
    button {
      width: 70px;
      height: 30px;
      position: absolute;
      bottom: 10px;
      right: 50px;
    }
  }
}
</style>
