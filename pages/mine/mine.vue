<template>
	<view class="home" >
		<Nav title=""/>
		<view class="title">我的</view>
		
		<view class="user-info">
			<image class="user-icon" :src="wx_avatarUrl" mode=""></image>
			<view class="info">
				<view class="nick">
					<text class="text">{{wx_nickName||''}}</text>
				</view>
				<view class="phone">
					<text class="text">{{wx_mobiler||''}}</text>
				</view>
			</view>
			<view class="edit" @click="onEditInfo">
				<text class="text">编辑资料</text>
				<image class="more" src="../../static/mine/next.png" mode=""></image>
			</view>
		</view>
		
		<view class="count-box">
			<image class="count" src="../../static/mine/count.png"></image>
			<view>
				<text class="count-title">数据解读服务</text>
			</view>
			<view class="count-title2">
				<text>剩余次数: </text>
				<text style="font-size: 18px;font-weight: 600;">{{count}}</text>
				<text> 次</text>
			</view>
			<view class="btn-title" @click="go">去充值</view>
		</view>
		
		<view class="menu-box">
			<view class="menu" @click="onUsersMana">
				<image class="menu-icon" src="../../static/mine/1.png" mode=""></image>
				<text class="menu-title">使用者管理</text>
				<image class="edit-icon" src="../../static/mine/next.png" mode=""></image>
			</view>
			<view class="menu" @click="goHistory">
				<image class="menu-icon" src="../../static/mine/4.png" mode=""></image>
				<text class="menu-title">支付记录</text>
				<image class="edit-icon" src="../../static/mine/next.png" mode=""></image>
			</view>
			<view class="menu" @click="onBle">
				<image class="menu-icon" src="../../static/mine/5.png" mode=""></image>
				<text class="menu-title">格式化设备内存</text>
				<image class="edit-icon" src="../../static/mine/next.png" mode=""></image>
			</view>
			<view class="menu" @click="showLaws('terms')">
				<image class="menu-icon" src="../../static/mine/2.png" mode=""></image>
				<text class="menu-title">用户协议</text>
				<image class="edit-icon" src="../../static/mine/next.png" mode=""></image>
			</view>
			<view class="menu" @click="showLaws('privacy')">
				<image class="menu-icon" src="../../static/mine/3.png" mode=""></image>
				<text class="menu-title">隐私政策</text>
				<image class="edit-icon" src="../../static/mine/next.png" mode=""></image>
			</view>
		</view>
		
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				wxStore : useWxUserStore(),
				wx_mobiler : '',
				wx_nickName : '',
				wx_avatarUrl : '',
				uuid : '',
				count : 0,
				refreshIfNeeded: false,
			}
		},
		async onShow(){
			const nickName = uni.getStorageSync('nickNameValue');
			if (nickName) {
				this.wx_nickName = nickName
			} 
			const avatarUrl = uni.getStorageSync('avatarUrlValue');
			if (avatarUrl) {
				this.wx_avatarUrl = avatarUrl
			}
			var pages = getCurrentPages(); // 获取当前页面栈
			var currentPage = pages[pages.length - 1]; // 当前页面
			if (currentPage.data.refreshIfNeeded) {
				currentPage.data.refreshIfNeeded = false;
				this.getCount(); // 当前页面 method中的方法，用来刷新当前页面
			}
		},
		async onLoad() {
			this.wx_nickName = this.wxStore.getWxUserInfo()?.nickName
			this.wx_avatarUrl = this.wxStore.getWxUserInfo()?.avatarUrl
			this.wx_mobiler = this.wxStore.getWxPhoneInfo()?.phoneNumber
			this.uuid = this.wxStore.getUUID()
				
			const nickNameValue = uni.getStorageSync('nickNameValue');
			if (nickNameValue) {
				this.wx_nickName = nickNameValue
			} else {
				uni.setStorage({
					key: 'nickNameValue',
					data: this.wx_nickName
				});
			}
			const avatarUrlValue = uni.getStorageSync('avatarUrlValue');
			if (avatarUrlValue) {
				this.wx_avatarUrl = avatarUrlValue
			} else {
				uni.setStorage({
					key: 'avatarUrlValue',
					data: this.wx_avatarUr
				});
			}
			const mobileValue = uni.getStorageSync('mobileValue');
			if (mobileValue) {
				this.wx_mobiler = mobileValue
			} else {
				uni.setStorage({
					key: 'mobileValue',
					data: this.wx_mobiler
				});
			}
			
			this.getCount()
		},
		methods: { 
			getCount(){
				//剩余服务次数(余额)
				uni.request({
					url: `${BU_API}/pat_app/balance/`+ this.uuid,
					header: {},
					method: "GET",
					success: (res:any) => {
						console.log( "剩余次数", res.data)
						
						if (res.data['error']){
							uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
							return false;
						}
						
						this.count = res.data['balance']
						
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
	import { useWxUserStore } from '@/stores/account'
	import { BU_API } from '@/assets/config'
	
	const go = ()=>{
		uni.navigateTo({
			url: '/pages/mine/buy/buy'
		})
	}
	const goHistory = ()=>{
		uni.navigateTo({
			url: '/pages/mine/history/history'
		})
	}
	const onBle = ()=>{
		uni.navigateTo({
			url: '/pages/mine/ble/ble'
		})
	}
	const onEditInfo = ()=>{
		uni.navigateTo({
			url: '/pages/mine/editinfo/editinfo'
		})
	}
	const onUsersMana = ()=>{
		uni.navigateTo({
			url: '/pages/mine/users/users'
		})
	}
	function showLaws(type:string){
		uni.navigateTo({
			url:'/comps/laws/laws?type='+type
		})
	}
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	.home {
		background-image: linear-gradient(to bottom, #c3ffed, #f5f8f7 50%, #F5F6F8);
		background-repeat: no-repeat;
		background-size: contain;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		overflow-y:scroll;
		.title{
			flex: 1;
			color: #333333;
			margin-top: -30px;
			width: 100%;
			font-size: 18px;
			font-weight: bold;
			text-align: center;
		}
		
		.user-info{
			display: flex;
			align-items: center;
			color: #333333;
			font-size: 12px;
			padding: 25px;
			
			.user-icon{
				width: 73px;
				height: 73px;
				border-radius: 50%;
			}
			.info{
				flex:1;
				margin-left: 20px;
				.nick{
					font-size: 20px;
					text-align: left;
				}
				.phone{
					display: flex;
					align-items: center;
					.phone-icon{
						width: 8px;
						height: 10px;
					}
					.text{
						padding: 6px 4px;
						font-size: 14px;
						text-align: left;
					}
				}
			}
			.edit{
				display: flex;
				align-items: center;
				.text{
					padding-right: 4px;
				}
				.more{
					width: 8px;
					height: 10px;
				}
			}
		}
		.count-box{
			position: flex;
			flex-direction: column;
			background-color: rgba(0,0,0,0);
			width: 100%;
			height: 90px;
			.count{
				position: absolute;
				margin-left: 15px;
				width: calc(100% - 30px);
				height: 90px;
				z-index: -1;
			}
			.count-title{
				position: absolute;
				margin-top: 15px;
				margin-left: 35px;
				height: 20px;
				font-size: 18px;
				font-weight: 600;
				color: white;
				line-height: 20px;
			}
			.count-title2{
				position: absolute;
				margin-top: 50px;
				margin-left: 35px;
				height: 20px;
				font-size: 14px;
				font-weight: 400;
				color: white;
				line-height: 20px;
			}
			.btn-title{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: absolute;
				margin-top: 25px;
				margin-left:calc(100% - 130px);
				width: 90px;
				height:40px;
				border-radius: 20px;
				background-color: white;
				color: #01CC88;
				font-weight: 600;
				font-size: 16px;
				text-align: center;
			}
		}
		.menu-box{
			display: flex;
			flex-direction: column;
			background-color: rgba(0,0,0,0);
			.menu{
				display: flex;
				align-items: center;
				margin-top: 15px;
				margin-left: 15px;
				width: calc(100% - 30px);
				height: 70px;
				background-color: #FFFFFF;
				border-radius: 10px;
				&:last-child{
					border-bottom: 0;
				}
				.menu-icon{
					width: 40px;
					height: 40px;
					margin-left: 16px;
				}
				.menu-title{
					padding-left: 15px;
					flex: 1;
					height: 20px;
					font-size: 18px;
					font-weight: normal;
					color: #36444E;
					line-height: 20px;
				}
				.edit-icon{
					width: 8px;
					height: 13px;
					padding-right: 15px;
				}
			}
		}
	}
	
</style>
