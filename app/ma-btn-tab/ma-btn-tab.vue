<template>
	<view>
		<view class="btn-tab">
			<view v-for="(item,index) in data" :key ="index" class="btn btn-right" :class="item.key==value?'tab-choosed':''" @click="tabChanged(item.key)">{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "maBtnTab",
		props:[
			'data',
			'value'
		],
	   data() {
		   return {
			   flag : this.value
		   }
	   },
		methods: {
			tabChanged(value){
				this.$emit('input', value)
				this.$emit('tabChanged', value)
			}
		}
	}
</script>

<style scoped>
  .btn-tab{
  	display: flex;
  	/*color: #fff;*/
  	padding: 5px 15px;
  }
  .btn{
  	 position: relative;
  	padding: 5px 0px;
  }
  .btn:after{
	content: '';
	display: block;
	position: absolute;
	/*border: 1px transparent solid;*/
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 0px;
	height: 2px;
	background-color: #3BC1FF;
	box-sizing: border-box;

  }
  
  .btn-left{
  	width: 100%;
  	text-align: center;
  }
  .btn-right{
  	width: 100%;
  	text-align: center;
  }
  .tab-choosed:after{
	/*border-bottom-style: solid;
  	border-bottom-color: #3BC1FF;
	border-bottom-width: 100%;
	border-bottom-width: 2px;
	*/
	height: 2px;
	width: 100%;
	transition:all 1s;
	
	/*animation: anmition-boder-bottom 0.5s 1;*/
  }
  
</style>
