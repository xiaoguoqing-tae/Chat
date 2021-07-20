<template>
	<view class="content">
		<view class="top">
			<image src="../../static/fanhui.png"  @tap="navBack()"></image>
		</view>
		<view class="main">
			<view class="logo">
				<image src="../../static/logo-npm.png"></image>
			</view>
			<view class="form-input">
				<view class="title">
					<view class="login">注册</view>
				</view>
				<view class="user">
					<input type="text" v-model="userName" placeholder="昵称" @blur="istrue_username()"/>
					<view v-if="isname" class="error">用户名不能为空</view>
				</view>
				<view class="name">
					<input type="text" placeholder="邮箱" v-model="mailName" @blur="istrue_mail()"/>
					<view v-if="isUse_name" class="error">已占用</view>
					<view v-if="ismail" class="error">邮箱格式错误</view>
					<image v-if="issuccess" class="success" src="../../static/success.png"></image>
				</view>
				<view class="password">
					<input :type="type" placeholder="请设置密码(不小于6位)" @input="istrue_pwd"/>
					<view v-if="ispass" class="error_pwd">密码长度过短</view>
					<image v-if="islook" src="../../static/openeyes.png" @tap="eyes()"></image>
					<image v-if="!islook" src="../../static/closeeyes.png" @tap="eyes()"></image>
				</view>
			</view>
			<view class="login-btn" @tap="register()">
				注册
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:"password",
				isname:false,//用户名是否为空
				islook:false,//显示密码
				isUse_name:false,//邮箱是否被占用
				ismail:false,//邮箱格式是否错误
				issuccess:false,//邮箱通过
				ispass:false,//密码长度判断
				userName:"",//昵称
				mailName:"",//邮箱
				pwd:"",//密码
			}
		},
		onLoad() {
		
		},
		methods: {
			navBack(){
				uni.navigateBack()
			},
			eyes(){
				this.islook=!this.islook
				if(this.islook){
					this.type="text"
				}else{
					this.type="password"
				}
			},
			istrue_username(){
				if(this.userName==""){
					this.isname=true
				}
			},
			istrue_mail(){
				let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
				var that = this
				if(reg.test(this.mailName)){
					this.ismail=false
					uni.request({
						url:this.serverUrl+"/singup/judge",
						method:"POST",
						data:{
							data:this.mailName,
							type:"email"
						},
						success(data) {
							if(data.data.result==0){
								that.issuccess=true
								that.isUse_name=false
							}else{
								that.issuccess=false
								that.isUse_name=true
							}
						}
					})
				}else{
					this.ismail=true
					this.issuccess=false
				}
			},
			istrue_pwd(e){
				this.password=e.detail.value
				if(this.password.toString().length<6){
					this.ispass=true
				}else if(this.password.toString().length>6){
					this.ispass=false
				}else if(this.password==""){
					this.ispass=false
				}
			},
			register(){
				if(this.isUse_name == true || this.ismail == true){
					uni.showToast({
						icon:"none",
						title:"请检查邮箱"
					})
				}else if(this.isname==false&&this.issuccess==true&&this.ispass==false){
					uni.request({
						url:this.serverUrl+"/singup/add",
						method:"POST",
						data:{
							name:this.userName,
							mail:this.mailName,
							pwd:this.password
						},
						success(data) {
							if(data.data.status==200){
								uni.showToast({
									title:"注册成功"
								})
								setTimeout(function(){
									uni.navigateTo({
									    url: '../login/login?user='+this.userName,
										animationType: 'pop-in',
										animationDuration: 200
									});
								},2000)
							}else{
								uni.showToast({
									icon:"none",
									title:"注册失败"
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
		display: flex;
		margin-bottom: 80.2rpx;
		justify-content: space-between;
		padding-top:  var(--status-bar-height);
		image{
			padding: 10rpx 34.2rpx 0 34.2rpx;
			width: 48rpx;
			height: 48rpx;
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
					font-size: 28px;
					color: #272832;
				}
				.login-content{
					font-size: 20px;
					color: rgba(39,40,50,0.50);
				}
			}
			.name,.user,.password{
				position: relative;
				padding-left: 64rpx;
				margin-bottom: 50rpx;
				input{
					font-size: 16px;
					color: rgba(39,40,50,0.40);
					width: 90%;
					border-bottom: 1px solid rgba(39,40,50,0.08);				
				}
			}
			.password{
				position: relative;
				image{
					position: absolute;
					top: -6rpx;
					right: 45rpx;
					width: 60rpx;
					height: 60rpx;
				}
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
	}
	.error{
		top: -3rpx;
		right:50rpx;
		position: absolute;
		font-size: 15px;
		color: red
	}
	.error_pwd{
		top: 55rpx;
		right:50rpx;
		position: absolute;
		font-size: 15px;
		color: red
	}
	.success{
		top: -3rpx;
		right:50rpx;
		position: absolute;
		width: 40rpx;
		height: 40rpx;
	}
</style>
