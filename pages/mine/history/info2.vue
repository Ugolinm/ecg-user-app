<template>
	<view class="home">
		<Nav title="订单详情" bg="#02CD88" :back="true" @back="onBack"/>
		
		<view class="type-box">
			<image src="../../static/mine/buy/10.png" style="margin-top: 30px;width: 40px;height:40px;"></image>
			<text class="type-title">交易成功</text>
			<text class="type-title2">心电报告</text>
			<text class="type-title3">{{amount}}</text>
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
					<text class="value" style="color: #999999;">{{type}}</text>
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
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				type: '',
				amount: '',
				quantity: '',
				create_tm: '',
				uuid: '',
			}
		},
		async onLoad(option) {
			console.log('info2接收',option)
			
			let item = JSON.parse(option.itemObj)
			this.type = item.type
			if (this.type == '套餐') {
				this.type = '微信支付'
			} else {
				this.type = '福利兑换'
			}
			
			if (item.amount){
				this.amount = '-￥'+item.amount
				console.log('this.amount',this.amount)
			} else {
				this.amount = '福利兑换'
			}
			this.quantity = item.quantity
			this.create_tm = item.create_tm
			this.uuid = item.uuid
			
		},
		methods: { 
			
		}
	}
</script>

<script lang="ts" setup>
	import Nav from '@/comps/navbar/navbar.vue'
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
				color: #02CD88;
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
	}
</style>