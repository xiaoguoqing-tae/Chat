<template>
	<div class="container">
		<view class="head">
			<image class="img1" src="../../static/fanhui.png" @click="navBack()"></image>
			<image class="img2" src="../../static/more.png"></image>
		</view>
		<view class="bg">
			<image :src="imgurl" class="bg_img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user_head">
				<image :src="imgurl" class="user_img" mode="aspectFill" :animation="animateData2"></image>
				<view class="sex_box" :animation="animateData3" v-if="isgroupMsg">
					<image :src="seximg" class="sex" :style="{background:sexbg}"></image>
				</view>
			</view>
			<view class="user_imf">
				<view class="rename">{{markname}}</view>
				<view class="username">昵称：{{fname}}</view>
				<view class="user_txt">{{noice}}</view>
			</view>
		</view>
		<view class="btn" v-if="isnumCode==1">
			<view class="bottom_btn1" @tap="tosendMsg">发送消息</view>
		</view>
		<view class="btn" v-if="isnumCode==0">
			<view class="bottom_btn" @tap="addFriendAnimate">加为好友</view>
		</view>
		<view class="btn" v-if="isnumCode==3">
			<view class="bottom_btn1" @tap="tosendGroupMsg">发送消息</view>
		</view>
		<view class="btn" v-if="isnumCode==2">
			<view class="bottom_btn" @tap="addFriendAnimate">申请入群</view>
		</view>
		<view v-if="isbound" class="content" :style="{height:addHeight+'px',bottom:-addHeight+'px'}" :animation="animateData">
			<view class="name">{{fname}}</view>
			<textarea class="add_main" :value="friendMsg"></textarea>
		</view>
		<view class="bottom_bar" :animation="animateData1">
			<view class="close" @tap="addFriendAnimate">
				取消
			</view>
			<view class="send" @tap="addFriend">
				发送
			</view>
		</view>
	</div>
	
</template>

<script>
	export default {
		data() {
			return {
				addHeight: "",
				animateData: {},
				animateData1: {},
				animateData2: {},
				animateData3: {},
				isAdd: false,
				// is_show:false,
				fid:"",
				fname:"",
				imgurl:"",
				markname:"",
				noice:"",
				seximg:"",
				sexbg:"",
				isnumCode:"",
				uid:"",
				uname:"",
				uimg:"",
				friendMsg:"",
				token:"",
				gid:'',
				isgroupMsg:true,
				isbound:false
			}
		},
		onLoad(option) {
			this.gid = option.group;
			this.fid = option.friendId;
			this.isnumCode = option.isfriendNum
			console.log(this.gid,this.ingroupnum)
			this.getstorage()	
			if(this.gid==undefined){
				this.getDetail()
			}else{
				this.getGroupDetail()
			}
		},
		onReady() {
			if(this.gid==undefined){
				this.getDetail()
			}else{
				this.getGroupDetail()
			}
			this.getStyle()			
		},
		methods: {
			navBack(){
				uni.navigateBack()
				console.log(11)
			},
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.token = value.token
						this.uname = value.name
						this.uimg = value.imgurl
						if(this.gid==undefined){
							this.friendMsg = value.name+"请求添加你为好友"
						}else{
							this.friendMsg = value.name+"请求入群"
						}
						
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			//获取群信息
			getGroupDetail(){
				uni.request({
					url:this.serverUrl+"/group/detail",
					method:"POST",
					data:{
						id:this.gid
					},
					success: (res) => {
						if(res.data.status==200){
							console.log(res.data)
							this.fname = res.data.result.name,
							this.imgurl = this.serverUrl+res.data.result.imgurl
							if(typeof(res.data.result.notice)=='undefined'){
								this.noice = "这个人很懒，什么都没留下"
							}else{
								this.noice = res.data.result.notice
							}
						}else{
							uni.showToast({
								title:"服务器获取数据失败"
							})
						}				
					}
				})
			},
			//获取用户信息
			getDetail(){
				uni.request({
					url:this.serverUrl+"/user/detail",
					method:"POST",
					data:{
						id:this.fid
					},
					success: (res) => {
						if(res.data.status==200){
							console.log(res.data)
							this.fname = res.data.result.name,
							this.imgurl = this.serverUrl+res.data.result.imgurl
							if(typeof(res.data.result.explain)=='undefined'){
								this.noice = "这个人很懒，什么都没留下"
							}else{
								this.noice = res.data.result.explain
							}
							if(this.isnumCode==0){
								this.markname = this.fname
							}else{
								uni.request({
									url:this.serverUrl+'/user/getmarkname',
									method:'POST',
									data:{
											uid:this.uid,
											fid:this.fid
									},
									success: (res) => {
										console.log(res.data)
										if(res.data.result==null){
											this.markname = this.fname
										}else{
											this.markname = res.data.result.markname
										}
									}
								})
							}
							this.is_sex(res.data.result.sex)
						}else{
							uni.showToast({
								title:"服务器获取数据失败"
							})
						}				
					}
				})
			},
			
			//判断用户性别
			is_sex(sex){
				if(sex=="asexual"){
					this.seximg = "../../static/sex.png",
					this.sexbg = "rgba(39,40,50,1)"
				}else if(sex=="female"){
					this.seximg = "../../static/women.png",
					this.sexbg = "rgba(255, 93, 91, 1)"
				}else{
					this.seximg = "../../static/man.png",
					this.sexbg = "rgba(87,153,255,1)"
				}
			},
			//添加好友
			addFriend(){
				console.log("添加")
				console.log(this.gid)
				if(this.gid==undefined){
					this.addTofriend()
				}else{
					this.addgroup()
				}
			},
			//添加好友
			addTofriend(){
				uni.request({
					url:this.serverUrl+"/friend/applyfriend",
					method:"POST",
					data:{
						uid:this.uid,
						fid:this.fid,
						type:0,
						token:this.token,
						msg:this.friendMsg
					},
					success: (res) => {
						console.log(res.data)
						if(res.data.status==500){
							uni.showToast({
								icon:"none",
								title:"服务器出错了"
							})
						}else{
							uni.showToast({
								title:"消息已发送",
								icon:"none"
							})
							setTimeout(()=>{
								uni.switchTab({
									url:"../index/index"
								})
							},1000)
						}
					}
				})
			},
			//申请入群
			addgroup(){
				uni.request({
					url:this.serverUrl+"/group/applygroup",
					method:"POST",
					data:{
						groupID:this.gid,
						userID:this.uid,
						img:this.uimg,
						token:this.token,
						name:this.uname
					},
					success: (res) => {
						console.log(res.data)
						if(res.data.status==500){
							uni.showToast({
								icon:"none",
								title:"服务器出错了"
							})
						}else{
							uni.showToast({
								title:"消息已发送",
								icon:"none"
							})
							setTimeout(()=>{
								uni.switchTab({
									url:"../index/index"
								})
							},1000)
						}
					}
				})
			},
			getStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					console.log("节点离页面顶部的距离为" + data.top);
					this.addHeight = data.height - 186
					console.log(this.addHeight)
				}).exec();
			},
			//发送消息
			tosendMsg(){
				uni.navigateTo({
					url:"../chatroom/chatroom?id="+this.fid+"&img="+this.imgurl+"&name="+this.fname
				})
			},
			//去群发送
			tosendGroupMsg(){
				uni.navigateTo({
					url:"../groupchat/groupchat?id="+this.gid+"&img="+this.imgurl+"&name="+this.fname
				})
			},
			addFriendAnimate() {
				this.isAdd = !this.isAdd
				this.isbound=true
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: "ease",
				})
				var animation1 = uni.createAnimation({
					duration: 300,
					timingFunction: "ease",
				})
				var animation2 = uni.createAnimation({
					duration: 300,
					timingFunction: "ease",
				})
				var animation3 = uni.createAnimation({
					duration: 0,
					timingFunction: "ease",
				})
				if (this.isAdd) {
					animation.bottom(0).step()
					animation1.bottom(0).step()
					animation2.width(120).height(120).top(40).step()
					animation3.opacity(0).step()
				} else {
					animation.bottom(-this.addHeight).step()
					animation1.bottom(-104).step()
					animation2.width(200).height(200).top(0).step()
					animation3.opacity(1).step()
				}
				this.animateData = animation.export()
				this.animateData1 = animation1.export()
				this.animateData2 = animation2.export()
				this.animateData3 = animation3.export()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--status-bar-height);

		.img1,
		.img2 {
			z-index: 1;
			width: 48rpx;
			height: 48rpx;
		}

		.img1 {
			margin-left: 24rpx;
		}

		.img2 {
			margin-right: 24rpx;
		}
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		.bg_img {
			position: absolute;
			top: 10rpx;
			left: 10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px);
			opacity: 0.4;
		}
	}

	.main {
		overflow: hidden;
		text-align: center;
		padding-top: 60rpx;

		.user_head {
			margin: 0 auto;
			width: 412rpx;
			height: 412rpx;
			position: relative;

			.sex_box {
				z-index: 4;
				position: absolute;
				bottom: 22rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;
				.sex {
					border-radius: 50%;
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			.user_img {
				z-index: 3;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
			}
		}

		.user_imf {
			padding-top: 42rpx;

			.rename {
				font-size: 52rpx;
				color: #272832;
				line-height: 74rpx;
			}

			.username {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #272832;
			}

			.user_txt {
				padding: 20rpx 100rpx;
				font-size: 44rpx;
				font-weight: 300;
				color: #272832;
				line-height: 48rpx;
			}
		}
	}

	.btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;

		.bottom_btn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			width: 684rpx;
			height: 80rpx;
			background: #5EA9C9;
			border-radius: 5px;
			color: #FFFFFF;
		}
		.bottom_btn1{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			width: 684rpx;
			height: 80rpx;
			background:#3CC51F;
			border-radius: 5px;
			color: #FFFFFF;
		}
	}

	.content {
		position: absolute;
		// height: 1252rpx;
		z-index: 2;
		width: 100%;
		box-sizing: border-box;
		padding: 0 54rpx;
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0 0;

		.name {
			padding-top: 168rpx;
			padding-bottom: 40rpx;
			font-size: 52rpx;
			color: #272832;
			line-height: 74rpx;
		}

		.add_main {
			padding: 18rpx 22rpx;
			width: 100%;
			box-sizing: border-box;
			height: 420rpx;
			background: #F3F4F6;
			border-radius: 20rpx;
			font-size: 32rpx;
			color: #272832;
			line-height: 44rpx;
		}
	}

	.bottom_bar {
		position: fixed;
		bottom: -104rpx;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx;
		z-index: 100;
		display: flex;

		.close {
			width: 172rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			height: 80rpx;
			background: rgba(39, 40, 50, 0.10);
			border-radius: 5px;
			margin-right: 32rpx;
			margin-left: 34rpx;
		}

		.send {
			flex: auto;
			text-align: center;
			line-height: 80rpx;
			width: 480rpx;
			height: 80rpx;
			font-size: 32rpx;
			background: #5EA9C9;
			border-radius: 5px;
			margin-right: 32rpx;
		}
	}
</style>
