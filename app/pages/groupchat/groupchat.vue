<template>
	<div class="content">
		<view class="head">
			{{gname}}
			<image class="left" src="../../static/fanhui.png" @tap="navback"></image>
			<image class="right" :src="gimg" @tap="detail"></image>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollintoView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputHeight+'px'}">
				<view class="loading" v-if="loading">
					<image src="../../static/loading.gif"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msg" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.Ntime !=''" >{{item.time}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!=uid">
						<image :src="item.imgurl" class="user-img" @tap="friendInfo(item.fromId)"></image>
						<view class="message" v-if="item.types=='0'">
							<view class="msg-name">{{item.name}}</view>
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types=='1'">
							<view class="msg-name">{{item.name}}</view>
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="preview(item.message)"></image>
						</view>
						<view class="message" v-if="item.types=='2'">
							<view class="msg-name">{{item.name}}</view>
							<view class="msg-text voice" :style="{width:item.second*3+'px'}" @tap="playVoice(item.message)">
								<image src="../../static/voice.png"></image>
								<text>{{item.second}}"</text>
							</view>
						</view>
						<view class="message-map" v-if="item.types=='3'">
							<view class="msg-name">{{item.name}}</view>
							<view class="map">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-location">{{item.message.address}}</view>
								<image src="../../static/unnamed.jpg"></image>
							</view>
						</view>
					</view>	
					<view class="msg-m msg-right" v-if="item.fromId==uid">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types=='0'">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types=='1'">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="preview(item.message)"></image>
						</view>
						<view class="message" v-if="item.types=='2'">
							<view class="msg-text voice" :style="{width:item.second*3.5+'px'}" @tap="playVoice(item.message)">
								<image src="../../static/voice.png"></image>
								<text>{{item.second}}"</text>
							</view>
						</view>
						<view class="message-map" v-if="item.types=='3'">
							<view class="map">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-location">{{item.message.address}}</view>
								<image src='../../static/unnamed.jpg'></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<chatSubmit @inputs="inputs" @heights="heights"></chatSubmit>
	</div>
</template>

<script>
	import {dateTime,fileName,formatDateTime,spaceTime} from "../../commons/js/myfun.js"
	import datas from "../../commons/data.js"
	import chatSubmit from "../../components/submit/submit.vue"
	export default {
		data() {
			return {
				msg: [],
				msg0:[],
				scrollintoView: "",
				previewList:[],
				inputHeight:"60",
				uname:"",
				uid:"",
				uimgurl:"",
				gname:"",
				gimg:"",
				gid:"",
				nowpage:0,
				pageSize:10,
				loading:false,
				token:"",
				oldTime:new Date(),
			}
		},
		components: {
			chatSubmit
		},
		onLoad(e) {
			this.getstorage()
			this.gid = e.id
			this.gname = e.name
			this.gimg = this.serverUrl+e.img
			console.log(this.gimg)
			this.getMsg()
			this.receiveSocketMsg()
		},
		onBackPress(){
			this.navback()
			return true
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.uimgurl = this.serverUrl + value.imgurl,
						this.token = value.token,
						this.uname = value.name
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			navback(){
				uni.switchTab({
					url:"/pages/group/group",
					success(e) {
					    var page = getCurrentPages().pop();
						console.log(page)
					    if (page == undefined || page == null) return;
					    page.$vm.navigateHandle();
					}
				})
			},
			detail(){
				uni.navigateTo({
					url:"../groupdetail/groupdetail?id="+this.gid+"&img="+this.gimg+"&name="+this.gname
				})
			},
			getMsg(page) {
				uni.request({
					url:this.serverUrl+"/chat/groupmsg",
					data:{
						gid:this.gid,
						nowPage:this.nowpage,
						pageSize:this.pageSize,
						token:this.token
					},
					method:'POST',
					success:(data)=> {
						let status = data.data.status
						if(status==200){
							// this.msg0=data.data.result;
							let msg = data.data.result;
							if(msg.length>0){
								let msgs = []
								for(var i=msg.length-1;i>=0;i--){							
									msg[i].imgurl = this.serverUrl+msg[i].imgurl;
									let t = spaceTime(this.oldTime,msg[i].time)
									if(t!=""){
										this.oldTime=t
									}
									msg[i].Ntime = t
									msg[i].time= dateTime(t)
									if (msg[i].types == "1") {
										msg[i].message = this.serverUrl + msg[i].message
										this.previewList.unshift(msg[i].message)
									}
									if (msg[i].types == "3") {
										msg[i].message = JSON.parse(msg[i].message)
									}
									msgs.push(msg[i])
									console.log(this.msg)
									this.loading=false
								}
								if(this.nowpage>0){
									for(let i=msgs.length-1;i>=0;i--){
										this.msg.unshift(msgs[i])						
									}
								}else{
									for(let i=0;i<msgs.length;i++){
										this.msg.push(msgs[i])						
									}
								}
							}
							console.log(this.msg)
							if(msg.length==10){
								this.nowpage++
							}else{
								this.nowpage=-1
							}
							this.$nextTick(function(){
								this.scrollintoView ='msg'+this.msg[msg.length-1].id
							})
						}else if(status==500){
							uni.showToast({
								title:'服务出错了',
								icon:'none',
								duration:2000
							})
						}else if(status == 300){
							uni.navigateTo({
								url: "../login/login"
							})
						}
					}
				})
			},
			nextPage(){
				if(this.nowpage>-1){
					this.loading = true
					setTimeout(()=>{
						this.getMsg(this.nowpage)
					},1000)				
				}else{
					this.loading=false
				}
			},
			preview(e) {
				let index
				for(let i=0;i<this.previewList.length;i++){
					if(this.previewList[i]==e){
						index=i
					}
				}
				// 预览图片
				uni.previewImage({
					current:index,
					urls: this.previewList,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			playVoice(e){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.serverUrl+e
				innerAudioContext.onPlay(() => {					
					console.log('开始播放');
				});
			},
			inputs(e){
				this.receiveMsg(e,this.uid,this.uimgurl,0)
			},
			receiveMsg(e,id,img,tip){
				if(e.types==0 || e.types==3){
					this.sendsocket(e)
				}else if(e.types==1){
					this.previewList.push(e.message)
					var url = fileName(new Date());
					const uploadTask = uni.uploadFile({
						url:this.serverUrl+'/files/upload',
						filePath:e.message,
						name:'file',
						formData:{
							url:url,
							name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
						},
						success:(UploadFileRes)=>{
							console.log(UploadFileRes)
							let data = {
								message:UploadFileRes.data,
								types:1
							}
							this.sendsocket(data)
						}
					})
				}else if(e.types==2){
					var url = fileName(new Date());
					const uploadTask = uni.uploadFile({
						url:this.serverUrl+'/files/upload',
						filePath:e.message.voice,
						name:'file',
						formData:{
							url:url,
							name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
						},
						success:(UploadFileRes)=>{
							console.log(UploadFileRes)
							let data = {
								message:UploadFileRes.data,
								second:e.message.second,
								types:2
							}
							this.sendsocket(data)
						}
					})
				}
				if(e.types==3){
					e.message=JSON.parse(e.message)
				}
				var len = this.msg.length
				let t = spaceTime(this.oldTime,new Date())
				if(t!=""){
					this.oldTime=t
				}
				let Ntime = t
				let time= dateTime(t)
				console.log(this.oldTime,Ntime,time)
				let data={}
				if(e.types==2){
					data = {
						fromId:id,
						imgurl:img,
						message:this.serverUrl+e.message.voice,
						second:e.message.second,
						types:e.types,
						time:time,
						Ntime:Ntime,
						id:len
					}
				}else{
					data = {
						fromId:id,
						imgurl:img,
						message: e.message,
						types:e.types,
						time:time,
						Ntime:Ntime,
						id:len
					}
				}
				
				this.msg.push(data)	
				console.log(this.msg)
				this.$nextTick(function(){
					this.scrollintoView ='msg'+this.msg[len].id
				})	
			},
			//已读
			updateMsg() {
				uni.request({
					url: this.serverUrl + "/group/updatemsg",
					method: "POST",
					data: {
						gid: this.gid,
						uid: this.uid,
						token: this.token
					},
					success: (res) => {
						if (res.data.status == 200) {
							
						} else if (res.data.status == 500) {
							mui.showToast({
								title: "服务器错误",
								icon: "none"
							})
						} else if (res.data.status == 300) {
							uni.navigateTo({
								url: "../login/login"
							})
						}
					}
				})
			},
			receiveSocketMsg(){
				this.socket.on('groupmsg',(msg,fromid,tip)=>{		
					this.updateMsg()
					if(fromid!==this.uid){
						console.log(msg)
						let len = this.msg.length;
						let nowTime = dateTime(new Date())
						if(msg.types==1 || msg.types==2){
							msg.message = this.serverUrl + msg.message
						}else if(msg.types==3){
							msg.message=msg.message
						}
						let data = {
							fromId:fromid,
							imgurl:this.serverUrl+msg.imgurl,
							message:msg.message,
							types:msg.types,
							second:msg.second,
							time:nowTime,
							id:len,
						}
						this.msg.push(data)
						if(msg.types==1){
							this.previewList.push(msg.message)
						}
						this.$nextTick(function(){
							this.scrollintoView ='msg'+this.msg[len].id
						})	
					}		
				})
			},
			friendInfo(id){
				uni.navigateTo({
					url: '../userhome/userhome?friendId='+id+"&isfriendNum=4"
				});
			},
			sendsocket(e){
				this.socket.emit("groupmsg",e,this.uid,this.gid)
			},
			heights(e){
				this.inputHeight=e
				console.log(this.inputHeight)
				this.getBottom()
			},
			getBottom(){
				this.scroll_height=
				this.scrollintoView=""
				var len = this.msg.length-1
				this.$nextTick(function(){
					this.scrollintoView ='msg'+this.msg[len].id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background: rgba(244, 244, 244, 1);
	}

	.head {
		width: 100%;
		height: 88rpx;
		text-align: center;
		position: fixed;
		top: 0;
		z-index: 100;
		line-height: 88rpx;
		border-bottom: 1px solid $uni-border-color;
		background: rgba(244, 244, 244, 0.96);
		padding-top:  var(--status-bar-height);
		.left {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;

		}
		.right {
			padding-top:  var(--status-bar-height);
			width: 68rpx;
			height: 68rpx;
			position: absolute;
			right: 32rpx;
			top: 10rpx;
			border-radius: $uni-border-radius-base;
		}
	}
	.mask{
		position: fixed;
		top:0;
		left:0;
		z-index:999;
		width:100%;
		height:100vh;
		background:#211a4a;
		text-align: center;
		.time_second{
			padding-top: 800rpx;
			font-size: 100rpx;
			color: #FFFFFF;
		}
	}

	.content {
		height: 100%;
		
	}

	.chat {
		height: 100%;
		padding-top: var(--status-bar-height);
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 80rpx;
			// padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;

				.user-img {
					flex: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}

				.message {
					max-width: 480rpx;
				}

				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 16rpx 24rpx;
					word-wrap: break-word;
				}
				.voice{
					min-width: 120rpx;
					image{
						width: 90rpx;
						height: 50rpx;
					}
				}
				.map{
					background: #FFFFFF;
					width: 550rpx;
					.map-name{
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display:-webkit-box; 
						-webkit-box-orient:vertical; 
						-webkit-line-clamp:1; 
					}
					.map-location{
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0 24rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display:-webkit-box; 
						-webkit-box-orient:vertical; 
						-webkit-line-clamp:1; 
					}
					image{
						padding: 5rpx;
						width: 550rpx;
						height: 300rpx;
					}
				}
				.msg-img {
					max-width: 400rpx;
				}
			}
			.msg-left {
				flex-direction: row;
				.msg-name {
					text-align: left;
					font-size: 20rpx;
					margin-left: 16rpx;
					color: $uni-text-color-placeholder;
				}
				.msg-text {
					margin-left: 16rpx;
					background-color: #FFFFFF;
					border-radius: 0 20rpx 20rpx 20rpx;
					;
				}
				.voice{
					display: flex;
					justify-content: space-between;
				}
				.message-map{
					padding-left: 10rpx;
				}
				.msg-img {
					padding-left: 16rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background-color: #3399FF;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
				.voice{
					
					display: flex;
					justify-content: space-between;
					flex-direction: row-reverse;
				}
				.message-map{
					padding-right: 10rpx;
				}
				.msg-img {
					padding-right: 16rpx;
				}
			}
		}
	}
	.loading{
		text-align: center;
		image{
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
