<template>
	<view style="overflow-x: hidden;">
		<view class="header-img">
			<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel" ></image-cropper>
			<image :src="bgurl" mode="aspectFill" @tap="upload"></image>
			<view class="user-info">
				<view class="font">{{uname}}</view>
				<image :src="serverUrl+imgurl"></image>
			</view>
		</view>
		<view class="top-bar">
			<image style="visibility: hidden;" src="../../static/back.png"></image>
			<image @tap="addmoment" src="../../static/tianjia.png"></image>
		</view>
		<view class="monments-content" @tap="addmoments=false">
			<view class="monments-list" v-for="(item,index) in momentsmsg" :key="index">
				<view class="monmnets-img">
					<image :src="serverUrl+item.imgurl"></image>
				</view>
				<view class="monments-main">
					<view class="name">{{item.name}}</view>
					<view class="content">{{item.message}}</view>
					<view class="imgbox" v-if="item.url.length!==1">
						<div class="divbox" v-for="(it,id) in item.url" :key="id">
							<image :src="serverUrl+it" @tap="preview(index,serverUrl+it)"></image>
						</div>
					</view>
					<view class="imgbox" v-if="item.url.length==1">
						<div class="divbox0" v-for="(it,id) in item.url" :key="id">
							<image :src="serverUrl+it" @tap="preview(index,serverUrl+it)"></image>
							<span v-if="item.zan>0" style="font-weight: 1000;">{{item.zan}}人点赞</span>
						</div>
					</view>
					<view class="comment">
						<view class="time">{{item.time}}</view>
						<view>
							<image @tap="zan(true,item._id,index)" v-if="!item.zanboolean" src="../../static/zan-before.png"></image>
							<image @tap="zan(false,item._id,index)" v-if="item.zanboolean" src="../../static/zan-after.png"></image>
							<image @tap.stop="open(item._id,item.userID)" src="../../static/moment.png"></image>
							<image @tap="deleteM(item._id)" v-if="item.userID==uid" src="../../static/delete.png"></image>
						</view>
					</view>
					<view class="comments" v-if="item.iscomments">
						<view class="momentmsg" v-for="(it,idx) in item.comments" :key="idx">{{it.name}}:{{it.message}}</view>
					</view>
				</view>
			</view>			
		</view>
		<view class="submit" v-if="addmoments">
			<view class="submit-chat">
				<textarea auto-height="true" class="chat-send btn" v-model="my_text"></textarea>
				<view class="bt-img" @tap="sendMsg">
					<view class="send-btn">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {formatMsgTime} from "../../commons/js/myfun.js"
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper";
	export default {
		components: {ImageCropper},
		data() {
			return {
				uid:"",
				uname:"",
				token:"",
				imgurl:"",
				momentsmsg:"",
				previewList:[],
				addmoments:false,
				my_text:"",
				momentId:"",
				tempFilePath:"",
				bgurl:"",
				groupId:"",
				fid:""
			}
		},
		onLoad() {
			this.getstorage()
			this.getmoment()
		},
		onBackPress() {
			var mainActivity = plus.android.runtimeMainActivity();
			mainActivity.moveTaskToBack(false);
			return true;
		},
		onPullDownRefresh() {
			this.getstorage()
			this.getmoment()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow(){
			
		},
		onReady() {
			
		},
		methods: {
			navigateHandle(){
				this.getmoment()
			},
			open(id,uid){
				this.addmoments=true
				this.groupId = id
				this.fid = uid
			},
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.uname = value.name
						this.token=value.token
						this.imgurl = value.imgurl
						this.bgurl = this.serverUrl+value.bgimg
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			addmoment() {
				uni.navigateTo({
					url: "../addmoment/addmoment"
				})
			},
			getmoment() {
				uni.request({
					url: this.serverUrl + "/moments/getmsg",
					method: "POST",
					data: {
						uid: this.uid,
						state: 0,
						token: this.token
					},
					success: (res) => {
						let result = res.data.result
						for(let i=0;i<result.length;i++){
							result[i].time = formatMsgTime(result[i].time)
							result[i].url =JSON.parse(result[i].url)
							if(result[i].comments.length>0){
								result[i].iscomments=true
							}
							for(let j=0;j<result[i].zanlist.length;j++){
								if(result[i].zanlist[j].indexOf(this.uid)!==-1){
									result[i].zanboolean = true
								}
							}
						}
						this.momentsmsg=res.data.result
						console.log(this.momentsmsg)
					}
				})
			},
			//预览图片
			preview(index,idx){
				this.previewList=[]
				for(let i=0;i<this.momentsmsg[index].url.length;i++){
					this.previewList.push(this.serverUrl+this.momentsmsg[index].url[i])
				}
				console.log(idx)
				let current
				for(let i=0;i<this.previewList.length;i++){
					if(idx==this.previewList[i]){
						current=i
					}
				}
				// 预览图片
				uni.previewImage({
					current:current,
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
			//评论
			sendMsg(){
				uni.request({
					url:this.serverUrl + "/moments/comment",
					method:"POST",
					data:{
						momentID:this.groupId,
						userID:this.uid,
						friendID:this.fid,
						name:this.uname,
						message:this.my_text
					},
					success: (res) => {
						console.log(res)
						this.my_text=""
						this.addmoments=false
						this.getmoment()
					}
				})
			},
			//点赞
			zan(state,id,i){
				uni.request({
					url: this.serverUrl + "/moments/zan",
					method: "POST",
					data: {
						id: id,
						userID:this.uid,
						state:state
					},
					success: (res) => {
						if(state){
							this.momentsmsg[i].zan+1
						}else{
							this.momentsmsg[i].zan-1
						}
						this.getmoment()
					}
				})
			},
			//更换朋友圈背景
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
				this.bgurl = e.detail.tempFilePath;
				this.headimg=e.detail.tempFilePath;
			
				uni.uploadFile({url:this.serverUrl+'/files/upload',                      //'后端地址上传图片接口地址',
					filePath: this.headimg,
					name: 'file',
					fileType:'image',
					formData:{
						url:'momentimg',
						name:this.uid,
						token:this.token
					},
					success: (uploadFileRes) => { 
						var backstr= uploadFileRes.data;
						try{
							uni.setStorageSync('user',{'id':this.uid,'name':this.uname,'token':this.token,'imgurl':this.imgurl,'bgimg':backstr})
						}catch(e){
							//TODO handle the exception
						}
						this.update(backstr,'bgurl',undefined)
						this.getmoment()
					},
					complete() {
					},
					fail(e) {
						console.log("this is errormes "+e.message)  
					}
				});
			},
			//删除此条朋友圈
			deleteM(id){
				var _this = this
				uni.showModal({
				    title: '提示',
				    content: '确定删除此条朋友圈?',
				    success: function (res) {
				        if (res.confirm) {
				            uni.request({
								url:_this.serverUrl+"/moments/deleteMoment",
								method:'POST',
								data:{
									id:id,
									token:_this.token
								},
								success:(res=>{
									if(res.data.status==200){
										_this.getmoment()
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
				    }
				});
			},
			cancel() {
				console.log('canceled');
				this.tempFilePath="";
			},
			update(e,t,p){
				uni.request({
					url:this.serverUrl+"/user/update",
					data:{
						id:this.uid,
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
		}
	}
</script>

<style lang="scss" scoped>
	.header-img {
		position: relative;
		width: 100%;

		image {
			width: 100%;
		}

		.user-info {
			position: absolute;
			bottom: -20rpx;
			right: 20rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			color: #ffffff;

			.font {
				padding-right: 20rpx;
			}

			image {
				width: 110rpx;
				height: 110rpx;
				border-radius: $uni-border-radius-base;
			}
		}
	}

	.top-bar {
		width: 100%;
		position: absolute;
		top: var(--status-bar-height);
		display: flex;
		justify-content: space-between;

		image {
			padding: 10rpx;
			width: 48rpx;
			height: 48rpx;
		}
	}

	.monments-content {
		width: 100%;
		padding: 100rpx 20rpx 20rpx 20rpx;
		padding-bottom: var(--window-bottom);
		.monments-list {
			width: 100%;
			height: auto;
			display: flex;
			margin: 20rpx;
			.monmnets-img {
				width: 15%;
				padding-right: 20rpx;
				image {
					width: 90rpx;
					height: 90rpx;
					border-radius: $uni-border-radius-base;
				}
			}
			.monments-main {
				width: 85%;
				flex: 1;
				.name {
					font-size: 45rpx;
					color: #D4BAE8;
				}
				.content{
					width: 90%;
					word-break: break-all;
					word-wrap: break-word;
				}
				.imgbox {
					width: 90%;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					height: auto;

					.divbox0 {
						width: 100%;
						height: 100%;
						display: table-cell;
						vertical-align: middle;

						image {
							max-width: 100%;
							max-height: 100%;
							display: block;
							margin: auto;
						}
					}

					.divbox {
						width: 32%;
						height: 200rpx;
						display: table-cell;
						vertical-align: middle;
						margin-left: 5rpx;
						margin-top: 5rpx;

						image {
							max-width: 100%;
							max-height: 100%;
							display: block;
							margin: auto;
						}
					}
				}
				.comment{
					padding-top: 20rpx;
					width: 90%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.time{
						font-size: 20rpx;
					}
					image{
						margin-left: 35rpx;
						width: 50rpx;
						height: 50rpx;
					}
				}
				.comments{
					padding: 10rpx;
					font-size: 35rpx;
					width: 88%;
					display: flex;
					flex-direction: column;
					background: #EEEEEE;
				}
			}
		}
	}
	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: var(--window-bottom);
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		// padding: 14rpx 14rpx;
	
		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
	
		.send-btn {
			width: 100rpx;
			height: 56rpx;
			margin: 0 10rpx;
			padding: 10rpx;
			text-align: center;
			border-radius: $uni-border-radius-sm;
			flex: auto;
			background: $uni-color-primary;
		}
	
		.btn {
			flex: auto;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			margin: 0 10rpx;
			padding: 20rpx;
			max-height: 160rpx;
		}
	}
</style>
