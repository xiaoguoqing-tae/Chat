<template>
	<view class="box">
		<view class="result flex_col flex_col_2">
			<view class="align_l">时间：{{time}}</view>
			<view class="align_r">得分：{{countResult}}</view>
		</view>
		<view class="flex_col flex_col_3 flex_wrap">
			<view class="item" v-for="(item,index) in list" :key="index" @tap="whack(index)">
				<image src="/static/hole.png" mode="aspectFit" class="hole"></image>
				<image src="/static/mouse.png" mode="aspectFit" class="mouse" v-show="item == 1"></image>
				<image src="/static/boom.png" mode="aspectFit" class="boom" v-show="item == 2"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[0,0,0,0,0,0,0,0,0],	//数值说明 0:无状态,1:老鼠显示,2:砸中状态
				result:0,
				time:30,
				flag:true,
				id:""
			}
		},
		mounted() {
			this.showMouse();
			this.downTime();
		},
		onLoad(e) {
			this.id = e.id
		},
		computed:{
			// 计算结果，使用计算函数，可方便管理得分基数
			countResult(){
				return this.result * 10;
			}
		},
		onUnload(){
			// 页面关闭移除计时器，否则app平台有BUG
			clearTimeout(this.aTime);
			clearInterval(this.bTime);
			clearInterval(this.cTime);
		},
		methods: {
			// 锤打
			whack(i){
				// 非老鼠显示状态则结束事件
				if(this.list[i] != 1){
					return;
				}
				
				if(!this.flag){
					uni.showToast({
						title:'时间已结束',
						icon:'none'
					})
					return;
				}
								
				this.$set(this.list,i,2);
				this.result ++ ;
				
				// 创建匿名函数，使当前序号拥有独立作用域（减少BUG产生）
				((j)=>{
					this.aTime = setTimeout(()=>{
						this.$set(this.list,j,0);
					},800);
				})(i)
			},
			// 显示老鼠
			showMouse(){
				// 获取有效的洞穴,避免重复渲染
				let effective = ()=>{
					let arr = [];
					this.list.forEach((v,i)=>{
						// 将无状态的洞穴添加到可用数组中
						if(v == 0){
							arr.push(i);
						}
					})
					
					return arr;
				}
				
				this.bTime = setInterval(()=>{
					if(!this.flag){
						return;
					}
					let effectiveArr = effective();
					
					// 当可用洞穴数小于3个时不再显示更多的老鼠
					if(effectiveArr.length<4){
						return;
					}
					
					// 随机获得一个可用的洞穴序号
					let r = Math.floor(Math.random()*effectiveArr.length);
					
					// 将可用的洞穴显示老鼠
					this.$set(this.list,effectiveArr[r],1);
				},500);
			},
			// 重新开始
			restart(){
				this.list=[0,0,0,0,0,0,0,0,0];
				this.result=0;
				this.time = 30;
				this.flag = true;
			},
			// 倒计时
			downTime(){
				this.cTime = setInterval(()=>{
					if(this.time>0){
						this.time -- ;
					}else{
						if(this.flag){
							this.flag = false;
							showPop();
						}
					}
				},1000);
				
				let showPop = ()=>{
					uni.request({
						url:this.serverUrl+"/user/mouse",
						method:"POST",
						data:{
							id:this.id,
							score:this.countResult
						},
						success: (res) => {
							if(res.data.status==200){
								uni.showModal({
									title:"游戏结束",
									content:`得分：${this.countResult}`,
									cancelText:"不玩了",
									confirmText:"重新挑战",
									success:(e)=>{
										if(e.confirm){
											this.restart();
										}
									}
								})
							}else if(res.data.status==300){
								uni.showModal({
									title:"破纪录",
									content:`得分：${this.countResult}`,
									cancelText:"不玩了",
									confirmText:"重新挑战",
									success:(e)=>{
										if(e.confirm){
											this.restart();
										}
									}
								})
							}else if(res.data.status==500){
								uni.showToast({
									title:"服务器出错",
									icon:"none"
								})
							}else{
								uni.showModal({
									title:"很遗憾，未破纪录",
									content:`得分：${this.countResult}`,
									cancelText:"不玩了",
									confirmText:"重新挑战",
									success:(e)=>{
										if(e.confirm){
											this.restart();
										}
									}
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
	@import "../../commons/global.scss";
	page{
		background-color: #45454d;
	}
	.box{
		.result{
			line-height: 100rpx;
			padding: 50rpx 30rpx;
			font-size: 40rpx;
			color: #fff;
		}
		
		.item{
			height: 250rpx;
			position: relative;
			
			>image{
				position: absolute;
				
				&.hole{
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					z-index: 1;
				}
				
				
				&.mouse{
					width: 66%;
					height: 66%;
					top: 17%;
					left: 17%;
					z-index: 2;
				}
				
				&.boom{
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					z-index: 3;
				}
			}
		}
	}
</style>