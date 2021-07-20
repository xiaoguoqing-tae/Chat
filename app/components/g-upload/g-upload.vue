<template>
  <view class="imglistbx">
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" v-for="(item,index) in showList" :key='index'>
      <image :src="item" class="itemImg" @click="previewImage(index)" mode="aspectFill"></image>
      <icon size="18" type="cancel" class="cancelBtn" @click="deleteImg(index)" v-if="deleteBtn"></icon>
    </view>
    <!-- 上传控件 -->
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" @click="uploadImg" v-if="control">
      <view class="itemImg uploadControl">+</view>
    </view>
    <view class="clear"></view>
  </view>
</template>

<script>
  export default {
    props: {
      //是否显示上传控件
      control: {
        type: Boolean,
        default: true
      },
      //是否显示上删除按钮
      deleteBtn: {
        type: Boolean,
        default: true
      },
      //行数量 
      columnNum: {
        type: [Number, String],
        default: 4
      },
      //服务返回回调的图片数组--回填
      mode: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        imgList: [],
        showList: []
      }
    },
    watch: {
      mode(v) {
        this.init(v)
      }
    },
    created() {
      this.init(this.mode)
    },
    methods: {
      init(v) {
        if (this.mode.length != 0) {
          this.showList = v;
          return
        };
        this.showList = this.imgList;
      },
      // 上传图片
      uploadImg() {
        uni.chooseImage({
          sizeType: ['compressed '],
          count: 8,
          success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            tempFilePaths.forEach((item) => {
              this.imgList.push(item);
			  if(this.imgList.length==9){
				  this.control=false
			  }
            })
            this.$emit("chooseFile", this.imgList, tempFilePaths)
          }
        });
      },
      //删除图片
      deleteImg(eq) {
        let getUrl = this.handleImg();
        getUrl.splice(eq, 1);
        this.$emit("imgDelete", getUrl, eq)
      },
      // 预览图片
      previewImage(eq) {
        let getUrl = this.handleImg();
        uni.previewImage({
          current: getUrl[eq],
          urls: getUrl
        })
      },
      //返回需要操作的图片数组
      //如果是回调了则操作回填后的数组 否则操作临时路径的图片数组
      handleImg() {
        return this.mode.length > 0 ? this.showList : this.imgList
      },
    }
  }
</script>

<style scoped>
  /* 上传  str */
  .imglistbx {
    width: 100%;
    height: 100%;
  }

  .imglistItem {
    position: relative;
    float: left;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }

  .column3 {
    width: 33.3333%;
    height: 160rpx;
  }

  .column4 {
    width: 25%;
    height: 130rpx;
  }

  .itemImg {
    width: 70%;
    height: 100%;
    margin: 0 auto;
    display: block;
    border-radius: 10rpx;
  }

  .cancelBtn {
    position: absolute;
    top: -10rpx;
    right: 10rpx;
  }

  /* 上传控件 */
  .uploadControl {
    font-size: 50rpx;
    color: #888;
    background-color: #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /*  上传  str end*/
  .clear {
    clear: both;
  }
</style>
