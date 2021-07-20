<template>
	<div>
		<view class="head">
			详细信息
			<!-- <image src="../../static/fanhui.png" @tap="navBack()"></image> -->
		</view>
		<view class="content">
			<view class="head_img">
				<span>头像</span>
				<image-cropper  :src="tempFilePath" @confirm="confirm" @cancel="cancel" ></image-cropper>
				<image :src="cropFilePath" @tap="upload"  class="imgUrl" ></image>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item" @tap="modify('签名',dataArr.explain)">
				<span class="item_name">签名</span>
				<span class="item_content">{{dataArr.explain}}</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item">
				<span class="item_name">注册</span>
				<span class="item_content">{{dataArr.time}}</span>
			</view>
			<view class="item" @tap="modify('昵称',dataArr.name)">
				<span class="item_name">昵称</span>
				<span class="item_content">{{dataArr.name}}</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="index" :range="array">
								<span class="item_name">性别</span>
								<span class="item_content">{{dataArr.sex}}</span>
								<image class="right" src="../../static/right.png"></image>
							</picker>
						</view>
				</view>
			</view>
				
			</view>
			<view class="item">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db">
							<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
								<span class="item_name">生日</span>
								<span class="item_content">{{date}}</span>
								<image class="right" src="../../static/right.png"></image>
							</picker>
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="item" @tap="modify('电话',dataArr.phone)">
				<span class="item_name">电话</span>
				<span class="item_content">{{dataArr.phone}}</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item" @tap="modify('邮箱',dataArr.email)">
				<span class="item_name">邮箱</span>
				<span class="item_content">{{dataArr.email}}</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item" @tap="modify('密码')">
				<span class="item_name" >密码</span>
				<span class="item_content">修改密码</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item" @tap="toqd()">
				<span class="item_name" >签到</span>
				<span class="item_content">去签到</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
			<view class="item" @tap="toplay()">
				<span class="item_name" >游戏</span>
				<span class="item_content">我的游戏</span>
				<image class="right" src="../../static/right.png"></image>
			</view>
		</view>
		<view class="logout" @tap="loginout()">退出应用</view>
		<view class="modify" :style="{bottom: -winHeight+'px'}" :animation="animateData">
			<view class="modify-header">
				<view class="close" @tap="modify('取消')">取消</view>
				<view class="title">{{updateTitle}}</view>
				<view class="define" @tap="define">确定</view>
			</view>
			<view class="modify-main">
				<input v-model="pwd" class="modify-pwd" placeholder="请输入原密码" :style="{display:hiddepwd}"  />
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
		</view>
		
	</div>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				dataArr:{
					
				},
				noice:"",
				id:"",
				name:"",
				tempFilePath: '',
				cropFilePath: '',
				bgurl:"",
				date: currentDate,
				array: ['男', '女', '不详'],
				index: 0,
				data:"修改的内容",
				pwd:"",
				type:"",
				winHeight:"",
				isModify:false,
				animateData: {},
				hiddepwd:false,
				updateTitle:"",
				token:""
			}
		},
		computed:{
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		components: {ImageCropper},
		onLoad() {
			this.getstorage()
			this.getDetail()
		},	
		onReady() {
			this.getStyle()
			this.getDetail()
		},
		onBackPress() {
			var mainActivity = plus.android.runtimeMainActivity();
			mainActivity.moveTaskToBack(false);
			return true;
		},
		methods: {
			// navBack(){
			// 	uni.navigateBack()
			// },
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.id = value.id,
						this.cropFilePath = this.serverUrl+value.imgurl,
						this.name = value.name
						this.token=value.token
						this.bgurl = value.bgimg
						console.log(this.cropFilePath)
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			loginout(){
				uni.clearStorage();
				uni.reLaunch({
					url:"../login/login",
				})
			},
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {		
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg=e.detail.tempFilePath;
			
				uni.uploadFile({url:this.serverUrl+'/files/upload',                      //'后端地址上传图片接口地址',
					filePath: this.headimg,
					name: 'file',
					fileType:'image',
					formData:{
						url:'user',
						name:this.id,
						token:this.token
					},
					success: (uploadFileRes) => { 
						var backstr= uploadFileRes.data;
						console.log(backstr)
						try{
							uni.setStorageSync('user',{'id':this.id,'name':this.name,'token':this.token,'imgurl':backstr,'bgimg':this.bgurl})
						}catch(e){
							//TODO handle the exception
						}
						this.update(backstr,'imgurl',undefined)
					},
					complete() {
					},
					fail(e) {
						console.log("this is errormes "+e.message)  
					}
				});
			},
			update(e,t,p){
				uni.request({
					url:this.serverUrl+"/user/update",
					data:{
						id:this.id,
						data:e,
						type:t,
						pwd:p,
						token:this.token
					},
					method:'POST',
					success: (data) => {		
						let status = data.statusCode;
						console.log(data)
						if(status==200){
							if(p!==undefined){
								uni.showToast({
									title:"密码重置，请重新登录",
									icon:'none'
								})
								setTimeout(()=>{
									uni.navigateTo({
										url: "../login/login"
									})
								},700)							
							}
							let res = data.data.result;
							console.log(res)
						}else if(status==500){
							uni.showToast({
								title:"服务器出错",
								icon:'none'
							})
						}
					}
				})
			},
			getDetail(){
				uni.request({
					url:this.serverUrl+"/user/detail",
					method:"POST",
					data:{
						id:this.id
					},
					success: (res) => {
						if(res.data.status==200){
							let data = res.data.result
							console.log(data)
							this.cropFilePath = this.serverUrl+data.imgurl
							let time = data.time.slice(0,10)
							let sex
							if(data.sex == 'asexual'){
								sex="不详"
							}else if(data.sex == 'male'){
								sex="男"
							}else{
								sex="女"
							}
							if(typeof(data.explain)=='undefined'){
								this.noice = "这个人很懒，什么都没留下"
							}else{
								this.noice = data.explain
							}
							if(typeof(data.birth)=='undefined'){
								this.date = "0000-00-00"
							}else{
								this.date = data.birth
							}
							let phone
							if(typeof(data.phone)=='undefined'){
								phone = "赶紧买一个手机吧"
							}else{
								phone = data.phone
							}
							this.dataArr = {
								name:data.name,
								email:data.email,
								sex:sex,
								time:time,
								explain:this.noice,
								phone:phone,
								birth:this.date
							}
						}else{
							uni.showToast({
								title:"服务器获取数据失败"
							})
						}				
					}
				})
			},
				cancel() {
					console.log('canceled');
					this.tempFilePath="";
				},
				getStyle() {
					const query = uni.createSelectorQuery().in(this);
					query.select('.modify').boundingClientRect(data => {
						this.winHeight = data.height
					}).exec();
				},
				//弹窗
				modify(type,data){
					if(type=="邮箱"){
						this.type="email"
						this.hiddepwd="block"
					}else if(type=="签名"){
						this.type="explain"
						this.hiddepwd="none"
					}else if(type=="昵称"){
						this.type="name"
						this.hiddepwd="none"
					}else if(type=="电话"){
						this.type="phone"
						this.hiddepwd="none"
					}else if(type=="邮箱"){
						this.type="email"
						this.hiddepwd="none"
					}else if(type=="密码"){
						this.type="psw"
						this.hiddepwd="block"
					}
					this.updateTitle=type
					this.data=data
					this.isModify = !this.isModify
					var animation = uni.createAnimation({
						duration: 300,
						timingFunction: "ease",
					})
					if(this.isModify){
						animation.bottom(0).step()
					}else{
						animation.bottom(-this.winHeight).step()
					}
					this.animateData = animation.export()
				},
				define(){
					if(this.data.length>0){
						if(this.pwd==""){
							this.update(this.data,this.type,undefined)
							this.dataArr[this.type]=this.data
						}else{
							this.update(this.data,this.type,this.pwd)
													
						}					
					}
					this.modify()
				},
				bindDateChange: function(e) {
						this.date = e.target.value
				},
				bindPickerChange: function(e) {
					this.index = e.target.value
					let xb
					if(this.array[this.index]=="不详"){
						xb="asexual"
					}else if(this.array[this.index]=="男"){
						xb="male"
					}else{
						xb="female"
					}
					this.update(xb,"sex",undefined)
					this.dataArr['sex']=this.array[this.index]
				},
				getDate(type) {
					const date = new Date();
					let year = date.getFullYear();
					let month = date.getMonth() + 1;
					let day = date.getDate();
				
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
					month = month > 9 ? month : '0' + month;;
					day = day > 9 ? day : '0' + day;
					return `${year}-${month}-${day}`;
				},
				toqd(){
					uni.navigateTo({
						url:"../calendar/calendar?id="+this.id
					})
				},
				toplay(){
					uni.navigateTo({
						url:"../mygame/mygame"
					})
				}
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
		padding-top: var(--status-bar-height);
		image{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;
			
		}
	}
	.content{
		.head_img{
			margin-top: 44rpx;
			height: 148rpx;
			width: 100%;
			background: #ffffff;
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
			position: relative;
			span{
				position: absolute;
				top:52rpx;
				left:32rpx;
			}
			.imgUrl{
				border-radius: 10px;
				position: absolute;
				top:22rpx;
				left:126rpx;
				width: 104rpx;
				height: 104rpx;
			}
			.right{
				position: absolute;
				right: 26rpx;
				top: 60rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}
		.item{
			height: 112rpx;
			width: 100%;
			background: #ffffff;
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
			position: relative;
			.item_name{
				position: absolute;
				top:34rpx;
				left:32rpx;
			}
			.item_content{
				color: #a9a9a9;
				position: absolute;
				top: 34rpx;
				left: 126rpx;
				max-width: 558rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical; 
				-webkit-line-clamp:1; 
			}
			.right{
				position: absolute;
				right: 26rpx;
				top: 42rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
	.logout{
		text-align: center;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: red;
	}
	//修改弹窗样式
	.modify{
		position: fixed;
		z-index: 1002;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #FFFFFF;
		.modify-header{
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			align-items: center;
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
			.close{
				padding-left: 32rpx;
				font-size: $uni-font-size-lg;
				color:$uni-text-color;
				line-height: 44rpx;
			}
			.title{
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define{
				padding-right: 32rpx;
				font-size: $uni-font-size-lg;
				color:$uni-color-success;
				line-height: 44rpx;
			}
		}
		.modify-main{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: $uni-spacing-col-base;
			.modify-pwd{
				padding: 0rpx 20rpx;
				width: 100%;
				height: 88rpx;
				margin-bottom: 20rpx;
				background: $uni-bg-color-hover;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.modify-content{
				padding: 16rpx 20rpx;
				flex: auto;
				height: 386rpx;
				background: $uni-bg-color-hover;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
