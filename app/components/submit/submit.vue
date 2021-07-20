<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="change">
					<image :src="record_img"></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}"  @input="inputs" v-model="inputValue"
				 @focus="closeEmoji"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}"  @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/biaoqing.png"></image>
				</view>
				<view class="bt-img" :class="{displaynone:!issend}" @tap="sendMsg">
					<view class="send-btn">发送</view>
				</view>
				<view class="bt-img" :class="{displaynone:issend}" @tap="showMore">
					<image src="../../static/add.png"></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}">
				<emoji @emojiTo="emojiTo" :height="200"></emoji>
			</view>
			<view class="more" v-if="ismore">
				<view class="more-list">
					<view class="more-item" @tap="chooseImg('album')">
						<image src="../../static/src_img.png"></image>
					</view>
					<text>照片</text>
				</view>
				<view class="more-list">
					<view class="more-item" @tap="chooseImg('camera')">
						<image src="../../static/src_camara.png"></image>
					</view>
					<text>拍照</text>
				</view>
				<view class="more-list" @tap="chooseLocation()">
					<view class="more-item">
						<image src="../../static/src_location.png"></image>
					</view>
					<text>定位</text>
				</view>
				<view class="more-list">
					<view class="more-item">
						<image src="../../static/src_video.png"></image>
					</view>
					<text>视频</text>
				</view>
				<view class="more-list">
					<view class="more-item">
						<image src="../../static/src_wj.png"></image>
					</view>
					<text>文件</text>
				</view>
			</view>
		</view>
		<view class="mask" v-if="istime">
			<view class="time_second">{{vlength}}</view>
			<image src="../../static/timg.gif"></image>
			<view class="cancel">上划取消</view>
		</view>
	</view>
</template>

<script>
	import emoji from "./emoji/emoji.vue"
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isrecord: false,
				record_img: "../../static/keybord.png",
				isemoji: true,
				issend: false,
				inputValue: "",
				ismore: false,
				time: "",
				vlength: 0,
				istime:false,
				pageY:"",
				uimgurl:"",
				uname:""
			};
		},
		components: {
			emoji
		},
		mounted() {
			this.getstorage()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uimgurl = value.imgurl
						this.uname = value.name
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			getHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit("heights", data.height)
				}).exec();
			},
			change() {
				this.ismore = false
				this.isemoji = true
				if (!this.isrecord) {
					this.isrecord = true
					this.record_img = "../../static/yuyin.png"
				} else {
					this.isrecord = false
					this.record_img = "../../static/keybord.png"
				}
				setTimeout(() => {
					this.getHeight()
				}, 20)
				
			},
			showMore() {
				this.isemoji = true
				this.ismore = !this.ismore
				setTimeout(() => {
					this.getHeight()
				}, 20)
			},
			emoji() {
				this.ismore = false
				this.isemoji = !this.isemoji
				setTimeout(() => {
					this.getHeight()
				}, 20)
			},
			emojiTo(e) {
				console.log(e)
				this.issend=true
				this.inputValue = this.inputValue + e
			},
			//音频操作
			touchstart(e) {
				this.pageY = e.changedTouches[0].pageY
				let i = 1
				this.time = setInterval(() => {
					this.vlength = i
					i++
					if (i > 60) {
						clearInterval(this.time)
						this.touchend()
					}
					this.istime=true
					console.log(i)
				}, 1000)
				recorderManager.start();
			},
			touchend() {
				clearInterval(this.time)
				let self = this;
				recorderManager.onStop((res)=> {
					console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;
						let message = {
							voice:self.voicePath,
							second:self.vlength
					}
					console.log(message,self.istime)
					if(self.istime==true){
						if(self.vlength!=0){
							self.send(message,2)
						}else{
							uni.showToast({
								title:"消息时间过短"
							})
						}
					}		
					self.vlength=0
					self.istime=false
				});
				recorderManager.stop();
			},
			touchmove(e){
				if(this.pageY-e.changedTouches[0].pageY>100){
					this.istime=false
				}
			},	
			chooseLocation(){
				uni.chooseLocation({
				    success: res=> {
						let data = {
							name: res.name,
							address: res.address,
							latitude:res.latitude,
							longitude:res.longitude
						} 
						let stringData = JSON.stringify(data)
						this.send(stringData,3)
				    }		
				});
			},
			sendMsg() {
				this.issend=false
				this.send(this.inputValue,0)
			},
			send(msg,type){
				let data = {
					message: msg,
					types: type,
					imgurl:this.uimgurl,
					name:this.uname
				}
				this.$emit('inputs',data)
				setTimeout(() => {
					this.inputValue = ""
				}, 0)
			},
			closeEmoji() {
				this.isemoji = true
				this.ismore = false
				uni.onKeyboardHeightChange(res => {
				  this.$nextTick(function(){
				  	uni.pageScrollTo({
				  		scrollTop:9999999,
				  		duration:200
				  	})
				  })
				})
				this.$emit("heights", '60')
			},
			inputs(e) {
				if (e.detail.value != "") {
					this.issend = true
					this.inputValue = e.detail.value
				}else if(e.detail.value.toString().length==0){
					this.issend = false
				}
			},
			chooseImg(i) {
				let count
				if (i == "album") {
					count = 9
				} else {
					count = 1
				}
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [i], //从相册选择
					success: (res) => {
						const filePath = res.tempFilePaths
						for (let i = 0; i < filePath.length; i++) {
							this.send( filePath[i],1)
						}
						console.log(filePath)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.displaynone {
		display: none;
	}

	.submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;

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

		.record {
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
		}
	}

	.emoji {
		width: 100%;
		height: 400rpx;
		background: rgba(244, 244, 244, 0.96);
	}

	.more {
		width: 100%;
		height: 400rpx;
		background: rgba(244, 244, 244, 0.96);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.more-list {
			width: 25%;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.more-item {
				width: 100rpx;
				height: 100rpx;
				background: #FFFFFF;
				padding: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;

				image {
					width: 72rpx;
					height: 72rpx;
				}
			}
		}
	}
	.mask{
		position: fixed;
		top:0;
		left:0;
		z-index:99;
		width:100%;
		height:100vh;
		background:#211a4a;
		text-align: center;
		.time_second{
			padding-top: 600rpx;
			font-size: 100rpx;
			color: #FFFFFF;
		}
		.cancel{
			font-size: 20rpx;
			color: #FFFFFF;
		}
	}
</style>
