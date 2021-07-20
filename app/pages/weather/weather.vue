<template>
	<view class="content">
		<view class="weather-top">
			<h2 class="top-title">{{address}}</h2>
			<image :src="weatherimg" class="top-img"></image>
		</view>
		<view class="weather-content">
			<view class="weather-temp">
				<view class="weather-wd">
					<h1>{{temp}}℃</h1>
				</view>
				<view class="weather-tq">
					<h1>{{txt}}</h1>
				</view>
			</view>
			<view class="weather-date">
				<h4>23℃-15℃  周五</h4>
			</view>
			<scroll-view scroll-x="true" class="weather-xs-yubao">
				<view class="box" v-for="(item,index) in weatherhourList" :key="index">
					<view>{{item.fxTime}}</view>
					<image :src="item.icon"></image>
					<view>{{item.text}}</view>
					<view>{{item.temp}}℃</view>
				</view>
			</scroll-view>
			<view class="weather-qt-yubao">
				<h3>七天天气预报</h3>
				<view class="box" v-for="(item,index) in weatherdayList" :key="index">
					<view>{{item.fxDate}}</view>
					<view class="qt-tq">
						<image :src="item.iconDay"></image>
						<view>{{item.textDay}}</view>
					</view>
					<view>{{item.tempMax}}/{{item.tempMin}}℃</view>
				</view>
			</view>
			<view class="weather-qx-info">
				<h3>气象信息</h3>
				<view class="box">
					<view class="box-item">
						<view class="til">{{tgwd}}</view>
						<view class="del">体感温度</view>
					</view>
					<view class="box-item">
						<view class="til">{{njd}}</view>
						<view class="del">能见度</view>
					</view>
					<view class="box-item">
						<view class="til">{{qy}}</view>
						<view class="del">气压</view>
					</view>
					<view class="box-item">
						<view class="til">{{jsl}}</view>
						<view class="del">降水量</view>
					</view>
					<view class="box-item">
						<view class="til">{{sd}}</view>
						<view class="del">湿度</view>
					</view>
					<view class="box-item">
						<view class="til">{{fs}}</view>
						<view class="del">{{fx}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weatherList:[],
				weatherimg:"",
				weatherhourList:[],
				weatherdayList:[],
				address:"",
				zuobiao:"",
				txt:"",
				temp:"",
				tgwd:"",
				njd:"",
				qy:"",
				fx:"",
				fs:"",
				sd:"",
				jsl:""
			}
		},
		onLoad(e) {
			this.address=e.address
			this.zuobiao=e.zuobiao
			console.log(this.address)
			console.log(this.zuobiao)
			this.getstorage()
			this.getyubao()
			this.getqiyobao()
		},
		methods: {
			getstorage() {
				try {
					const value = uni.getStorageSync('weather');
					console.log(value)
					if (value) {
						this.weatherList = value
						this.txt=value.now.text
						this.temp=value.now.temp
						this.weatherimg ="../../static/128/"+value.now.icon+".png"
						this.tgwd=value.now.feelsLike+"℃"
						this.njd=value.now.vis+"千米"
						this.jsl=value.now.precip+"毫米"
						this.qy=value.now.pressure+'百帕'
						this.sd=value.now.humidity+'%'
						this.fx=value.now.windDir
						this.fs=value.now.windSpeed+"级"
					}
				} catch (e) {
					console.log("取值失败")
				}
			},
			getyubao(){
				uni.request({
					url:"https://devapi.qweather.com/v7/weather/24h",
					method:"GET",
					data:{
						location:this.zuobiao,
						key:"e93527738a544070b19e4fdf7842096a"
					},
					success:(res=>{
						this.weatherhourList = res.data.hourly
						for(let i=0;i<this.weatherhourList.length;i++){
							this.weatherhourList[i].fxTime = this.weatherhourList[i].fxTime.slice(11,16)
							this.weatherhourList[i].icon = "../../static/color-128/"+this.weatherhourList[i].icon+".png"
						}
					})
				})
			},
			getqiyobao(){
				uni.request({
					url:"https://devapi.qweather.com/v7/weather/7d",
					method:"GET",
					data:{
						location:this.zuobiao,
						key:"e93527738a544070b19e4fdf7842096a"
					},
					success:(res=>{
						this.weatherdayList=res.data.daily
						for(let i=0;i<this.weatherdayList.length;i++){
							this.weatherdayList[i].iconDay = "../../static/color-128/"+this.weatherdayList[i].iconDay+".png"
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		.weather-top{
			width: 100%;
			.top-title{
				text-align: center;
			}
			.top-img{
				width: 100%;
			}
		}
		.weather-content{
			width: 100%;
			.weather-temp{
				padding: $uni-spacing-row-sm;
				display: flex;
				justify-content: space-between;
			}
			.weather-date{
				padding: $uni-spacing-row-sm;
			}
			.weather-xs-yubao{
				padding: $uni-spacing-row-sm;
				// display: flex;
				// flex-wrap: nowrap;
				white-space: nowrap;
				.box{
					display: inline-block;
					width: 22%;
					text-align: center;
					image{
						width: 80rpx;
						height: 80rpx;
					}
				}
			}
			.weather-qt-yubao{
				padding: $uni-spacing-row-sm;
				h3{
					padding-bottom: $uni-spacing-row-sm;
				}
				.box{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.qt-tq{
						display: flex;
						align-items: center;
						width: 25%;
						image{
							width: 80rpx;
							height: 80rpx;
						}
					}
				}				
			}
			.weather-qx-info{
				width: 100%;
				h3{
					padding: $uni-spacing-row-sm;
				}
				.box{
					display: flex;
					flex-wrap: wrap;
					.box-item{
						width: 50%;
						height: 300rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.til{
							font-size: 25px;
						}
						.del{
							color: #808080;
						}
					}
				}
			}
		}
	}
</style>
