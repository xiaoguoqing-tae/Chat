<template>
	<view class="content">
		<view class="head">
			好友请求
			<image src="../../static/fanhui.png" @tap="navBack()"></image>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in applyData" :key="index">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl"></image>
					</view>		
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{item.lastTime}}</view>
				</view>
				<view class="notic">
					<text>留言:{{item.msg}}</text>		
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {dateTime} from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				uid:"",
				token:"",
				applyData:"",
				myname:""
			}
		},
		onLoad() {
			this.getstorage()
			this.getapply()
		},
		methods: {
			navBack(){
				uni.navigateBack()
			},
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.token = value.token,
						this.myname = value.name
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			//获取申请记录
			getapply(){
				uni.request({
					url:this.serverUrl+"/index/getfriend",
					method:"POST",
					data:{
						uid:this.uid,
						state:1,
						token:this.token
					},
					success: (res) => {
						this.applyData=res.data.result
						if(res.data.status==200){
							this.requestData = res.data.result.length;
							if(res.data.result.length>0){
								this.requestTime = dateTime(res.data.result[0].lastTime)
								res.data.result.forEach((item,index)=>{
									item.imgurl = this.serverUrl+item.imgurl,
									item.lastTime = dateTime(item.lastTime)
									this.getMsg(res.data.result,index)
								})
							}
						}else if(res.data.status==500){
							mui.showToast({
								title:"服务器错误",
								icon:"none"
							})
						}else if(res.data.status==300){
							uni.navigateTo({
								url:"../login/login"
							})
						}
					}
				})
			},
			//获取留言
			getMsg(arr,i){
				uni.request({
					url:this.serverUrl+"/index/getlastmsg",
					method:"POST",
					data:{
						fid:arr[i].id,
						uid:this.uid,
						token:this.token
					},
					success: (res) => {
						if(res.data.status==200){
							console.log(res.data)
							let e = res.data.result.message
							arr[i].msg = e
							arr.splice(i,1,arr[i])
							console.log(this.applyData)
						}else if(res.data.status==500){
							mui.showToast({
								title:"服务器错误",
								icon:"none"
							})
						}else if(res.data.status==300){
							uni.navigateTo({
								url:"../login/login"
							})
						}
					}
				})
			},
			//拒绝
			refuse(fid){
				uni.request({
					url:this.serverUrl+"/friend/deletefriend",
					method:"POST",
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token
					},
					success: (res) => {
						if(res.data.status==200){
							for(let i=0;i<this.applyData.length;i++){
								if(this.applyData[i].id == fid){
									uni.showToast({
										title:"已拒绝",
										icon:"none"
									})
									this.applyData.splice(i,1)
								}
							}
						}else if(res.data.status==500){
							uni.showToast({
								title:"服务器错误",
								icon:"none"
							})
						}else if(res.data.status==300){
							uni.navigateTo({
								url:"../login/login"
							})
						}
					}
				})
			},
			//同意
			agree(fid){
				console.log(fid)
				uni.request({
					url:this.serverUrl+"/friend/updatefriendstate",
					method:"POST",
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token
					},
					success: (res) => {
						if(res.data.status==200){
							for(let i=0;i<this.applyData.length;i++){
								if(this.applyData[i].id == fid){
									uni.showToast({
										title:"已同意",
										icon:"none"
									})
									this.applyData.splice(i,1)
								}
							}
						}else if(res.data.status==500){
							uni.showToast({
								title:"服务器错误",
								icon:"none"
							})
						}else if(res.data.status==300){
							uni.navigateTo({
								url:"../login/login"
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.head{
		width: 100%;
		height: 88rpx;
		background: #ffffff;
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
		text-align: center;
		position: relative;
		line-height: 88rpx;
		image{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;
			
		}
	}
	.main{
		padding: 40rpx 32rpx;
		.requester{
			margin-top: 112rpx;
			padding: 20rpx;
			background: rgba(255,255,255,1);
			box-shadow: 0px 24rpx 64rpx -8rpx rgba(0,0,0,0.1);
			border-radius: 10px;
		}
		.request-top{
			display: flex;
			text-align: center;
			.btn{
				flex: none;
				width: 160rpx;
				height: 64rpx;
				background: rgba(255,93,91,0.1);
				border-radius: 40rpx;
				font-size: 32rpx;
				color: rgba(255,93,91,1);
				line-height: 64rpx;
			}
			.reject{
				color: $uni-color-warning;
				background: rgba(255,93,91,0.1);
			}
			.agree{
				color: $uni-text-color;
				background:$uni-color-primary; 
			}
			.header-img{
				flex: auto;
				text-align: center;
				margin-top: -104rpx;
				image{
					width: 144rpx;
					height: 144rpx;
					border-radius: 50%;
				}
			}
		}
		.request-center{
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			.title{
				font-size: 36rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 50rpx;
			}
			.time{
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 34rpx;
			}
		}
		.notic{
			padding: $uni-spacing-row-sm $uni-spacing-col-base;
			border-radius: $uni-border-radius-base;
			background-color: $uni-bg-color-grey;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;
		}
	}
</style>
