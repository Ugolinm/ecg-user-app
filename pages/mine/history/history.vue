<template>
	<view class="home">
		<Nav title="支付记录" bg="#02CD88" :back="true" @back="onBack"/>
		<view class="nav">
			<view class="titleBox">
				<view :class="{'active':isActive==1}" @click="chenked(1)">
					<view :class="{'title':isActive==1}">待支付</view>
					<view style="margin-top: -4px;margin-left:calc(33% + 6px);width: 31px;height: 4px;background-color: #02CD88;" v-if="isActive==1"></view>
				</view>
			</view>
			<view class="titleBox">
				<view :class="{'active':isActive==2}" @click="chenked(2)">
					<view :class="{'title':isActive==2}">已支付</view>
					<view style="margin-top: -4px;margin-left:calc(33% + 6px);width: 31px;height: 4px;background-color: #02CD88;" v-if="isActive==2"></view>
				</view>
			</view>
			<view class="titleBox">
				<view :class="{'active':isActive==3}" @click="chenked(3)">
					<view :class="{'title':isActive==3}">已消费</view>
					<view style="margin-top: -4px;margin-left:calc(33% + 6px);width: 31px;height: 4px;background-color: #02CD88;" v-if="isActive==3"></view>
				</view>
			</view>
		</view>
	
		<scroll-view
			scroll-y 
			:style="{height: verticalNavHeight + 'px'}" 
			:scroll-top="scrollTop"
			refresher-enabled="true"
			:refresher-triggered="triggered" 
			:refresher-threshold="100" 
			@scrolltolower="tolower()" :lower-threshold="50"
			@refresherrefresh="onRefresh()"
			@refresherrestore="onRestore()">
			<view class="page" v-if="isActive==1">
				<view class="empty" v-if="!List || List.length===0">
					<image src="../../static/enptypay.png" mode="" style="width: 246px;height: 204px;"></image>
					<text class="hint">您还暂无待支付记录</text>
				</view>
				<view class="list" v-else>
					<view class="item" v-for="(item,index) in List" :key="index" @click.stop="select(index)">
						<view class="item-title">心电报告</view>
						<view class="item-title2">套餐</view>
						<view class="item-title3">待支付</view>
						<view class="item-title4">服务次数：{{item.quantity}}次</view>
						<view class="item-title4" style="margin-top: 6px;">创建时间:{{format('Y-M-D h:m:s', item.create_tm)}}</view>
						<view class="item-title" style="margin-top: -45px;margin-left: calc(100% - 95px);text-align: right;">-￥{{item.amount}}</view>
						<view style="margin-top: 40px;width: 100%;height: 1px;background-color: #E3E4E5;"></view>
						<view class="item-btn" @click.stop="cancel(index)">取消订单</view>
						<view class="item-btn2" @click.stop="pay(item)">立即支付</view>
					</view>
				</view>
			</view>
			
			<view class="page" v-if="isActive==2">
				<view class="empty" v-if="!List2 || List2.length===0">
					<image src="../../static/enptypay.png" mode="" style="width: 246px;height: 204px;"></image>
					<text class="hint">您还暂无已支付记录</text>
				</view>
				<view class="list" v-else>
					<view class="item" style="height: 113px;" v-for="(item,index) in List2" :key="index" @tap="select2(index)">
						<view class="item-title">心电报告</view>
						<view :class="[{'item-title2':item.type==='套餐'},{'item-title22':item.type==='新机福利'}]">{{item.type}}</view>
						<view class="item-title3" style="color: #999999;width: 60px;margin-left:calc(100% - 110px);">交易成功</view>
						<view class="item-title4">服务次数：{{item.quantity}}次</view>
						<view class="item-title4" style="margin-top: 6px;">创建时间:{{format('Y-M-D h:m:s', item.create_tm)}}</view>
						<view class="item-title" style="margin-top: -45px;margin-left: calc(100% - 95px);text-align: right;" :style="{color:item.type==='新机福利'?'white':''}">-￥{{item.amount}}</view>
					</view>
				</view>
			</view>
			
			<view class="page" v-if="isActive==3">
				<view class="empty" v-if="!List3 || List3.length===0">
					<image src="../../static/enptypay.png" mode="" style="width: 246px;height: 204px;"></image>
					<text class="hint">您还暂无消费记录</text>
				</view>
				<view class="list" v-else>
					<view class="item" style="height: 108px;" v-for="(item,index) in List3" :key="index" @tap="select3(index)">
						<view class="item-title">心电报告</view>
						<view class="item-title3" style="color: #999999;width: 60px;margin-left:calc(100% - 110px);">
							<text style="font-size: 18px;font-family: PingFang SC-Semibold, PingFang SC;font-weight: 600;">-1</text>
							<text style="font-size: 12px;font-family: PingFang SC-Regular, PingFang SC;font-weight: 300;"> 次</text>
						</view>
						<view class="item-title4" style="margin-top: 15px;">创建时间:{{format('Y-M-D h:m:s', item.create_tm)}}</view>
						<view class="item-title4" style="margin-top: 6px;">支付方式：服务扣减</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		
		
		

	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				isActive:1,
				List:[],
				pageno:1,
				pageno2:1,
				pageno3:1,
				pagecnt:10,
				List2:[],
				List3:[],
				wx_user_store : useWxUserStore(),
				// 下拉刷新
				triggered: false,
				onRefreshing: false,
				refreshTime: 1000,
				verticalNavHeight:'',
				scrollTop: 0,
				requestStatus : false
			}
		},
		async onLoad() {
			let menuButtonObject = uni.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({//获取系统信息
					success: res => {
							let navbarHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2 + res.statusBarHeight
							this.verticalNavHeight = res.screenHeight - navbarHeight - 50
					},
					fail(err) {
							console.log(err);
					}
			})
			
			
			this.List = await findOrder(1,this.pagecnt)
			console.log( this.List )
			
			this.List2 = await findTraded(1,this.pagecnt)
			console.log( this.List2 )
			if (this.List2) {
			    this.List2.forEach((it, idx) => {
			    	if (it.type == 'order') {
			    		it.type = '套餐'
			    	} else {
			    		it.type = '新机福利'
			    	}
			    })
			}
			
			this.List3 = await findConsume(1,this.pagecnt)
			console.log( this.List3 )
		},
		methods: { 
			chenked(type){
				this.isActive = type
				this.scrollTop = 0
			},
			select(e){
				let item = this.List[e]
				let itemObj = JSON.stringify(item)
				console.log("待支付select",itemObj)
				
				uni.navigateTo({
					url: '/pages/mine/history/info1?itemObj='+itemObj
				})
			},
			select2(e){
				let item = this.List2[e]
				let itemObj = JSON.stringify(item)
				console.log("待支付select",itemObj)
				
				uni.navigateTo({
					url: '/pages/mine/history/info2?itemObj='+itemObj
				})
			},
			select3(e){
				let item = this.List3[e]
				let itemObj = JSON.stringify(item)
				console.log("待支付select",itemObj)
				
				uni.navigateTo({
					url: '/pages/mine/history/info3?itemObj='+itemObj
				})
			},
			cancel(index){
				let item = this.List[index]
				//取消支付
				uni.request({
					url: `${BU_API}/pat_app/order/cancel`,
					data: {
						uuid : item.uuid,
					},
					header: {},
					method: "POST",
					success: (res:any) => {
						console.log( "取消成功", res.data)
						
						if (res.data['error']){
							uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
							return false;
						}
						
						this.List.splice(index,1)
						
					},fail: (err: any) => {
						console.log( "err:", err)
					}
				});	
			},
			pay(item){
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
				
				let amount = item.amount*1
				const session: WX_SESSION   = this.wx_user_store.getWxSession()
				
				//微信统一下单, 获取微信支付需要的参数
				uni.request({
					url: `${WX_API}/mch/prepay`,
					data: {
						tradeno     : item.uuid,
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
								
								this.refresh()
								
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
			async refresh(){
				this.List = await findOrder(1,this.pagecnt)
				console.log( this.List )
			},
			async onRefresh() {
				if (this.onRefreshing) return
				this.onRefreshing = true
				if (!this.triggered)
					this.triggered = true
			
				// 刷新数据
				console.log("refresing...")
				if (this.isActive == 1){
					this.pageno = 1
					this.List =  await findOrder(this.pageno,this.pagecnt)
					console.log( this.List )
					this.triggered = false
					this.onRefreshing = false
					
				} else if (this.isActive == 2){
					this.pageno2 = 1
					this.List2 = await findTraded(this.pageno2,this.pagecnt)
					console.log( this.List )
					if (this.List2) {
						this.List2.forEach((it, idx) => {
							if (it.type == 'order') {
								it.type = '套餐'
							} else {
								it.type = '新机福利'
							}
						})
					}
					this.triggered = false
					this.onRefreshing = false
					
				} else {
					this.pageno3 = 1
					this.List3 = await findConsume(this.pageno3,this.pagecnt)
					console.log( this.List )
					this.triggered = false
					this.onRefreshing = false
				}
				
			},
			async onRestore() {
				// 这一步是关键，官方文档this.triggered = 'restore'无效（亲测）
				this.triggered = false
			},
			async tolower() {
				console.log("fetching more...")
				if (this.isActive == 1){
					this.pageno += 1
					const more = await findOrder(this.pageno,this.pagecnt)
					if( more && more.length>0 ){
						this.List = this.List.concat( more )
						console.log( more )
						if( more.length<this.pagecnt ){
							uni.showToast({ icon: 'none', title: '没有更多了' })
						}
					} else {
						uni.showToast({ icon: 'none', title: '没有更多了' })
					}
					
				} else if (this.isActive == 2){
					this.pageno2 += 1
					const more = await findTraded(this.pageno2,this.pagecnt)
					if( more && more.length>0 ){
						this.List2 = this.List2.concat( more )
						console.log( more )
						if (this.List2) {
						    this.List2.forEach((it, idx) => {
						    	if (it.type == 'order') {
						    		it.type = '套餐'
						    	} else {
						    		it.type = '新机福利'
						    	}
						    })
						}
						if( more.length<this.pagecnt ){
							uni.showToast({ icon: 'none', title: '没有更多了' })
						}
					} else {
						uni.showToast({ icon: 'none', title: '没有更多了' })
					}
				}
			}
		},
		
	}
</script>

<script lang="ts" setup>
	import { BU_API,WX_API } from '@/assets/config'
	import { useWxUserStore } from '@/stores/account'
	import { WX_SESSION } from '@/stores/account'
	import Nav from '@/comps/navbar/navbar.vue'
	import { findOrder,findTraded,findConsume } from "@/assets/history"
	import { format } from "@/assets/utils"
	
	const onBack = ()=>{
		uni.navigateBack()
	}
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");	
	
	.home {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #F5F6F8;
		button[plain]{ 
			border:0 
		}
		.nav{
			width: 100%;
			height: 49px;
			background-color: white;
			display: flex;
			flex-direction: row;
			justify-content:center;
			.titleBox{
				position: flex;
				width : 33%;
				height: 49px;
				line-height: 49px;
				text-align: center;
				font-size: 14px;
				font-weight: 400;
				color: #999999;
				.title{
					color: #333333;
					font-size: 16px;
					font-weight: 600;
				}
				.title2{
					font-size: 14px;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		
		.page{
			margin-top: 10px;
			
			.empty{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 150px;
				.hint{
					width: 100%;
					font-size: 14px;
					color: #999;
					text-align: center;
				}
			}
			.list{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 15px;
				.item{
					position: flex;
					background-color: #fff;
					width: 100%;
					height: 172px;
					margin: 10px 0;
					border-radius: 10px;
					.item-title{
						margin-top: 18px;
						margin-left: 15px;
						width: 75px;
						font-size: 18px;
						font-weight: 500;
						color: #333333;
						line-height: 20px;
					}
					.item-title2{
						position: absolute;
						margin-top: -22px;
						margin-left: 100px;
						width: 38px;
						height: 24px;
						text-align: center;
						font-size: 13px;
						font-weight: 400;
						line-height: 24px;
						color: #FFA73B;
						background: rgba(255,167,59,0.14);
						border-radius: 5px;
					}
					.item-title22{
						position: absolute;
						margin-top: -22px;
						margin-left: 100px;
						width: 65px;
						height: 24px;
						text-align: center;
						font-size: 13px;
						font-weight: 400;
						line-height: 24px;
						color: #F5714C;
						background: rgba(244,113,76,0.14);
						border-radius: 5px;
					}
					.item-title3{
						position: absolute;
						margin-top: -22px;
						margin-left: calc(100% - 95px);
						width: 45px;
						height: 24px;
						text-align: right;
						font-size: 14px;
						font-weight: 400;
						line-height: 24px;
						color: #FF7C41;
					}
					.item-title4{
						margin-top: 18px;
						margin-left: 15px;
						font-size: 13px;
						font-weight: 400;
						color: #666666;
						line-height: 19px;
					}
					.item-btn{
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						position: absolute;
						margin-top: 15px;
						margin-left: calc(100% - 245px); 
						width: 87px;
						height: 32px;
						border-radius: 16px;
						opacity: 1;
						border: 1px solid #88949f; 
						background-color: #FFFFFF;
						color: #666666;
						font-size: 15px;
						font-weight: 500;
						text-align: center;
					}
					.item-btn2{
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						position: absolute;
						margin-top: 15px;
						margin-left: calc(100% - 135px); 
						width: 87px;
						height: 34px;
						border-radius: 17px;
						background-color: #01CC88;
						color: #FFFFFF;
						font-size: 15px;
						font-weight: 500;
						text-align: center;
					}
				}
			}
		}
	}
</style>
