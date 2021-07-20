<template name="drift">
	<view class="xd-drift">
		<image style="width: 100%; height: 100%; "    src="../../static/xiaodiu-drift/drift_home.png" ></image>
		<image    class="drift-plp"     :style="{top:plptop+'px'}"  src="../../static/xiaodiu-drift/drift_plp.png" ></image>
		<view class="drift-bo1"  :style="{left:(btleft-5)+'px'}" >
			<image    v-for="one in bolist1" class="drift-mbo"     src="../../static/xiaodiu-drift/drift_mbo1.png" ></image>
			
		</view>
		   <view class="drift-bo2"  :style="{left:btleft+'px'}" >
		   	<image    v-for="one in bolist1" class="drift-mbo"     src="../../static/xiaodiu-drift/drift_mbo2.png" ></image>
		   	
		   </view>
		   
		    	 
		 
		<view class="drift-btv"  >
			<image style="width: 31px; height: 31px;  "    src="../../static/xiaodiu-drift/drift_bt.png" ></image>
			<text>我的瓶子</text>
		</view>
		 
	</view>
</template>

<script>
	export default {
	    name: "drift",
	    //属性
		 data () {
		    return {
		      btleft: 0,
			  btleft1:0,
			  bolist1:30,
			  windowWidth:0,
			  plptop:55,
			  plpadd:1,
			  
		    }
		  },
	    props: {
	      plpspeed:{
			  type:Number,
			  default : 1,
		  },
		  bospeed:{
		  			  type:Number,
		  			  default : 1,
		  } 
	        
	    },
	    //组件生命周期
	    created:function(e){
			var that=this;
			uni.getSystemInfo({
			    success: function (res) {
			        
					that.windowWidth=res.windowWidth;
					this.btleft=100-res.windowWidth;
					 
			    }
			});
			
			
			
	     this.beijing();
		 
	    },
	    methods: {
	        showBt:function(obj){
	         
	        },
			beijing:function(){
				
				this.btleft+=this.bospeed;
				
				this.plptop=this.plptop+ this.plpadd;
				
				if(this.plptop<=55){
					this.plpadd=this.plpspeed;
				}
				if(this.plptop>=60){
					this.plpadd=-this.plpspeed;
				}
			 
			 
			 
				if(this.btleft+100>=0) this.btleft=100-this.windowWidth;
				
				var that=this;
				setTimeout(function () {
				  that.beijing();
				}, 100);
			}
	    }
	}
</script>


<style>
.xd-drift{
 
	width:100%;
	height:250px; 
}

.drift-plp{
	width:26px;
	height:37px;
 	position:fixed;
	top:59px;
	left:88px;
	 
}

.drift-bo1{
	position:fixed;
	top:70px;
	left:0;
	width:200%;
	 height: 25px; 
	 overflow:hidden
}

.drift-bo2{
	position:fixed;
	top:80px;
	left:0;
	width:200%;
	 height: 25px; 
	 overflow:hidden
}

.drift-mbo{
	 width: 44px; 
	height: 22px; 
	 
}
.drift-btv{
	position:relative;
	font-size:14px;
	bottom:50px;
	left:30px; 
}
.drift-btv{
	 line-height:31px;
}
.drift-btv image
{
		vertical-align:middle;justify-content: center;align-items:center;
}
 
</style>