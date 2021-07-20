<template>
	<view>
		<view class="head">
			群主审批
			<image src="../../static/fanhui.png" @tap="navBack()"></image>
		</view>
		<view class="apply-list">
			<view class="user-info" v-for="(item,index) in applylist" :key="index">
				<image :src="serverUrl+item.imgurl"></image>
				<view class="other-info">
					<view class="time">{{item.time}}</view>
					<view class="info">
						<view>{{item.name}}</view>
						<view class="btn-box">
							<view class="btn agree" @tap="hearderApply(1,item.groupID,item.userID,index)">同意</view>
							<view class="btn refuse" @tap="hearderApply(0,item.groupID,item.userID,index)">拒绝</view>
						</view>						
					</view>
				</view>
			</view>
		</view>
		<image v-if="isshow" style="width: 100%;" src="../../static/groupimg.jpg"></image>
	</view>
</template>

<script>
	import {dateTime} from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				applylist:[],
				isshow:false
			}
		},
		onLoad() {
			this.getstorage()
			console.log(this.applylist)
			this.init()
		},
		methods: {
			getstorage() {
				try {
					this.applylist = JSON.parse(uni.getStorageSync('applylist'));
				} catch (e) {
					console.log("取值失败")
				}
			},
			init(){
				if(this.applylist.length==0){
					this.isshow=true
				}
				for(let i=0;i<this.applylist.length;i++){
					this.applylist[i].time = dateTime(this.applylist[i].time)
				}
			},
			navBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			hearderApply(i,gid,uid,index){
				uni.request({
					url:this.serverUrl+"/group/headerapply",
					data:{
						todo:i,
						groupID:gid,
						userID:uid
					},
					method:"POST",
					success: (res) => {
						if(res.data.status==200){
							if(i==1){
								uni.showToast({
									title:"已进群",
									icon:"none"
								})
							}else{
								uni.showToast({
									title:"已拒绝",
									icon:"none"
								})
							}
							this.applylist.splice(index,1)
							if(this.applylist.length==0){
								this.isshow=true
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	.apply-list{
		width: 100%;
		.user-info{
			padding: 10rpx;
			width: 100%;
			display: flex;
			border-bottom: 2rpx solid #CCCCCC;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 20%;
			}
			.other-info{
				flex: 1;
				display: flex;
				flex-direction: column;
				.info{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.btn-box{
						display: flex;
						.btn{
							width: auto;
							height: auto;
							padding: 10rpx;
							border-radius: 25%;
							margin-right: 30rpx;
						}
						.agree{
							background: $uni-color-success;
						}
						.refuse{
							background: $uni-color-warning;
						}
					}
				}
			}
		}
	}
</style>
