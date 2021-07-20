<template>
	<view class="content">
			<chunLei-popups v-model="value" :popData="data" @tapPopup="tapPopup" @input="back" :x="330" :y="50" placement="top-end">
					</chunLei-popups>
			<view class="top-bar">
			<view class="top-bar-left">
				<image :src="imgurl" @tap="toweather"></image>
			</view>
			<view class="top-bar-center">
				<image src="../../static/logo-npm.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @click="searchFriend()">
					<image src="../../static/search.png"></image>
				</view>
				<view class="add" @tap="buildgroup()">
					<image src="../../static/add.png" :class="rote"></image>
				</view>
			</view>
		</view>
		<view class="main">
			<navigator url="../chatman/chatman">
				<view class="friend-list">
					<view class="list-left">
						<image src="../../static/chatMan.png"></image>
					</view>
					<view class="list-right">
						<view class="top">
							<view class="name">
								憨批机器人
							</view>
							<view class="time" style="visibility: hidden;">
								11
							</view>
						</view>
						<view class="bottom">来和我聊天吧</view>
					</view>
				</view>
			</navigator>
		</view>

		<view class="chat-main" v-if="friendList">
			<view class="friend-require" v-if="requestData>0" @tap="requestPage()">
				<view class="list-left">
					<image src="../../static/friend-require.png"></image>
					<view class="message1">{{requestData}}</view>
				</view>
				<view class="list-right">
					<view class="top">
						<view class="name">
							好友请求
						</view>
						<view class="time">
							{{requestTime}}
						</view>
					</view>
					<view class="bottom">有好友请求，点击看看</view>
				</view>
			</view>
			<uni-swipe-action>
					<view class="friend-list" v-for="(item,index) in datalist" :key="index">
						<uni-swipe-action-item style="width: 100%;" :right-options="options" @tap.self="deleteFriend(item.id,index)">
						<view class="list-left" @tap="updateMsg(item)">
							<image :src="item.imgurl"></image>
							<view class="message" v-if="item.tip>0">{{item.tip}}</view>
						</view>
						<view class="list-right" @tap="updateMsg(item)">
							<view class="top">
								<view class="name">
									{{item.name}}
								</view>
								<view class="time">
									{{item.lastTime}}
								</view>
							</view>
							<view class="bottom">{{item.msg}}</view>
						</view>
						</uni-swipe-action-item>
					</view>			
			</uni-swipe-action>
		</view>
		<view class="noOne" v-if="!friendList">
			<image src="../../static/noOne.png"></image>
			<text>一个能撩的都没有</text>
			<view class="sear_btn" @click="searchFriend()">去撩一个</view>
		</view>
	</view>
</template>

<script>
	import data from "../../commons/data.js"
	import {
		uniSwipeAction,
		uniSwipeActionItem
	} from '@dcloudio/uni-ui'
	import {
		dateTime
	} from "../../commons/js/myfun.js"
	import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			chunLeiPopups
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				datalist: [],
				uid: "",
				imgurl: "",
				token: "",
				name: "",
				requestData: 0,
				requestTime: "",
				friendList: 0,
				tip: 0,
				weatherlist:[],
				address:"",
				zuobiao:"",
				rote:"",
				//气泡菜单参数
				value:false,
				data:[{'title':'创建群聊','icon':require("../../static/gchat.png")},{'title':'扫一扫','icon':require("../../static/sao.png")},{'title':'面对面快传','icon':require("../../static/chuan.png")}]
			}
		},
		onLoad() {
			this.getlocation()
			this.getstorage()
			this.getfriend()
			this.getapply()
			// uni.startPullDownRefresh();
			this.join(this.uid)
			this.receiveSocketMsg()
		},
		onPullDownRefresh() {
			this.getstorage()
			this.getfriend()
			this.getapply()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onBackPress() {
			var mainActivity = plus.android.runtimeMainActivity();
			mainActivity.moveTaskToBack(false);
			return true;
		},
		methods: {
			navigateHandle() {
				this.getfriend()
			},
			join(uid) {
				this.socket.emit("login", uid)
			},
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
							// this.imgurl = this.serverUrl + value.imgurl,
							this.token = value.token,
							this.name = value.name
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			//天气详情页
			toweather(){
				uni.navigateTo({
				    url: '../weather/weather?address='+this.address+"&zuobiao="+this.zuobiao
				});
			},
			//获取当前位置
			getlocation(){
				uni.getLocation({
				    type: 'gcj02',
					geocode:true,
				    success: (res=>{
						console.log(res)
						this.address=res.address.district
						this.zuobiao=res.longitude+","+res.latitude
						uni.request({
							url:"https://devapi.qweather.com/v7/weather/now",
							method:"GET",
							data:{
								location:res.longitude+","+res.latitude,
								key:"e93527738a544070b19e4fdf7842096a"
							},
							success:(res=>{
								uni.setStorage({
								    key: 'weather',
								    data: res.data,
								    success: function () {
								        console.log('success');
								    }
								});
								this.imgurl="../../static/color-128/"+res.data.now.icon+".png"
							})
						})
					})
				});
			},
			deleteFriend(id,i){
				uni.showModal({
				    title: '提示',
				    content: '确定要删除这段友谊?',
				    success:(res=>{
						if (res.confirm) {
						    uni.request({
								url:this.serverUrl+"/friend/deletefriend",
								method:'POST',
								data:{
									uid:this.uid,
									fid:id,
									token:this.token
								},
								success:(res=>{
									if(res.data.status==200){
										this.datalist.splice(i,1)
									}else{
										uni.showToast({
											title:"服务器出错",
											icon:'none'
										})
									}
								})
							})
						} else if (res.cancel) {
						    console.log('用户点击取消');
						}
					})			        
				});
			},
			//获取好友
			getfriend() {
				this.tip = 0
				uni.request({
					url: this.serverUrl + "/index/getfriend",
					method: "POST",
					data: {
						uid: this.uid,
						state: 0,
						token: this.token
					},
					success: (res) => {
						this.datalist = res.data.result
						console.log(this.datalist)
						if (res.data.status == 200) {
							if (res.data.result.length > 0) {
								this.friendList = 1
								this.requestTime = dateTime(res.data.result[0].lastTime)
								res.data.result.forEach((item, index) => {
									item.imgurl = this.serverUrl + item.imgurl,
										item.lastTime = dateTime(item.lastTime)
									this.getMsg(res.data.result, index)
									this.getunreadMsg(res.data.result, index)
								})
								setTimeout(() => {
									if (this.tip > 0) {
										uni.setTabBarBadge({
											index: 0,
											text: String(this.tip)
										})
									} else {
										uni.removeTabBarBadge({
											index: 0,
										})
									}
								}, 100)
							}
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
			//获取留言
			getMsg(arr, i) {
				uni.request({
					url: this.serverUrl + "/index/getlastmsg",
					method: "POST",
					data: {
						fid: arr[i].id,
						uid: this.uid,
						token: this.token
					},
					success: (res) => {
						if (res.data.status == 200) {
							console.log(res.data)
							let resData = res.data.result
							if (resData.types == 0) {
								//文字
							} else if (resData.types == 1) {
								resData.message = "[图片]"
							} else if (resData.types == 2) {
								resData.message = "[语音]"
							} else if (resData.types == 3) {
								resData.message = "[位置]"
							}
							arr[i].msg = resData.message
							arr.splice(i, 1, arr[i])
						} else if (res.data.status == 500) {
							uni.showToast({
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
			//获取申请记录
			getapply() {
				uni.request({
					url: this.serverUrl + "/index/getfriend",
					method: "POST",
					data: {
						uid: this.uid,
						state: 1,
						token: this.token
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 200) {
							this.requestData = res.data.result.length;
							if (res.data.result.length > 0) {
								this.friendList = 1
								this.requestTime = dateTime(res.data.result[0].lastTime)
								res.data.result.forEach(item => {
									if (this.requestTime < item.lastTime) {
										this.requestTime = dateTime(item.lastTime)
									}
								})
							}
						} else {
							uni.showToast({
								title: "服务器错误",
								icon: "none"
							})
						}
					}
				})
			},
			//获取消息未读数
			getunreadMsg(arr, i) {
				uni.request({
					url: this.serverUrl + "/index/unreadmsg",
					method: "POST",
					data: {
						fid: arr[i].id,
						uid: this.uid,
						token: this.token
					},
					success: (res) => {
						if (res.data.status == 200) {
							let resData = res.data.result
							arr[i].tip = resData
							this.tip = this.tip + resData
							arr.splice(i, 1, arr[i])
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
			//已读
			updateMsg(data) {
				uni.request({
					url: this.serverUrl + "/index/updatemsg",
					method: "POST",
					data: {
						fid: data.id,
						uid: this.uid,
						token: this.token
					},
					success: (res) => {
						if (res.data.status == 200) {
							uni.navigateTo({
								url: "../chatroom/chatroom?id=" + data.id + "&img=" + data.imgurl + "&name=" + data.name
							})
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
				this.socket.on('msg', (msg, fromid) => {
					console.log(msg)
					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[音频]'
					} else if (msg.types == 3) {
						nmsg = '[位置]'
					}
					for (let i = 0; i < this.datalist.length; i++) {
						if (this.datalist[i].id == fromid) {
							let e = this.datalist[i]
							e.lastTime = dateTime(new Date())
							e.msg = nmsg
							e.tip++
							this.tip++
							this.datalist.splice(i, 1)
							this.datalist.unshift(e)
						}
					}
					uni.setTabBarBadge({
						index: 0,
						text: String(this.tip)
					})
				})
			},
			requestPage() {
				uni.navigateTo({
					url: "../request/request"
				})
			},
			searchFriend() {
				uni.navigateTo({
					url: '../search/search',
					animationType: 'slide-in-right',
					animationDuration: 200
				});
			},
			buildgroup() {
				this.rote = "rote"
				this.value = true
			},
			//气泡菜单点击
			tapPopup(val){
				if(val.title=="创建群聊"){
					uni.navigateTo({
						url: '../buildgroup/buildgroup?userId=' + this.uid + "&username=" + this.name,
						animationType: 'slide-in-right',
						animationDuration: 200
					});
				}
			},
			back(val){
				this.rote = "rote1"
			}
		}
	}
</script>

<style lang="scss">
	.rote{
		transition: all 0.5s !important;
		transform: rotate(90deg);
	}
	.rote1{
		transition: all 0.5s !important;
		transform: rotate(-90deg);
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.top-bar {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 150rpx;
		padding-right: 50rpx;
		padding-left: 32rpx;
		box-sizing: border-box;
		background: $uni-bg-color;
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 1;
		padding-top: var(--status-bar-height);

		.top-bar-left {
			width: 68rpx;
		}

		.top-bar-left image {
			width: 88rpx;
			height: 88rpx;
			border-radius: 16rpx;

		}

		.top-bar-center {
			flex: 1;
			text-align: center;
		}

		.top-bar-center image {
			width: 250rpx;
			height: 80rpx;
			margin: 0 auto;
		}

		.top-bar-right {
			display: flex;
			align-items: center;
			width: 140rpx;

			.search {
				width: 52rpx;
				height: 52rpx;
				margin-right: 40rpx;

				image {
					width: 52rpx;
					height: 52rpx;
				}
			}

			.add {
				width: 48rpx;
				height: 48rpx;

				image {
					width: 52rpx;
					height: 52rpx;
				}
			}
		}
	}

	.chat-main {
		width: 100%;
		overflow: hidden;
	}

	.main {
		margin-top: 150rpx;
		width: 100%;
		overflow: hidden;
	}

	.friend-list,
	.friend-require {
		padding: 20rpx 5rpx 10rpx 32rpx;
		// width: 100%;
		// height: 96rpx;
		display: flex;

		&:active {
			background: #F3F4F6;
		}

		.list-left {
			float: left;
			position: relative;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 16rpx;
			}

			.message {
				position: absolute;
				color: #FFFFFF;
				background: #FF5D5B;
				border-radius: 50%;
				width: 40rpx;
				height: 40rpx;
				font-size: 24rpx;
				text-align: center;
				top: -12rpx;
				left: 70rpx;
			}

			.message1 {
				position: absolute;
				color: #FFFFFF;
				background: #3399FF;
				border-radius: 50%;
				width: 40rpx;
				height: 40rpx;
				font-size: 24rpx;
				text-align: center;
				top: -12rpx;
				left: 70rpx;
			}
		}

		.list-right {
			flex: 1;
			display: flex;
			flex-direction: column;
			float: left;
			padding-left: 24rpx;

			.top {
				.name {
					float: left;
					font-size: 36rpx;
					color: #272832;
				}

				.time {
					float: right;
					padding-right: 5rpx;
					font-size: 24rpx;
					color: rgba(39, 40, 50, 0.40);
				}
			}

			.bottom {
				width: 80%;
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.60);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				margin-top: 10rpx;
			}
		}
	}

	// }

	.noOne {
		display: flex;
		flex-direction: column;
		align-items: center;
		font: 14rpx;
		color: rgba(39, 40, 50, 0.60);

		text {
			padding: 50rpx;
		}

		image {
			width: 158rpx;
			height: 250rpx;
			padding-top: 300rpx;
		}

		.sear_btn {
			text-align: center;
			line-height: 96rpx;
			width: 240rpx;
			height: 96rpx;
			background: #5EA9C9;
			border-radius: 24rpx;
			box-shadow: 0 26px 18px -16px
		}
	}
	/deep/.button-group--right{
		right: -2px;
	}
	/deep/.uni-swipe{
		overflow: visible;
	}
</style>
