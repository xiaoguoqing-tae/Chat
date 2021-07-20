<template>
	<view class="emoji" :style="{height:height}">
		<view class="emoji-line" v-for="(line,i) in emoji" :key="i">
			<view class="emoji-item" v-for="(item,index) in line" :key="index" @tap="sendEmoji(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			height:{
				type:Number,
				default:260
			}
		},
		data() {
			return {
				emoji:[
					['😀','😁','😂','🤣','😃','😄','😅'],
					['😆','😊','😋','😎','😍','😘','😗'],
					['😙','😚','🙂','🤗','🤔','😐','🙄'],
					['😏','😣','😥','😮','🤐','😯','😪'],
					['😫','😴','😌','😛','😜','😝','🤤'],
					['😒','😓','😔','😕','🙃','🤑','😲']
				]
			};
		},
		methods:{
			sendEmoji(e){
				this.$emit("emojiTo",e)
			}
		}
	}
</script>

<style lang="scss">
	.emoji{
		width: 100%;
		padding: 10rpx;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		.emoji-line{
			display: flex;
			padding: 12rpx;
			.emoji-item{
				flex:1;
				text-align: center;
				font-size: 40rpx;
			}
		}
	}

</style>
