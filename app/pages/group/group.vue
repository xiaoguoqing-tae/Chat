<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center">
				<image src="../../static/logo-npm.png"></image>
			</view>
		</view>
		<view class="main">
			<view class="friend-list" v-for="(item,index) in grouplist" :key="index" v-if="item.state==1" @tap="a(item.gid,item.name,item.imgurl)">
				<view class="list-left">
					<image :src="serverUrl+item.imgurl"></image>
					<view class="message" v-if="item.tip>0">{{item.tip}}</view>
				</view>
				<view class="list-right">
					<view class="top">
						<view class="name">
							{{item.name}}
						</view>
						<view class="time">
							{{item.time}}
						</view>
					</view>
					<view class="bottom">{{item.msg}}</view>
				</view>
			</view>
			<view class="noOne" v-if="!friendList">
				<image src="../../static/noOne.png"></image>
				<text>一个能撩的都没有</text>
				<view class="sear_btn" @click="searchFriend()">进一个群</view>
			</view>
			<!-- <image style="width: 100%;" src="../../static/groupimg.jpg"></image> -->
		</view>
	</view>
</template>

<script>
	import {
		dateTime
	} from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				friendList: false,
				uid:"",
				gid:"",
				token:"",
				grouplist:[],
				tip:0
			}
		},
		onLoad() {
			this.getstorage()
			this.receiveSocketMsg()
			this.getgroup()
		},
		onPullDownRefresh() {
			this.getstorage()
			this.getgroup()
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
			navigateHandle(){
				this.getgroup()
			},
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.token = value.token
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			//获取群列表
			getgroup(){
				this.tip=0
				uni.request({
					url:this.serverUrl+"/index/getgroup",
					method:'POST',
					data:{
						uid:this.uid
					},
					success:(res)=>{
						this.grouplist=res.data.result
						console.log(this.grouplist)
						if(this.grouplist.length>0){
							this.friendList=true
							this.grouplist.forEach((item,index)=>{
								this.tip=this.tip+item.tip
								this.getgroupMsg(this.grouplist,index)
							})
							console.log(this.tip)
							setTimeout(()=>{
								if(this.tip>0){
									uni.setTabBarBadge({
									  index: 1,
									  text: String(this.tip)
									})
								}else{
									uni.removeTabBarBadge({
									  index: 1,
									})
								}
							})
						}					
					}
				})
			},
			//获取留言
			getgroupMsg(arr, i) {
				console.log(arr)
				uni.request({
					url: this.serverUrl + "/group/getlastgroupmsg",
					method: "POST",
					data: {
						gid: arr[i].gid,
						token: this.token
					},
					success: (res) => {
						if (res.data.status == 200) {
							let resData = res.data.result
							if (resData.types == 0) {
								resData.message = resData.name+':'+resData.message
							} else if (resData.types == 1) {
								resData.message =resData.name+" ：[图片]"
							} else if (resData.types == 2) {
								resData.message = resData.name+" ：[语音]"
							} else if (resData.types == 3) {
								resData.message = resData.name+" ：[位置]"
							}
							arr[i].msg = resData.message
							arr[i].time = dateTime(resData.time)
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
			//推送
			receiveSocketMsg(){
				this.socket.on('groupmsg',(msg,fromid,toid)=>{
					console.log(msg,fromid,toid)
					let nmsg = ''
					if(msg.types==0){
						nmsg=msg.message
					}else if(msg.types==1){
						nmsg = '[图片]'
					}else if(msg.types==2){
						nmsg = '[音频]'
					}else if(msg.types==3){
						nmsg = '[位置]'
					}
					for(let i=0;i<this.grouplist.length;i++){
						if(this.grouplist[i].gid==toid){
							let e = this.grouplist[i]
							console.log(e)
							e.lastTime = dateTime(new Date())
							e.msg = msg.name+":"+nmsg
							e.tip++
							this.tip++
							this.grouplist.splice(i,1)
							this.grouplist.unshift(e)
						}
					}
					uni.setTabBarBadge({
					  index: 1,
					  text: String(this.tip)
					})
				})
			},
			a(id,name,imgurl){
				uni.request({
					url: this.serverUrl + "/group/updatemsg",
					method: "POST",
					data: {
						gid: id,
						uid: this.uid,
						token: this.token
					},
					success:(res=>{
						uni.navigateTo({
							url:"../groupchat/groupchat?id="+id+"&img="+imgurl+"&name="+name
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		justify-content: center;
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

		.top-bar-center {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.top-bar-center image {
			width: 250rpx;
			height: 80rpx;
			margin: 0 auto;
		}
	}

	.main {
		margin-top: 150rpx;
		width: 100%;
		overflow: hidden;
	}

	.friend-list {
		padding: 20rpx 5rpx 10rpx 32rpx;
		width: 100%;
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
					padding-right: 44rpx;
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
</style>
