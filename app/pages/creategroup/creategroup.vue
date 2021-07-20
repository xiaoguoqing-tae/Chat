<template>
	<div>
		<view class="head">
			<view class="cancel">取消</view>
			<view class="title">创建群聊</view>
			<view class="confirm">确定</view>
		</view>
		<view class="content">
			<view class="content_txt">胡思很喜欢四十</view>
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
		
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.head{
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
		.cancel{
			margin-left: 32rpx;
		}
		.confirm{
			color: #4AAAFF;
			margin-right: 32rpx;
		}
		.title{
			font-size: 20px;
		}
	}
	.content{
		.content_txt{
			position: absolute;
			top: 112rpx;
			left: 32rpx;
			width: 642rpx;
			height: 386rpx;
			background: #F3F4F6;
			border-radius: 10px;
			padding: 22rpx;
		}
	}
</style>
