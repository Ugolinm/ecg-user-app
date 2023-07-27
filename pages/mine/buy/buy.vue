<template>
	<view class="home" >
		<Nav title="套餐服务" :back="true" @back="onBack"/>
	
		<view class="box">
			<view class="count-box">
				<view>
					<text class="count-title">激活福利</text>
				</view>
				<view>
					<text class="count-title2">扫描二维码获取新机福利</text>
				</view>
				<image src="../../static/mine/buy/1.png" style="float:left;margin-top: -50px;margin-left:calc(100% - 85px);width: 50px;height:50px;" @click="scan"></image>
			</view>
				
			<view class="price-box" :style="{ height: priceBoxHeight + 'px' }">
				<text class="price-title" style="margin-left:55px;z-index:0;">购买套餐</text>
				<image class="bg" src="../../static/mine/buy/2.png"></image>
				<image class="line" src="../../static/mine/line.png" mode=""></image>
				<view>
					<text class="price-title" style="float: left;margin-top:-25px;margin-left:16px">服务内容</text>
				</view>
			
				<image style="margin-top: 24px;margin-left:15px;width: 10px;height: 10px;" src="../../static/mine/buy/3.png"></image>
				<view>
					<text class="price-title2" style="margin-top: -18px;margin-left:32px;width:calc(100% - 75px);">由专业心电医生为您提供数据解读服务。</text>
				</view>
				<image style="margin-top: 29px;margin-left:15px;width: 10px;height: 10px;" src="../../static/mine/buy/3.png"></image>
				<view>
					<text class="price-title2" style="margin-top: -19px;margin-left:32px;width:calc(100% - 75px);">该套餐次数可累加。</text>
				</view>
				
				<view class="Grid">
					<view class="Grid-Item" :class="{'Grid-ItemS': priceSelect.indexOf(index)!=-1}"
						            v-for="(item,index) in List" 
						            :key="index" @tap="selectPrice(index)">
						<view class="Gtitle">{{ item.quantity}}次</view>
						<view class="Gtitle2">￥{{ item.amount}}</view>
						<view class="Gtitle3">￥{{ item.old_amt}}</view>
						<view class="Gline"></view>
					</view>
				</view>
				
			</view>
		
			<view class="type-box">
				<view v-if="fullwidth == 355 && fullHeight==792">
					<text class="type-title2">支付方式</text>
					<image src="../../static/mine/buy/4.png" style="position: flex;margin-top: 22px;margin-left:125px;width: 17px;height:15px;"></image>
					<text class="type-title">微信支付</text>
				</view>
				<view v-else>
					<text class="type-title2">支付方式</text>
					<image src="../../static/mine/buy/4.png" style="position: flex;margin-top: 22px;margin-left:150px;width: 17px;height:15px;"></image>
					<text class="type-title">微信支付</text>
				</view>
			</view>
			
			<button class="geo-btn primary full large bold" style="margin-top: 15px;margin-left: 15px;width: calc(100% - 30px);" @tap="buttonTap">立即支付</button>
			
			<zwy-popup v-bind:ishide="isshow" width="335px" height="307px" radius="10px">
				<!-- 自定义展示内容 -->
				<view class="content">
					<view class="title">新机福利</view>
					<image class="warnIcon" src="../../static/mine/buy/5.png"></image>
					<view class="subTitle">
						<text>恭喜成功兑换心电服务</text>
						<text style="color: #02CD88;font-size: 18px;">3</text>
						<text>次</text>
					</view>
					<button class="btn" type="default" @click="confirm" 
					style="position: fixed;bottom: 20px;width: 130px;border-radius: 22.5px; background-color: #01CC88;color: #FFFFFF;">我知道了</button>
				</view>
			</zwy-popup>
			<zwy-popup v-bind:ishide="isshow2" width="335px" height="307px" radius="10px">
				<!-- 自定义展示内容 -->
				<view class="content">
					<view class="title">新机福利</view>
					<image class="warnIcon" src="../../static/mine/buy/6.png"></image>
					<view class="subTitle">新机福利已被领取</view>
					<button class="btn" type="default" @click="confirm" 
					style="position: fixed;bottom: 20px;width: 130px;border-radius: 22.5px; background-color: #01CC88;color: #FFFFFF;">我知道了</button>
				</view>
			</zwy-popup>
			<zwy-popup v-bind:ishide="isshow3" width="335px" height="307px" radius="10px">
				<!-- 自定义展示内容 -->
				<view class="content">
					<view class="title">异常</view>
					<image style="width: 88px;height: 88px;margin-top: 20px;" src="../../static/mine/buy/7.png"></image>
					<view class="subTitle" style="margin-top: 20px;">二维码异常无法识别</view>
					<button class="btn" type="default" @click="confirm" 
					style="position: fixed;bottom: 20px;width: 130px;border-radius: 22.5px; background-color: #01CC88;color: #FFFFFF;">我知道了</button>
				</view>
			</zwy-popup>
		</view>
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				priceBoxHeight:200,
				isshow:false,
				isshow2:false,
				isshow3:false,
				wx_user_store : useWxUserStore(),
				List:[],
				priceSelect:[0],
				requestStatus : false,
				fullwidth: '',
				fullHeight: ''

			
			}
		},
		onLoad() {
			//获取价目表
			uni.request({
				url: `https://admin.alphaecg.cn/price-list`,
				header: {},
				method: "GET",
				success: (res:any) => {
					console.log( "获取价目表", res.data)
					
					if (res.data['error']){
						uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
						return false;
					}
			
					this.List = res.data
				
					var number = res.data.length/3
					if (String(number).indexOf('.') !== -1) {
						number = parseInt(number) + 1
					} 
					console.log( "number", number)
					this.priceBoxHeight = number*125 + 200
					
					
				},fail: (err: any) => {
					console.log( "err:", err)
				}
			});	
			
			
			this.fullwidth = uni.getSystemInfoSync().windowWidth;
			this.fullHeight = uni.getSystemInfoSync().windowHeight;
			console.log( "fullwidth : ", this.fullwidth,this.fullHeight)
			
		},
		methods: { 
			onBack(){
				uni.navigateBack()
			},
			scan(){
				uni.scanCode({
					onlyFromCamera: false,//设置false,可以从相册中选择,也可以相机扫描
					scanType: ['qrCode'],//类型扫描二维码
					success: res => {
						//二维码的值
						console.log(res.result);
						
						const session: WX_SESSION   = this.wx_user_store.getWxSession()
						
						//兑换权益
						uni.request({
							url: `${BU_API}/pat_app/redeem`,
							data: {
								payer		: this.wx_user_store.getUUID(),
								openid		: session?.openid,
								description	: "扫码权益兑换",
								code		: res.result,
								quantity    : 3
							},
							header: {},
							method: "POST",
							success: (res:any) => {
								console.log( "扫码权益兑换成功", res.data)
							
								if (res.data['code'] === 'OK'){
									this.isshow = true;
									
									let pages = getCurrentPages()
									// 上一个页面实例对象
									let beforePage = pages[pages.length - 2]   
									beforePage.data.refreshIfNeeded = true;
									
								} else if (res.data['code'] === 'NG'){
									if (res.data['msg'] === '新机福利已被领取'){
										this.isshow2 = true;
									} else{
										this.isshow3 = true;
									}
									
								} else {
									this.isshow3 = true;
								}
								
							},fail: (err: any) => {
								console.log( "err:", err)
							}
						});	
					},
					fail: err => {
						
					}
				});
				
			},
			buttonTap:function(){
				if(this.requestStatus){
					// 利用 return 终止函数继续运行
					console.log('按钮点击函数执行return');
					return false;
				}
				console.log('按钮点击函数执行');
				this.requestStatus = true;
				setTimeout(()=>{
					this.requestStatus = false;
				}, 1000);
				
				let index = this.priceSelect[0]
				let item = this.List[index]
				
				if (!item){
					uni.showToast({ icon: 'none', title: '支付失败,请选择套餐' })
					return false;
				}
				
				let amount = item.amount*1
					
				const session: WX_SESSION   = this.wx_user_store.getWxSession()
				
				//微信统一下单, 获取微信支付需要的参数
				uni.request({
					url: `${WX_API}/mch/prepay`,
					data: {
						appid       : 'wx2e3f06133b9610d5',
						payer		: this.wx_user_store.getUUID(),
						openid		: session?.openid,
						description	: "购买服务次数",
						amount		: amount,
						quantity    : item.quantity
					},
					header: {},
					method: "POST",
					success: (res:any) => {
						console.log( "微信统一下单", res.data)
						
						if (res.data['error']){
							uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
							return false;
						}
						
						wx.requestPayment({
						    provider: 'wxpay',    //支付类型-固定值
						    timeStamp: res.data.timeStamp, // 时间戳（单位：秒）
						    nonceStr: res.data.nonceStr, // 随机字符串
						    package: res.data.package, // 固定值
						    signType: res.data.signType, //固定值
						    paySign: res.data.paySign, //签名
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
						        uni.showToast({ icon: 'none', title: '支付成功' })
								
								let pages = getCurrentPages()
								// 上一个页面实例对象
								let beforePage = pages[pages.length - 2]   
								uni.navigateBack({
								    success:function(){
								        beforePage.$vm.getCount();
								        console.log("返回成功!");
								    }
								})
								
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
				            }
						});
						
						
					},fail: (err: any) => {
						console.log( "err:", err)
					}
				});	
			},
			confirm(){
				this.isshow = false;
				this.isshow2 = false;
				this.isshow3 = false;
			},
			selectPrice(e){
				if (this.priceSelect.indexOf(e) == -1) {
					this.priceSelect = [];
					this.priceSelect.push(e);//选中添加到数组里
				}
			},
			
		}  
	}
</script>

<script lang="ts" setup>
	import Nav from '@/comps/navbar/navbar.vue'
	import { BU_API,WX_API } from '@/assets/config'
	import { useWxUserStore } from '@/stores/account'
	import { WX_SESSION } from '@/stores/account'
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	.home {
		background-image: linear-gradient(to bottom, #01CC88, #f5f8f7 50%, #F5F6F8);
		background-repeat: no-repeat;
		background-size: contain;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		overflow-y:scroll;
		 
		button::after{
			border: none;
		}
		.box{
			width: 100%;
			height: 85%;
			overflow:auto;
			.count-box{
				position: flex;
				flex-direction: column;
				background-color: white;
				margin-top: 15px;
				margin-left: 15px;
				width: calc(100% - 30px);
				height: 83px;
				border-radius: 10px;
				padding-top:20px;
				.count-title{
					margin-left: 20px;
					height: 20px;
					font-size: 20px;
					font-weight: 600;
					color: #333333;
					line-height: 20px;
				}
				.count-title2{
					float:left;
					margin-top: 15px;
					margin-left: 20px;
					height: 20px;
					font-size: 14px;
					font-weight: 400;
					color: #666666;
					line-height: 20px;
				}
			}
			.price-box{
				position: relative;
				flex-direction: column;
				background-color: white;
				margin-top: 30px;
				margin-left: 15px;
				width: calc(100% - 30px);
				border-radius: 10px;
				z-index: 0;
				.bg{
					position: relative;
					width: 100%;
					height: 56px;
					z-index: -2;
					margin-top: -40px;
				}
				.icon{
					position: flex;
					margin-top: 14px;
					margin-left: 15px;
					width: 28px;
					height: 28px;
				}
				.line{
					position: flex;
					margin-top: 30px;
					margin-left: 16px;
					height: 7px;
					width: 76px;
				}
				.price-title{
					position: relative;
					height: 20px;
					font-size: 20px;
					font-weight: 600;
					color: #333333;
					line-height: 20px;
				}
				.price-title2{
					position: absolute;
					height: 20px;
					font-size: 15px;
					font-weight: 400;
					color: #666666;
					line-height: 20px;
				}
				.Grid{
					display: flex;
					flex-wrap: wrap;
					margin-top: 20px;
					.Grid-Item{
						margin-top: 9px;
						margin-left:12px;
						width: calc(33% - 16px);
						height: 116px;
						text-align: center;
						border: 1px solid #AFB6B4;
						box-sizing:border-box;
						border-radius: 10px;
						.Gtitle{
							margin-top: 15px;
							font-size: 18px;
							color: #333333;
							font-weight: 500;
						}
						.Gtitle2{
							margin-top: 5px;
							font-size: 22px;
							color: #01CC88;
							font-weight: 600;
						}
						.Gtitle3{
							margin-top: 5px;
							font-size: 15px;
							color: #666666;
						}
						.Gline{
							width: 40px;
							height: 1px;
							background-color: #666666;
							margin-top: -10px;
							margin-left: 30px;
						}
					}
					.Grid-ItemS{
						margin-top: 9px;
						margin-left:12px;
						width: calc(33% - 16px);
						height: 116px;
						text-align: center;
						border: 1px solid #01CC88;
						box-sizing:border-box;
						border-radius: 10px;
						background-color: #01CC88;
						.Gtitle{
							margin-top: 15px;
							font-size: 18px;
							color: white;
							font-weight: 500;
						}
						.Gtitle2{
							margin-top: 5px;
							font-size: 22px;
							color: white;
							font-weight: 600;
						}
						.Gtitle3{
							margin-top: 5px;
							font-size: 15px;
							color: white;
						}
						.Gline{
							width: 40px;
							height: 1px;
							background-color: white;
							margin-top: -10px;
							margin-left: 30px;
						}
					}
				}
			
			}
			.type-box{
				position: flex;
				flex-direction: row;
				justify-content:center;
				background-color: white;
				margin-top: 15px;
				margin-left: 15px;
				width: calc(100% - 30px);
				height: 60px;
				border-radius: 10px;
				.type-title{
					position: flex;
					float: right;
					margin-top: 20px;
					margin-right: 20px;
					height: 20px;
					font-size: 17px;
					font-weight: 600;
					color: #333333;
					line-height: 20px;
				}
				.type-title2{
					position: flex;
					float: left;
					margin-top: 20px;
					margin-left: 20px;
					height: 20px;
					font-size: 15px;
					font-weight: 400;
					color: #666666;
					line-height: 20px;
				}
			}
			
			.content {
				margin-top:-40px;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
			}
			.warnIcon{
				width: 162px;
				height: 117px;
			}
			.title {
				font-size: 22px;
				margin-top: 25px;
				color: #333333;
				font-weight: normal;
			}
			.subTitle {
				font-size: 15px;
				margin-top: 10px;
				color: #474747;
				font-weight: normal;
			}
			.deleBtn{
				flex-direction: row;
			}
		}
	}
</style>
