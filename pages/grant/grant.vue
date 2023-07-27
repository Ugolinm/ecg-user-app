<template>
	<view class="home">
		<image class="title" src="../../static/title.png"></image>
		
		<image class="bg" src="../../static/bg-index.png"></image>
		<view class="titleTips">
			<text style="font-size: 18px;font-family: PingFang SC-常规体, PingFang SC;font-weight: normal;color: #01CC88;">您的家庭健康管家</text>
		</view>
		<view class="tips">
			<text class="big">健康档案</text>
			<text class="small">就诊信息，随时实地方便查看</text>
		</view>
		<view class="login-btn">
			<button class="geo-btn primary full large bold" open-type="getPhoneNumber" @getphonenumber="onLogin" style="margin-left: 15px;width: calc(100% - 30px);">登录</button>
		</view>
		<view class="login-check">
			<radio-group>
				<label style="transform: scale(0.7);">
					<radio color="#01CC88" value="Y" :checked="agreed" @click="onRadioClick" style="transform:scale(0.7)"/>
				</label>
			</radio-group>
			<text>登录即代表您同意</text>
			<view class="geo-btn link" style="font-size: 12px;color: #01CC88;" @click="showLaws('terms')">《用户协议》</view>
			<text>和</text>
			<view class="geo-btn link" style="font-size: 12px;color: #01CC88;" @click="showLaws('privacy')">《隐私政策》</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useWxUserStore } from '@/stores/account'
	import { getUserInfo, getPhoneInfo, getSession } from '@/assets/login'
	import { signup, getOld} from '@/assets/accounts'
	
	const wx_user_store = useWxUserStore()
	const agreed = ref( true )
	const onRadioClick = ()=>{
		agreed.value = !agreed.value
	}
	const onLogin = async (e)=>{
		uni.showLoading({ title: '登录授权中', mask: true })

		// agreement check
		if( !agreed.value ){
			uni.showToast({ icon:'none', title: '请先勾选协议' })
			return
		}
		// phone code check
		if( !e.detail.code ){
			uni.showToast({ icon: 'none', title: '登录前请授权获取手机号' })
			return
		}
		
		try{
			// let's login
			console.log("这里呢")
			const { code, wx_userinfo } = await getUserInfo()
			wx_user_store.setWxUserInfo( wx_userinfo )
			// let's get session( openid & unionid )
			const wx_session = "0ec55f2e454b2488af7fcb3879c46894"
			wx_user_store.setWxSession( wx_session )
			// let's get phone
			const phoneinfo = "15529652716"
			wx_user_store.setWxPhoneInfo( phoneinfo )
			// let's submit to save
			await signup()
			await getOld()
			
		}catch(ex){
			return
		}
		
		// switch to index page
		uni.hideLoading()
		uni.switchTab({ url: '/pages/reports/reports' })
	}
	
	function showLaws(type:string){
		uni.navigateTo({
			url:'/comps/laws/laws?type='+type
		})
	}
	
</script>

<style scoped lang="less">
	@import url("@/assets/common.less");
	
	button::after {
		 border: none;
	}
	
	.home{
		position: fixed; 
		top: 0; 
		left: 0;
		height: 100%; 
		width: 100%;
		display: flex; 
		align-items: center; 
		justify-content: center;
		background-color: #FFFFFF;
		.bg{
			position: relative;
			top: 30px;
			width: 355px;
			height: 265px;
			z-index: -2;
		}
		.btnBack{
			position: absolute;
			bottom: 8.6%;
			width: 100%;
			height: 20%;
			z-index: -1;
		}
		.login-check{
			position: fixed;
			bottom: 90px;
			width: 90%;
			display: flex;
			align-items: center; 
			justify-content: center;
			font-size: 12px;
			color: #555;
		}
		.title{
			position: absolute;
			top: 17%;
			width: 78%;
			height: 28px;
			z-index: -1;
		}
		.titleTips{
			position: fixed;
			top: 24%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.tips{
			position: fixed;
			top: 42%;
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #333333;
			.big{
				margin-left: -40px;
				font-size: 9px;
				font-weight: normal;
			}
			.small{
				margin-top: 6px;
				margin-left: -40px;
				font-size: 7px;
			}
		}
		.login-btn{
			position: fixed;
			bottom: 14%;
			width: 90%;
		}
		.login-check{
			position: fixed;
			bottom: 9%;
			width: 90%;
			display: flex;
			align-items: center; 
			justify-content: center;
			font-size: 12px;
			color: #555;
		}
	}
</style>
