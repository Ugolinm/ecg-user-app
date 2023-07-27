<template>
	<view class="home">
		<Nav title="订单详情" bg="#02CD88" :back="true" @back="onBack"/>
		
		<view class="type-box">
			<image src="../../static/mine/buy/8.png" style="margin-top: 30px;width: 40px;height:40px;"></image>
			<text class="type-title">待支付</text>
			<text class="type-title2">心电报告</text>
			<text class="type-title3">-￥{{amount}}</text>
		</view>
		
		<view class="box">
			<view class="item">
				<text class="left">服务次数</text>
				<view class="right">
					<text class="value" style="color: #999999;">{{quantity}}次</text>
				</view>
			</view>
			<view class="item">
				<text class="left">支付方式</text>
				<view class="right">
					<text class="value" style="color: #999999;">微信支付</text>
				</view>
			</view>
			<view class="item">
				<text class="left">创建时间</text>
				<view class="right">
					<text class="value" style="color: #999999;">{{format('Y-M-D h:m:s', create_tm)}}</text>
				</view>
			</view>
			<view class="item">
				<text class="left">订单编号</text>
				<view class="right">
					<text class="value" style="color: #999999;">{{uuid}}</text>
				</view>
			</view>
			
		</view>
	
		<view class="btn-title" @click="cancle">取消订单</view>
		<view class="btn-title2" @click="pay">立即支付</view>
	
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				uuid: '',
				amount: '',
				quantity: '',
				create_tm: '',
				transaction_id: '',
				wx_user_store : useWxUserStore(),
				requestStatus : false
			}
		},
		async onLoad(option) {
			console.log('info1接收',option)
			
			let item = JSON.parse(option.itemObj)
			this.uuid = item.uuid
			this.amount = item.amount
			this.quantity = item.quantity
			this.create_tm = item.create_tm
			this.transaction_id = item.transaction_id
			
		},
		methods: { 
			cancle(){
				//取消支付
				uni.request({
					url: `${BU_API}/pat_app/order/cancel`,
					data: {
						uuid : this.uuid,
					},
					header: {},
					method: "POST",
					success: (res:any) => {
						console.log( "取消成功", res.data)
						
						if (res.data['error']){
							uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
							return false;
						}
						
						let pages = getCurrentPages()
						// 上一个页面实例对象    
						let beforePage = pages[pages.length - 2]   
						uni.navigateBack({
						    success:function(){
						        beforePage.$vm.refresh();
						        console.log("返回成功!");
						    }
						})
						
					},fail: (err: any) => {
						console.log( "err:", err)
					}
				});	
			},
			pay(){
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
				
				let amount = this.amount*1
				const session: WX_SESSION   = this.wx_user_store.getWxSession()
				
				//微信统一下单, 获取微信支付需要的参数
				uni.request({
					url: `${WX_API}/mch/prepay`,
					data: {
						tradeno     : this.uuid,
						appid       : 'wx2e3f06133b9610d5',
						payer		: this.wx_user_store.getUUID(),
						openid		: session?.openid,
						description	: "购买服务次数",
						amount		: amount,
						quantity    : this.quantity
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
						        
								let pages = getCurrentPages()
								// 上一个页面实例对象    
								let beforePage = pages[pages.length - 2]   
								uni.navigateBack({
								    success:function(){
										uni.showToast({ icon: 'none', title: '支付成功' })
								        beforePage.$vm.refresh();
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
			}
			
		}
	}
</script>

<script lang="ts" setup>
	import Nav from '@/comps/navbar/navbar.vue'
	import { BU_API,WX_API } from '@/assets/config'
	import { useWxUserStore } from '@/stores/account'
	import { WX_SESSION } from '@/stores/account'
	import { format } from "@/assets/utils"
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
</script>


<style lang="less" scoped>
	@import url("@/assets/common.less");	
	
	.home {
		background-color: #F5F6F8;
		.type-box{
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: white;
			width: 100%;
			height: 222px;
			.type-title{
				margin-top: 15px;
				height: 20px;
				font-size: 18px;
				font-weight: 600;
				color: #FF7C41;
				line-height: 20px;
			}
			.type-title2{
				margin-top: 20px;
				height: 20px;
				font-size: 15px;
				font-weight: 500;
				color: #333333;
				line-height: 20px;
			}
			.type-title3{
				margin-top: 20px;
				height: 20px;
				font-size: 22px;
				font-weight: 600;
				color: #333333;
				line-height: 20px;
			}
		}
		.box{
			background-color: white;
			margin-top: 10px;
			padding: 10px 14px;
			font-size: 14px;
			.item{
				display: flex;
				align-items: center;
				border-bottom: 1px solid #eee;
				padding: 15px 0;
				.left{
					width: 60px;
					color: #333333;
				}
				.right{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					color: #333;
					.icon{
						width: 60px;
						height: 60px;
						border-radius: 50%;
						margin-right: 0px;
					}
					.value{
						margin-right: 20px;
						text-align: right;
					}
					.more{
						width: 8px;
						height: 10px;
					}
				}
			}
			.item:last-child{
				border-bottom: 0;
			}
		}
		.btn-title{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 60px;
			margin-left: 20px;
			width: 155px;
			height: 50px;
			border-radius: 25px; 
			background-color: #FFFFFF;
			color: #666666;
			text-align: center;
			font-size: 18px;
			font-weight: 600;
		}
		.btn-title2{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 60px;
			margin-left: calc(100% - 175px);
			width: 155px;
			height: 50px;
			border-radius: 25px;
			background-color: #01CC88;
			color:#FFFFFF;
			text-align: center;
			font-size: 18px;
			font-weight: 600;
		}
	}
</style>