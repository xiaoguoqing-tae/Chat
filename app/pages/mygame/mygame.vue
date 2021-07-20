<template>
	<view>
		<view class="box" @tap="playmouse()">
			<image src="../../static/OIP.jpg"></image>
			<view>打地鼠</view>
		</view>
		<view class="box" @tap="plp()">
			<image src="../../static/OIP.jpg"></image>
			<view>漂流瓶</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:""
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
						this.id = value.id
					}
				} catch (e) {
					console.log("取值失败")
				}
			}, 
			playmouse(){
				uni.navigateTo({
					url:"../playmouse/playmouse?id="+this.id
				})
			},
			plp(){
				uni.navigateTo({
					url:"../plp/plp?id="+this.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		padding: 20rpx;
		display: flex;
		align-items: center;
		font-size: 50rpx;
		font-weight: bold;
		border-bottom: 1px solid #EEEEEE;
		image{
			width: 100rpx;
			height: 100rpx;
			padding-right: 20rpx;
		}
	}
	
</style>
