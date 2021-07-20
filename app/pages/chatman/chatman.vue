<template>
	<div>
		<view class="content">
			<view class="head">
				憨批机器人
				<image class="left" src="../../static/fanhui.png" @tap="navback"></image>
			</view>
			<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollintoView">
				<!-- <view class="chat-main"> -->
					<view class="chat-ls" v-for="(item,index) in send_text" :key="index">
						<view class="chat-time">{{item.time}}</view>
						<view class="msg-m msg-left" v-if="index%2!==0">
							<image src="../../static/chatMan.png" class="user-img"></image>
							<view class="message">
								<view class="msg-text">{{item.message}}</view>
							</view>
						</view>
						<view class="msg-m msg-right" v-if="index%2==0">
							<image :src="myimgurl" class="user-img"></image>
							<view class="message">
								<view class="msg-text">{{item.message}}</view>
							</view>
						</view>
					</view>
				<!-- </view> -->
			</scroll-view>
		</view>
		<view class="submit">
			<view class="submit-chat">
				<textarea auto-height="true" class="chat-send btn" v-model="my_text"></textarea>
				<view class="bt-img" @tap="sendMsg">
					<view class="send-btn">发送</view>
				</view>
			</view>
		</view>
	</div>
</template>

<script>
	import {dateTime} from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				my_text: "",
				myimgurl: "",
				token: "",
				send_text: [],
				inputHeight: "60",
				scrollintoView:"",
				id:-1
			}
		},
		onLoad() {
			this.getstorage()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.myimgurl = this.serverUrl + value.imgurl,
							this.token = value.token
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			navback() {
				uni.switchTab({
					url: "../index/index"
				})
			},
			sendMsg() {
				this.send_text.push({
					time:dateTime(new Date()),
					message:this.my_text
				})
				var params = {
					"reqType": 0,
					"perception": {
						"inputText": {
							"text": this.my_text
						},
						"inputImage": {
							"url": "imageUrl"
						},
						"selfInfo": {
							"location": {
								"city": "北京",
								"province": "北京",
								"street": "信息路"
							}
						}
					},
					"userInfo": {
						"apiKey": "51bf5c86e9f845018816a908987f2d48",
						"userId": "f4cc07ebe6c17842"
					}
				}
				uni.request({
					url:"http://openapi.tuling123.com/openapi/api/v2",
					method:"POST",
					data:params,
					success: (res) => {
						this.send_text.push({
							time:dateTime(new Date()),
							message:res.data.results[0].values.text
						})
						this.my_text=""
						this.$nextTick(function(){
							uni.pageScrollTo({
								scrollTop:9999999,
								duration:200
							})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		width: 100%;
		height: 88rpx;
		text-align: center;
		position: fixed;
		top: 0;
		z-index: 100;
		line-height: 88rpx;
		border-bottom: 1px solid $uni-border-color;
		background: rgba(244, 244, 244, 0.96);
		padding-top: var(--status-bar-height);

		.left {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;
		}

		.right {
			width: 68rpx;
			height: 68rpx;
			position: absolute;
			right: 32rpx;
			top: var(--status-bar-height);
			border-radius: $uni-border-radius-base;
		}
	}

	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
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
	}

	.chat {
		height: 100%;
		padding-top: 80rpx;

		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;

				.user-img {
					flex: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}

				.message {
					max-width: 480rpx;
				}

				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 16rpx 24rpx;
					word-wrap: break-word;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background-color: #FFFFFF;
					border-radius: 0 20rpx 20rpx 20rpx;
					;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background-color: #3399FF;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
			}
		}
	}
</style>
