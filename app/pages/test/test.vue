<template>
	<view @tap="chooseImg()">测试
		<image v-for="(item,index) in img" :key="index" :src="item"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:"aysgyugxyugsauygy",
				img:[]
			}
		},
		methods:{
			chooseImg(){
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择,相机
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						for(let i=0;i<tempFilePaths.length;i++){
							const uploadTask = uni.uploadFile({
							    url: 'http://172.17.0.111:80/files/upload', //仅为示例，非真实的接口地址
							    filePath: tempFilePaths[i],
							    name: 'file',
							    formData: {
							        'user': 'taeyeon',
									url:"user",
									name:this.id+new Date().getTime()+i
									
							    },
							    success: (uploadFileRes) => {
									let path='user/'+uploadFileRes.data
									this.img.push("http://172.17.0.111:80/"+path)
							        console.log(uploadFileRes.data);
							    }
							});
											
							uploadTask.onProgressUpdate((res) => {
							    console.log('上传进度' + res.progress);
							    console.log('已经上传的数据长度' + res.totalBytesSent);
							    console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
											
							    // 测试条件，取消上传任务。
							    // if (res.progress > 50) {
							    //     uploadTask.abort();
							    // }
							});
						}
				        
				    }
				});
			}
		}
	}
</script>

<style>
</style>
