<template>
	<view>
		<view class="head">
			详细信息
			<image src="../../static/fanhui.png" @tap="navBack()"></image>
		</view>
		<view v-if="ishead" class="group-apply" @tap="todealapply">
				<view>申请列表</view>
				<view class="tip" v-if="applyNum>0">{{applyNum}}</view>
		</view>
		<view class="group-user">
			<view class="group-user-info"  v-for="(item,index) in groupuserlist" :key="index">
				<image :src="serverUrl+item.imgurl"></image>
				<view>{{item.name}}</view>
			</view>		
		</view>
		<view class="look">查看全部</view>
		<view class="group-name" @tap="modify('群聊名称',gname)">
			<view>群聊名称</view>
			<view>
				{{gname}}
				<image class="right" src="../../static/right.png"></image>
			</view>
		</view>
		<view class="group-notice" @tap="modify('群公告',gnotice)">
			<view>群公告</view>
			<view class="notice">
				<view class="notice-left">
					{{gnotice}}
				</view>
				<view class="notice-right">
					<image class="right" src="../../static/right.png"></image>
				</view>			
			</view>
		</view>
		<view v-if="!ishead" class="group-out" @tap="outGroup">退出该群</view>
		<view v-if="ishead" class="group-out" @tap="deleteGroup">解散该群</view>
		<view class="modify" :style="{bottom: -winHeight+'px'}" :animation="animateData">
			<view class="modify-header">
				<view class="close" @tap="modify('取消')">取消</view>
				<view class="title">{{updateTitle}}</view>
				<view class="define" @tap="define">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gid:"",
				gname:"",
				gimg:"",
				ishead:false,
				uid:"",
				token:"",
				gnotice:"U盾四吃奶OA平均承诺粗大皇帝噶胡和传播阿囧吃葱为奥将从为阿赎回的催化崔好菜哦很粗出护士崔黄翠花对首次U盾hiUSD换成传才会删除导出删除此次删除",
				applyNum:0,
				groupuserNum:0,
				applylist:[],
				groupuserlist:[],
				data:"",
				winHeight:0,
				animateData:{},
				updateTitle:"",
				isModify:false,
				type:""
			}
		},
		onLoad(e) {
			this.gid = e.id
			this.gname = e.name
			this.gimg = e.img
			this.getstorage()
			this.getgroupdetail()
			this.getgroupuser()
		},
		onReady(){
			this.getStyle()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.token = value.token
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			getStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					this.winHeight = data.height
					console.log(data)
				}).exec();
			},
			//弹窗
			modify(type,data){
				if(type=="群聊名称"){
					this.type='name'
				}else{
					this.type='notice'
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
				uni.request({
					url:this.serverUrl+"/group/GroupUpdate",
					method:'POST',
					data:{
						id:this.gid,
						type:this.type,
						data:this.data,
						token:this.token
					},
					success:(res=>{
						if(res.data.status==200){
							if(this.type=='name'){
								this.gname=this.data
							}else if(this.type=="notice"){
								this.gnotice=this.data
							}
							this.modify()
						}else{
							uni.showToast({
								title:"服务器出错",
								icon:'none'
							})
							this.modify()
						}
					})
				})
			},
			navBack(){
				uni.navigateBack()
			},
			todealapply(){
				uni.navigateTo({
					url:"../groupapply/groupapply"
				})
			},
			//获取群详情
			getgroupdetail(){
				uni.request({
					url:this.serverUrl+"/group/detail",
					method:"POST",
					data:{
						id:this.gid
					},
					success: (res) => {
						this.gname = res.data.result.name
						this.gnotice=res.data.result.notice
						if(this.uid==res.data.result.userID){
							this.ishead=true
						}
					}
				})
			},
			//获取群成员
			getgroupuser(){
				uni.request({
					url:this.serverUrl+"/group/getgroupuser",
					method:"POST",
					data:{
						gid:this.gid
					},
					success: (res) => {
						let data = res.data.result
						console.log(data)
						for(let i=0;i<data.length;i++){
							if(data[i].state==0){
								this.applylist.push(data[i])
								this.applyNum=this.applyNum+1
							}else{
								this.groupuserlist.push(data[i])
								this.groupuserNum=this.groupuserNum+1
							}
						}
						console.log(this.applylists)
						uni.setStorage({
						    key: 'applylist',
						    data: JSON.stringify(this.applylist),
						    success: function () {
						        console.log('success');
						    }
						});
						uni.setStorage({
						    key: 'groupuserlist',
						    data: JSON.stringify(this.groupuserlist),
						    success: function () {
						        console.log('success');
						    }
						});
					}
				})
			},
			//解散该群
			deleteGroup(){
				uni.showModal({
				    title: '提示',
				    content: '确定解散该群?',
				    success: (res)=>{
				        if (res.confirm) {
				            uni.request({
								url:this.serverUrl+"/group/deletegroupuser",
								method:'POST',
								data:{
									groupID:this.gid,
									token:this.token
								},
								success:(res=>{
									if(res.data.status==200){
										uni.switchTab({
											url:"../group/group",
											success(e) {
											    var page = getCurrentPages().pop();
											    if (page == undefined || page == null) return;
											    page.$vm.navigateHandle();					
											}
										})
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
			//退出该群
			outGroup(){
				uni.showModal({
				    title: '提示',
				    content: '确定退出该群?',
				    success:(res=>{
						if (res.confirm) {
						    uni.request({
								url:this.serverUrl+"/group/outGroup",
								method:'POST',
								data:{
									groupID:this.gid,
									userID:this.uid,
									token:this.token
								},
								success:(res=>{
									if(res.data.status==200){
										uni.switchTab({
											url:"../group/group"
										})
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
					})			        
				});
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
	.group-apply{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		padding: 20rpx 0 20rpx 20rpx;
		justify-content: flex-start;
		border-bottom: 20rpx solid #D5D5D6;
		.tip{
			margin-left: 20rpx;
			text-align: center;
			width: 70rpx;
			height: auto;
			border-radius: 50%;
			background: red;
		}
	}
	.group-user{
		padding-top: 20rpx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		height: 400rpx;
		overflow: hidden;
		.group-user-info{
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-left: 3.5%;
			width: 16%;
			height: 160rpx;
			image{
				border-radius: 15%;
				width: 100%;
				height: 100%;
			}
		}
		.more{
			max-width: 20%;
			margin-left: 4%;
			height: 120rpx;
			text-align: center;
		}
	}
	.look{
		color: #D5D5D6;
		text-align: center;
		padding-bottom: 20rpx;
		border-bottom: 20rpx solid #D5D5D6;
	}
	.group-name{
		width: 90%;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		.right{
			padding-left: 10rpx;
			width: 28rpx;
			height: 28rpx;
		}
	}
	.group-notice{
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		border-top: 2rpx solid #D5D5D6;
		border-bottom: 20rpx solid #D5D5D6;
		.notice{
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #CCCCCC;
			.notice-right{
				width: 10%;
				.right{
					padding-left: 10rpx;
					width: 28rpx;
					height: 28rpx;
				}
			}
			.notice-left{
				padding: 20rpx 10rpx 0 10rpx;
				flex: 1;
				overflow : hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}	
	}
	.group-out{
		width: 100%;
		height: 100rpx;
		border-bottom: 20rpx solid #D5D5D6;
		color: red;
		text-align: center;
		line-height: 100rpx;
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
