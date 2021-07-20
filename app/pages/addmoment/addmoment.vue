<template>
	<view>
		<view class="head">
			<image class="left" src="../../static/fanhui.png" @tap="navback"></image>
			<button class="right" @tap="addmoments">发表</button>
		</view>
		<view class="main">
			<textarea v-model="msg" class="main-text" placeholder="分享此刻所想" maxlength="-1"></textarea>
			<g-upload ref='gUpload' :mode="imgList" @chooseFile='chooseFile' @imgDelete='imgDelete' :control='control'
			 :columnNum="columnNum"></g-upload>
		</view>
	</view>
</template>

<script>
	import gUpload from "@/components/g-upload/g-upload.vue"
	import {dateTime,fileName,formatDateTime} from "../../commons/js/myfun.js"
	export default {
		components: {
			gUpload
		},
		data() {
			return {
				msg: "",
				uid: "",
				title: 'Hello',
				control: true,
				columnNum: 4,
				imgList: [],
				url: [],
				urlarr:[],
				token:"",
				imgurl:"",
				name:""
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
						this.name = value.name
						this.uid = value.id
						this.token=value.token
						this.imgurl = value.imgurl
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			navback() {
				uni.navigateBack({
					delta: 1
				});
			},
			//点击上传控件上传
			uploadImg() {
				this.$refs.gUpload.uploadImg()
			},

			/*
			上传后返回的值：
			list：上传后图片数组
			v：返回当前上传图片的临时路径
			*/
			chooseFile(list, v) {
				console.log("上传图片_list：", list)
				console.log("上传图片_v：", v);
				this.url = list
				// this.uploadFileToServe(v)
			},

			/*
			删除图片：
			list：删除返回删除后剩余的图片数组
			eq：返回删除的数组
			*/
			imgDelete(list, eq) {
				console.log("删除图片_list：", list)
				console.log("删除图片_eq：", eq)
			},
			addmoments() {
				this.uploadFileToServe()
				setTimeout(()=>{
					uni.request({
						url:this.serverUrl+"/moments/msg",
						method:"POST",
						data:{
							id:this.uid,
							name:this.name,
							imgurl:this.imgurl,
							message:this.msg,
							url:JSON.stringify(this.urlarr)
						},
						success: (res) => {
							uni.showToast({
								title:"发布成功",
								icon:"none",
								success: () => {
									setTimeout(()=>{
										uni.switchTab({
											url:"../moments/moments",
											success(e) {
											    var page = getCurrentPages().pop();
												console.log(page)
											    if (page == undefined || page == null) return;
											    page.$vm.navigateHandle();
											}
										})
									},500)
								}
							})
						}
					})
				},500)
			},
			// addmoments() {
			// 	this.uploadFileToServe()
			// 	setTimeout(()=>{
			// 		uni.request({
			// 			url:this.serverUrl+"/moments/getmsg",
			// 			method:"POST",
			// 			data:{
			// 				uid:this.uid,
			// 				state:0,
			// 				token: this.token
			// 			},
			// 			success: (res) => {
			// 				console.log(res.data)
			// 			}
			// 		})
			// 	},500)
			// },
			//上传图片
			uploadFileToServe() {
				var url = fileName(new Date());
				if (!this.url || this.url.length <= 0) {
					return
				};
				for (let i = 0; i < this.url.length; i++) {
					uni.uploadFile({
						url:this.serverUrl+'/files/upload',
						filePath: this.url[i],
						name: 'file',
						formData: {
							url:url,
							name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10)+Math.ceil(Math.random()*10),
						},
						success: (uploadFileRes) => {
							this.urlarr.push(uploadFileRes.data)
							console.log(uploadFileRes.data);
						}
					});
				}
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
		padding-top: var(--status-bar-height);

		.left {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 24rpx;
			bottom: 20rpx;

		}

		.right {
			text-align: center;
			line-height: 90rpx;
			width: 150rpx;
			height: 90rpx;
			position: absolute;
			background: #3CC51F;
			right: 5rpx;
			top: var(--status-bar-height);
			border-radius: 10rpx;
		}
	}

	.main {
		padding-top: 88rpx;
		width: 100%;
		height: 400rpx;

		.main-text {
			padding-top:var(--status-bar-height);
			width: 90%;
			margin-left: 5%;
		}
	}
</style>
