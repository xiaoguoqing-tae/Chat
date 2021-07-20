<template>
	<view class="content">
		<view class="top">
			<view class="register" @tap="to_register">注册</view>
		</view>
		<view class="main">
			<view class="logo" >
				<image src="../../static/logo-npm.png"></image>
			</view>
			<view class="form-input">
				<view class="title">
					<view class="login">登录</view>
					<view class="login-content">您好，欢迎来到聊天室</view>
				</view>
				<view class="name">
					<input type="text" placeholder="账户名/邮箱" v-model="userName"/>
				</view>
				<view class="password">
					<input :type="type" placeholder="密码" @input="getpassword"/>
					<image v-if="!islook" class="eyes" src="../../static/closeeyes.png" @tap="eyes()"></image>
					<image v-if="islook" class="eyes" src="../../static/openeyes.png" @tap="eyes()"></image>
				</view>
				<view v-if="is_success" class="warn">账号或密码错误</view>
				<view class="wjmm">忘记密码?</view>
			</view>
			<view class="login-btn" @tap="login">
				登录
			</view>
		</view>
	</view>
</template>

<script>
	var a=""
	export default {
		data() {
			return {
				token:"",
				type:"password",
				islook:false,//眼睛睁开闭上
				is_success:false,//账号密码是否错误
				userName:"",//用户名
				password:"",//密码
			}
		},
		onLoad(e) {
			this.userName=e.userName
			const value = uni.getStorageSync('user');
			if(value){
				uni.switchTab({
					url: '../index/index',
					animationType: 'pop-in',
				})
			}
		},
		computed:{
			setToken:function(token){
				return  token;
			}
		},
		methods: {
			eyes(){
				this.islook=!this.islook
				if(this.islook){
					this.type="text"
				}else{
					this.type="password"
				}
			},
			getpassword(e){
				this.password=e.detail.value
			},
			to_register(){
				uni.navigateTo({
				    url: '../register/register',
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			login(){
				if(this.userName=="" || this.password==""){
					uni.showToast({
						icon:"none",
						title:"账户名或密码不能为空"
					})
				}else{
					uni.request({
						url:this.serverUrl+"/singin/match",
						method:"POST",
						data:{
							data:this.userName,
							pwd:this.password
						},
						success(data) {
							console.log(data)
							if(data.data.status==200){
								uni.showToast({
									title:"登录成功"
								})
								let res = data.data.back
								try {
									uni.setStorageSync('user', {'id':res.id,'name':res.name,'imgurl':res.imgurl,'bgimg':res.bgurl,'token':res.token});
								} catch (e) {
									console.log("存储失败")
								}
								setTimeout(function(){
									uni.switchTab({
										url: '../index/index',
										animationType: 'pop-in',
										animationDuration: 200
									})
								},2000)
							}else{
								uni.showToast({
									icon:"none",
									title:"登录失败"
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.top{
		width: 100%;
		height: 88rpx;
		margin-bottom: 80.2rpx;
		padding-top:  var(--status-bar-height);;
		.register{
			float: right;
			padding-right: 56rpx;
			padding-top: 10rpx;
		}
	}
	.main{
		width: 100%;
		.logo{
			width: 100%;
			text-align: center;
			padding: 20rpx;
			image{
				width: 450rpx;
				height: 150rpx;				
			}
		}
		.form-input{
			width: 100%;
			.title{
				padding-left: 64rpx;
				margin-bottom: 64rpx;
				.login{
					font-size: 56rpx;
					color: #272832;
				}
				.login-content{
					font-size: 40rpx;
					color: rgba(39,40,50,0.50);
				}
			}
			.name{
				position: relative;
				padding-left: 80rpx;
				margin-bottom: 80rpx;
				input{
					width: 90%;
					border-bottom: 1px solid rgba(39,40,50,0.08);				
				}
			}
			.password{
				position: relative;
				padding-left: 80rpx;
				input{
					width: 90%;
					border-bottom: 1px solid rgba(39,40,50,0.08);
				}
			}
			.wjmm{
				float: right;
				font-size: 30rpx;
				color: rgba(39,40,50,0.50);
				padding-right: 20rpx;
				padding-top: 10rpx;
			}
			.warn{
				float: left;
				color:red;
				padding-left: 20rpx;
				padding-top: 10rpx;
			}
		}
		.login-btn{
			width: 520rpx;
			height: 96rpx;
			background: #5EA9C9;
			box-shadow: 0 25px 16px -18px rgba(255,228,49,0.40);
			border-radius: 24rpx;
			text-align: center;
			line-height: 96rpx;
			margin: 0 auto;
			margin-top: 80rpx;
			ont-size: 16px;
			color: #272832;
		}
		.eyes{
			width: 60rpx;
			height: 60rpx;
			top: -10rpx;
			right:50rpx;
			position: absolute;
			font-size: 30rpx;
		}

	}
</style>
