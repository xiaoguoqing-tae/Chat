<template>
	<view>
		<model-calendar 
		:sendYear="toYear" :sendMonth="toMonth"
		:dataSource="signData" :totalNum="sumCount"
		 @dateChange="getData" @clickChange="clickSign"	 >
		 </model-calendar>
		<view class='count'>
			<text>截至目前，已坚持打卡</text>
			<view class='daynumber'>
				<text class='number'>{{sumCount}}</text>
				<text class='day'>天</text>
			</view>
			<text>坚持签到，赢取奖励!</text>
		</view>
	</view>
</template>

<script>
	import modelCalendar from '@/components/Calendar.vue';
	export default {
		data() {
			return {
				toYear: parseInt(new Date().getFullYear()), //本日
				toMonth: parseInt(new Date().getMonth() + 1), //本月
				sumCount: 0,
				signData: [],
				id:""
			}
		},
		components: {
			modelCalendar
		},
		onLoad(e) {
			this.id=e.id
			this.getData();
		},
		methods: {
			clickSign(day){
				this.signData.push(day);
				this.sumCount++
				uni.request({
					url:this.serverUrl+"/user/qiandao",
					method:'post',
					data:{
						id:this.id,
						date:this.signData,
						sumcount:this.sumCount
					},
					success: (res) => {
						console.log(res.data)
					}
				})
			},
			getData(){
				uni.request({
					url:this.serverUrl+"/user/qiandaoDate",
					method:'POST',
					data:{
						id:this.id
					},
					success: (res) => {
						console.log(res.data)
						this.signData = res.data.result[0].date
						this.sumCount = res.data.result[0].sumcount
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	.count .daynumber {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.count .daynumber .day {
		margin-top: 50rpx;
	}

	.count {
		margin: 20rpx;
		padding: 30rpx;
		display: flex;
		text-align: center;
		border-radius: 10px;
		flex-direction: column;
		justify-content: center;
		background-color: #fff;
		align-items: center;
	}

	.count .number {
		color: #fff;
		font-size: 60rpx;
		background-color: #94db98;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 20rpx;
	}

	.monthSum {
		color: red;
		font-size: 40rpx;
	}

	.count text {
		margin: 10rpx;
	}
</style>

