<template>
	<view class="content">
		<view class="top">
			<input type="text" v-model="search_user" />
			<image src="../../static/search.png" @click="searchFriend()"></image>
			<view class="cancel" @click="back()">取消</view>
		</view>
		<div class="noneData" v-if="isdata">
			<image src="../../static/noneData.png"></image>
			<view>没有找到相关用户</view>
		</div>
		<view class="main" v-if="!isdata">
			<maBtnTab :data="tabParam" v-model="flag" @tabChanged="tabChanged"></maBtnTab>
			<view class="user" :class="usershow">
				<view class="user_info" v-for="(item,index) in datalist" :key="index">	
					<view>
						<image :src="item.imgurl"></image>
						<view class="infobox">
							<view class="name" v-html="item.name"></view>
							<view class="email" v-html="item.email"></view>
						</view>	
					</view>				
					<view v-if="item.isFriend" class="btn" @tap="addFriend(item._id,0)">加好友</view>
					<view v-if="!item.isFriend" class="btn" @tap="sendTo(item._id,1)" style="background: #3CC51F;">发消息</view>
				</view>
			</view>
			<view class="group" :class="groupshow">
				<view class="user_info" v-for="(item,index) in datalistgroup" :key="index">
					<view>
						<image :src="serverUrl+item.imgurl"></image>
						<view class="infobox">
							<view class="name" v-html="item.name"></view>
						</view>	
					</view>				
					<view v-if="!item.ingroup" class="btn" @tap="addgroup(item._id,2)">申请入群</view>
					<view v-if="item.ingroup" class="btn" @tap="sendTogroup(item._id,3)" style="background: #3CC51F;">发消息</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import maBtnTab from "../../components/ma-btn-tab/ma-btn-tab.vue"
	export default {
		data() {
			return {
				tabParam:[{'title':'用户','key':0},{'title':'群组','key':1}],
				flag:0,
				search_user:"",
				datalist:[],
				datalistgroup:[],
				datalistfriend:[],
				isFriend:true,
				uid:"",
				isdata:false,
				isgroup:false,
				imgurl:'',
				usershow:"",
				groupshow:""
			}
		},
		components:{
			maBtnTab
		},
		onLoad() {
			this.getstorage()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id,
						this.imgurl = this.serverUrl+value.imgurl
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			searchFriend(){
				if(this.search_user!==""){
					this.datalist=[]
					uni.request({
						url:this.serverUrl+"/search/user",
						method:"POST",
						data:{
							data:this.search_user
						},
						success:(data) => {
							let arr=data.data.result
							console.log(arr)
							this.datalistfriend=arr
							let exp = eval("/"+this.search_user+"/g");
							arr.forEach(item=>{
								if(this.uid!=item._id){
									if(item.name.search(this.search_user)!=-1 ||item.email.search(this.search_user)!=-1){
										item.imgurl=this.serverUrl+item.imgurl;
										item.name = item.name.replace(exp,"<span style='color:#4AAAFF;'>"+this.search_user+"</span>")
										item.email = item.email.replace(exp,"<span style='color:#4AAAFF;'>"+this.search_user+"</span>")
										this.datalist.push(item)
									}
								}	
							})
							for(let i=0;i<this.datalist.length;i++){
								uni.request({
									url:this.serverUrl+"/search/isfriend",
									method:"POST",
									data:{
										uid:this.uid,
										fid:this.datalist[i]._id
									},
									success: (res) => {
										if(res.data.status==200){
											this.datalist[i].isFriend=false
											this.datalist.splice(i,1,this.datalist[i])
										}else if(res.data.status==400){
											this.datalist[i].isFriend=true
											this.datalist.splice(i,1,this.datalist[i])
										}else{
											uni.showToast({
												title:"服务器出错",
												icon:"none"
											})
										}
									}
								})
							}
						}
					})
					uni.request({
						url:this.serverUrl+"/search/group",
						method:"POST",
						data:{
							data:this.search_user
						},
						success:(data) => {
							let arr=data.data.result
							this.datalistgroup=arr
							console.log(arr)
							if(arr.length==0){
								this.isgroup=true
							}
							for(let i=0;i<this.datalistgroup.length;i++){
								uni.request({
									url:this.serverUrl+"/search/isingroup",
									method:"POST",
									data:{
										uid:this.uid,
										gid:this.datalistgroup[i]._id
									},
									success: (res) => {
										if(res.data.status==200){
											this.datalistgroup[i].ingroup=true
											this.datalistgroup.splice(i,1,this.datalistgroup[i])
										}else if(res.data.status==400){
											this.datalistgroup[i].ingroup=false
											this.datalistgroup.splice(i,1,this.datalistgroup[i])
										}else{
											uni.showToast({
												title:"服务器出错",
												icon:"none"
											})
										}
									}
								})
							}
						}
					})				
				}
			},
			tabChanged(i){
				console.log(i)
				if(i==0){
					this.usershow = "f_in"
					this.groupshow = "f_out"
				}else{
					this.usershow = "f_out"
					this.groupshow = "f_in"
				}
			},
			back(){
				uni.switchTab({
					url:"../index/index"
				})
			},
			addFriend(fid,n){
				uni.navigateTo({
					url: '../userhome/userhome?friendId='+fid+"&isfriendNum="+n
				});
			},
			addgroup(gid,n){
				uni.navigateTo({
					url: '../userhome/userhome?group='+gid+"&isfriendNum="+n
				});
			},
			sendTogroup(gid,n){
				uni.navigateTo({
					url: '../userhome/userhome?group='+gid+"&isfriendNum="+n
				});
			},
			sendTo(fid,n){
				uni.navigateTo({
					url: '../userhome/userhome?friendId='+fid+"&isfriendNum="+n
				});
			}
		}
	}
</script>

<style lang="scss">
	.f_in{
		transition:all 0.6s !important;
		opacity: 1 !important;
	}
	.f_out{
		transition:all 0.6s !important;
		opacity: 0 !important
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
	}
	.top{
		position: relative;
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid rgba(0,0,0,0.1);
		input{
			width: 600rpx;
			height: 60rpx;
			background: #F3F4F6;
			border-radius: 10rpx;
		}
		image{
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: 140rpx;
		}
		.cancel{
			font-size: 14px;
			color: #272832;
		}
	}
	.main{
		width: 100%;
		.user{
			opacity: 1;
		}
		.group{
			opacity: 0;
		}
		.user,.group{
			padding-left: 32rpx;
			font-size: 22px;
			color: #272832;
			position: absolute;
			top: 190rpx;
			width: 100%;
			// display: flex;
			// flex-direction: column;
			.user_info{
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				image{
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				.infobox{
					padding-left: 20rpx;
					display: flex;
					flex-direction: column;
				}
				.email{
					float: left;
					font-size: 26rpx;
					color: #272832;
					display: inline;
					// padding: 10rpx 0 0 20rpx;
				}
				.name{
					float: left;
					font-size: 40rpx;
					color: #272832;
					display: inline;
					// padding: 10rpx 0 0 20rpx;
				}
				.btn{
					float: right;
					width: 120rpx;
					height: 48rpx;
					background: #5EA9C9;
					margin-right: 32rpx;
					margin-top: 10rpx;
					border-radius: 20rpx;
					font-size: 12px;
					color: #272832;
					text-align: center;
					line-height: 48rpx;
				}
			}
			.group_info{
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
	.noneData{
		width: 100%;
		text-align: center;
		color: #5EA9C9;
		font-size: 40rpx;
	}
</style>
