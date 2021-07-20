<template>
	<div class="content">
		<view class="head">
			{{fname}}
			<image class="left" src="../../static/fanhui.png" @tap="navback"></image>
			<!-- <image class="right" src="../../static/4.jpg"></image> -->
		</view>
		<!-- <scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollintoView"
		 @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputHeight+'px'}">
				<view class="loading" v-if="loading">
					<image src="../../static/loading.gif"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msg" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.Ntime !=''">{{item.time}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!=uid">
						<image :src="item.imgurl" class="user-img" @tap="friendInfo()"></image>
						<view class="message" v-if="item.types=='0'">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types=='1'">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="preview(item.message)"></image>
						</view>
						<view class="message" v-if="item.types=='2'">
							<view class="msg-text voice" :style="{width:item.second*3+'px'}" @tap="playVoice(item.message)">
								<image src="../../static/voice.png"></image>
								<text>{{item.second}}"</text>
							</view>
						</view>
						<view class="message-map" v-if="item.types=='3'">
							<view class="map" @tap=lookMap(item)>
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
							<view class="map" @tap=lookMap(item)>
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-location">{{item.message.address}}</view>
								<image src='../../static/unnamed.jpg'></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view> -->
		<view class="chat">
			<view class="chat-main" :style="{paddingBottom:inputHeight+'px'}">
				<view class="loading" v-if="loading">
					<image src="../../static/loading.gif"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msg" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.Ntime !=''">{{item.time}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!=uid">
						<image :src="item.imgurl" class="user-img" @tap="friendInfo()"></image>
						<view class="message" v-if="item.types=='0'">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types=='1'">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="preview(item.message)"></image>
						</view>
						<view class="message" v-if="item.types=='2'">
							<view class="msg-text voice" :style="{width:item.second*3+'px'}" @tap="playVoice(item.message)">
								<image src="../../static/voice.png"></image>
								<text>{{item.second}}"</text>
							</view>
						</view>
						<view class="message-map" v-if="item.types=='3'">
							<view class="map" @tap=lookMap(item)>
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
							<view class="map" @tap=lookMap(item)>
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-location">{{item.message.address}}</view>
								<image src='../../static/unnamed.jpg'></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<chatSubmit @inputs="inputs" @heights="heights"></chatSubmit>
	</div>
</template>

<script>
	import {
		dateTime,
		fileName,
		formatDateTime,
		spaceTime
	} from "../../commons/js/myfun.js"
	import datas from "../../commons/data.js"
	import chatSubmit from "../../components/submit/submit.vue"
	export default {
		data() {
			return {
				msg: [],
				scrollintoView: "",
				previewList: [],
				inputHeight: "60",
				uname: "",
				uid: "",
				uimgurl: "",
				fname: "",
				fimg: "",
				fid: "",
				nowpage: 0,
				pageSize: 10,
				loading: true,
				token: "",
				oldTime: new Date()
			}
		},
		components: {
			chatSubmit
		},
		onLoad(e) {
			this.getstorage()
			this.fid = e.id
			this.fname = e.name
			this.fimg = e.img
			this.getHistoryMsg()
			this.receiveSocketMsg()
		},
		onBackPress(){
			this.navback()
			return true
		},
		onPageScroll(e) {
			if(e.scrollTop<5){
				this.nextPage()
			}
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
			navback() {
				uni.switchTab({
					url: "../index/index",
					success(e) {
					    var page = getCurrentPages().pop();
					    if (page == undefined || page == null) return;
					    page.$vm.navigateHandle();					
					}
				})
				// uni.reLaunch({
				// 	url:"../index/index"
				// })
			},
			getHistoryMsg(){
				if(!this.loading){
					return
				}
				let get = async ()=> {
					let data = await this.getMsg(this.nowpage)
					console.log(data)
					// 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
					let selector = '';
										
					if(this.nowpage>1){
						// 非第一页，则取历史消息数据的第一条信息元素
						selector = `#msg${this.msg[0].id}`;
					}else{
						// 第一页，则取当前消息数据的最后一条信息元素
						selector = `#msg${data[data.length-1].id}`;
					}
					
					// 将获取到的消息数据合并到消息数组中
					this.msg = [...data,...this.msg];	
					
					// 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
					this.$nextTick(()=>{
						// 设置当前滚动的位置
						this.setPageScrollTo(selector);					
						if(data.length < this.pageSize){
							// 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
							// 可在此处编写无更多消息数据时的逻辑
						}else{
							// 延迟 200ms ，以保证设置窗口滚动已完成
							this.loading = false
						}
					})
				}
				get();
			},
			getMsg(page) {
				return new Promise((resolve,reject)=>{
					uni.request({
						url: this.serverUrl + "/chat/msg",
						data: {
							uid: this.uid,
							fid: this.fid,
							nowPage: this.nowpage,
							pageSize: this.pageSize,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							let msgs = []
							if (status == 200) {
								let msg = data.data.result;
								if (msg.length > 0) {
									for (var i = msg.length - 1; i >= 0; i--) {
										let t = spaceTime(this.oldTime, msg[i].time)
										if (t != "") {
											this.oldTime = t
										}
										msg[i].Ntime = t
										msg[i].time = dateTime(t)
										msg[i].imgurl = this.serverUrl + msg[i].imgurl;
										if (msg[i].types == "1") {
											msg[i].message = this.serverUrl + msg[i].message
											this.previewList.unshift(msg[i].message)
										}
										if (msg[i].types == "3") {
											msg[i].message = JSON.parse(msg[i].message)
										}
										msgs.push(msg[i])
										this.loading = false
									}
									// if (this.nowpage > 0) {
									// 	for (let i = msgs.length - 1; i >= 0; i--) {
									// 		this.msg.unshift(msgs[i])
									// 	}
									// } else {
									// 	for (let i = 0; i < msgs.length; i++) {
									// 		this.msg.push(msgs[i])
									// 	}
									// }
								}
								if (msg.length == 10) {
									this.nowpage++
								} else {
									this.nowpage = -1
								}
								// this.$nextTick(function() {
								// 	this.scrollintoView = 'msg' + this.msg[msg.length - 1].id
								// })
								console.log(msgs)
								resolve(msgs)
							} else if (status == 500) {
								uni.showToast({
									title: '服务出错了',
									icon: 'none',
									duration: 2000
								})
							} else if (status == 300) {
								uni.navigateTo({
									url: "../login/login"
								})
							}
						}
					})
				})
			},
			getMsg1(page) {
				let msg = datas.message()
				let maxpages = msg.length
				if (msg.length > (page + 1) * 10) {
					this.nowpage++
					maxpages = (page + 1) * 10
				} else {
					this.nowpage = -1
				}
				for (var i = page * 10; i < (page + 1) * 10; i++) {
					msg[i].time = dateTime(msg[i].time)
					msg[i].imgurl = "../../static/" + msg[i].imgurl
					if (msg[i].types == "1") {
						msg[i].message = "../../static/" + msg[i].message
						this.previewList.unshift(msg[i].message)
					}
					this.msg.unshift(msg[i])
					this.loading = false
				}
				this.$nextTick(function() {
					this.scrollintoView = 'msg' + this.msg[maxpages - page * 10 - 1].tip
				})

			},
			nextPage() {
				if (this.nowpage > -1) {
					this.loading = true
					setTimeout(() => {
						this.getHistoryMsg()
					}, 1000)
				} else {
					this.loading = false
				}
			},
			// 设置页面滚动位置
			setPageScrollTo(selector){
				let view = uni.createSelectorQuery().in(this).select(selector);
				view.boundingClientRect((res) => {
					uni.pageScrollTo({
					    scrollTop:res.top - 30,	// -30 为多显示出大半个消息的高度，示意上面还有信息。
					    duration: 0
					});
				}).exec();
			},
			preview(e) {
				let index
				for (let i = 0; i < this.previewList.length; i++) {
					if (this.previewList[i] == e) {
						index = i
					}
				}
				// 预览图片
				uni.previewImage({
					current: index,
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
			playVoice(e) {
				console.log("点击播放")
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				let pd = e.slice(0,1)
				if(pd=='_'){
					innerAudioContext.src = e
				}else{
					innerAudioContext.src = this.serverUrl+e
				}			
				innerAudioContext.onPlay(() => {

					console.log('开始播放');
				});
			},
			inputs(e) {
				console.log("进来")
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
			},
			receiveMsg(e, id, img, tip) {
				console.log(e)
				if (e.types == 0 || e.types == 3) {
					this.sendsocket(e)
				} else if (e.types == 1) {
					this.previewList.push(e.message)
					var url = fileName(new Date());
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
						},
						success: (UploadFileRes) => {
							console.log(UploadFileRes)
							let data = {
								message: UploadFileRes.data,
								types: 1
							}
							this.sendsocket(data)
						}
					})
				} else if (e.types == 2) {
					var url = fileName(new Date());
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message.voice,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
						},
						success: (UploadFileRes) => {
							console.log(UploadFileRes)
							let data = {
								message: UploadFileRes.data,
								second:e.message.second,
								types: 2
							}
							this.sendsocket(data)
						}
					})
				}
				if (e.types == 3) {
					e.message = JSON.parse(e.message)
				}
				var len = this.msg.length
				let t = spaceTime(this.oldTime, new Date())
				if (t != "") {
					this.oldTime = t
				}
				let Ntime = t
				let time = dateTime(t)
				let data = {}
				if(e.types==2){
					data = {
						fromId: id,
						imgurl: img,
						message:e.message.voice,
						second:e.message.second,
						types: e.types,
						time: time,
						Ntime: Ntime,
						id: len
					}
				}else{
					data = {
						fromId: id,
						imgurl: img,
						message: e.message,
						types: e.types,
						time: time,
						Ntime: Ntime,
						id: len
					}
				}
				this.msg.push(data)
				console.log(this.msg)
				this.$nextTick(function(){
					uni.pageScrollTo({
						scrollTop:9999999,
						duration:200
					})
				})
				// this.$nextTick(function() {
				// 	this.scrollintoView = 'msg' + this.msg[len].id
				// })
			},
			//已读
			updateMsg() {
				uni.request({
					url: this.serverUrl + "/index/updatemsg",
					method: "POST",
					data: {
						fid: this.fid,
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
			receiveSocketMsg() {
				this.socket.on('msg', (msg, fromid, tip) => {
					this.updateMsg()
					if (fromid == this.fid && tip == 0) {
						console.log(msg)
						let len = this.msg.length;
						let t = spaceTime(this.oldTime,new Date())
						if(t!=""){
							this.oldTime=t
						}
						let Ntime = t
						let time= dateTime(t)
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message
						} else if (msg.types == 3) {
							msg.message = JSON.parse(msg.message)
						}
						let data = {
							fromId: fromid,
							imgurl: this.fimg,
							message: msg.message,
							types: msg.types,
							time:time,
							second:msg.second,
							Ntime:Ntime,
							id: len,
						}
						this.msg.push(data)
						if (msg.types == 1) {
							this.previewList.push(msg.message)
						}
						this.$nextTick(function(){
							uni.pageScrollTo({
								scrollTop:9999999,
								duration:200
							})
						})
						// this.$nextTick(function() {
						// 	this.scrollintoView = 'msg' + this.msg[len].id
						// })
					}
				})
			},
			friendInfo() {
				uni.navigateTo({
					url: '../userhome/userhome?friendId=' + this.fid + "&isfriendNum=4"
				});
			},
			sendsocket(e) {
				this.socket.emit("msg", e, this.uid, this.fid)
			},
			heights(e) {
				this.inputHeight = e
				console.log(this.inputHeight)
				this.getBottom()
			},
			getBottom() {
				this.$nextTick(function(){
					uni.pageScrollTo({
						scrollTop:9999999,
						duration:200
					})
				})
			},
			lookMap(item) {
				console.log(item)
				uni.openLocation({
					latitude: item.message.latitude,
					longitude: item.message.longitude,
					success: function() {
						console.log('success');
					}
				});
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
		padding-top: var(--status-bar-height);

		.left {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;

		}

		.right {
			width: 68rpx;
			height: 68rpx;
			position: absolute;
			right: 32rpx;
			top: var(--status-bar-height);
			border-radius: $uni-border-radius-base;
		}
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100vh;
		background: #211a4a;
		text-align: center;

		.time_second {
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

				.voice {
					min-width: 120rpx;

					image {
						width: 90rpx;
						height: 50rpx;
					}
				}

				.map {
					background: #FFFFFF;
					width: 550rpx;

					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}

					.map-location {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0 24rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}

					image {
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

				.msg-text {
					margin-left: 16rpx;
					background-color: #FFFFFF;
					border-radius: 0 20rpx 20rpx 20rpx;
					;
				}

				.voice {
					display: flex;
					justify-content: space-between;
				}

				.message-map {
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

				.voice {

					display: flex;
					justify-content: space-between;
					flex-direction: row-reverse;
				}

				.message-map {
					padding-right: 10rpx;
				}

				.msg-img {
					padding-right: 16rpx;
				}
			}
		}
	}

	.loading {
		text-align: center;

		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
