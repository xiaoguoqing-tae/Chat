<template>
	<view>
		<view class="head">
			创建群
			<image src="../../static/fanhui.png" @tap="navBack()"></image>
		</view>
		<view class="main">
			<view class="title">群名称与头衔</view>
			<view class="big-img">
				<image :src="bigimg"></image>
			</view>
			<view class="name">
				<view>群名称</view>
				<input class="name-input" v-model="groupname" placeholder="群名称"/>
			</view>
			<view class="name">
				<view>群简介</view>
				<input class="name-input" v-model="notice" placeholder="群简介"/>
			</view>
			<view class="group-img">
				<view>群头像</view>
				<view class="imglist">
					<image v-for="(item,index) in imglist" :key="index" :src="serverUrl+item" @tap="chooseimg(item,index)"></image>	
				</view>
			</view>
		</view>
		<view class="btn" @tap="buildgroup">立即创建</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imglist:['/group/group1.jpg','/group/group2.jpg','/group/group3.jpg','/group/group4.jpg'],
				groupname:"",
				notice:"",
				imgurl:"/group/group1.jpg",
				bigimg:this.serverUrl+'/group/group1.jpg',
				uid:"",
				uname:"",
				uimg:""
			}
		},
		onLoad(e) {
			this.uid = e.userId
			this.uname = e.username
			this.getstorage()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uimg = value.imgurl
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			navBack(){
				uni.navigateBack()
			},
			buildgroup(){
				uni.request({
					url:this.serverUrl+"/group/buildgroup",
					method:"POST",
					data:{
						userID:this.uid,
						username:this.uname,
						img:this.uimg,
						name:this.groupname,
						notice:this.notice,
						imgurl:this.imgurl,
					},
					success: (res) => {
						console.log(this.uimg)
						if(res.data.status==200){
							uni.showToast({
								title:"创建成功"
							})
							setTimeout(()=>{
								uni.switchTab({
									url:"../group/group",
									success(e) {
									    var page = getCurrentPages().pop();
									    if (page == undefined || page == null) return;
									    page.$vm.navigateHandle();					
									}
								})
							},500)
						}else if(res.data.status==500){
							uni.showToast({
								title:"创建失败"
							})
						}
					}
				})
			},
			chooseimg(img,index){
				this.imgurl = img
				this.bigimg = this.serverUrl + img
			},
		}
	}
</script>

<style lang="scss" scoped>
	.head{
		width: 100%;
		height: 88rpx;
		background: #ffffff;
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
		text-align: center;
		position: relative;
		line-height: 88rpx;
		padding-top: var(--status-bar-height);
		image{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;
			
		}
	}
	.main{
		width: 100%;
		height: 100%;
		.title{
			padding: 30rpx 60rpx 10rpx;
			font-size:60rpx
		}
		.big-img{
			width: 80%;
			image{
				margin-left: 10%;
				width: 100%;
			}
		}
		.name{
			display: flex;
			padding: 30rpx;
			font-size: 45rpx;
			border-bottom: 1px solid rgba(39,40,50,0.08);
			.name-input{
				padding-left: 30rpx;
				font-size: 45rpx;
			}
		}
		.group-img{
			display: flex;
			flex-direction: column;
			padding: 30rpx;
			.imglist{
				display: flex;
				flex-wrap: wrap;
				image{
					margin-top: 50rpx;
					margin-left: 20rpx;
					border-radius: 50%;
					max-width: 21%;
					height: 150rpx;
				}
			}
		}
	}
	.btn{
		width: 90%;
		height: 100rpx;
		margin-top: 50rpx;
		margin-left: 5%;
		border-radius: 20rpx;
		text-align: center;
		line-height: 100rpx;
		background: #3399FF;
	}
</style>
