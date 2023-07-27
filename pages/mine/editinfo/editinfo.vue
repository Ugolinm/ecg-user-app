<template>
	<view class="home">
		<Nav title="编辑资料" bg="#02CD88" :back="true" @back="onBack"/>
		
		<view class="box">
			<view class="item">
				<text class="left">头像</text>
				<view class="right">
					<button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar" 
					style="background: rgba(0, 0, 0, 0);margin-right: 0px;">
						<image class="icon" :src="avatarUrlValue" mode=""></image>
					</button> 
					<image class="more" src="../../../static/mine/next.png" mode=""></image>
				</view>
			</view>
			
			<view class="item">
				<text class="left">昵称</text>
				<view class="right">
					<input :value="nickNameValue" type="nickname" class="weui-input" placeholder="请输入昵称" 
					placeholder-style='text-align:right' style="text-align:right;margin-right: 15px;" @blur="bindblur"/>
					<image class="more" src="../../../static/mine/next.png" mode=""></image>
				</view>
			</view>
			
			<view class="item">
				<text class="left">手机号</text>
				<view class="right">
					<text class="value" style="color: #999999;">{{mobileValue}}</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script lang="ts">
	import { useWxUserStore } from '@/stores/account'
	export default {
		data() {
			return {
				avatarUrlValue:"../../../static/mine/user-logo.png",
				nickNameValue:"微信用户",
				uuid:useWxUserStore().getUUID()
			}
		},
		onLoad() {
			const avatarUrlValue = uni.getStorageSync('avatarUrlValue');
			if (avatarUrlValue) {
				this.avatarUrlValue = avatarUrlValue
			}
			
			const nickNameValue = uni.getStorageSync('nickNameValue');
			if (nickNameValue) {
				this.nickNameValue = nickNameValue
			} 
		},
		onChooseAvatar(e) {
		    console.log("onChooseAvatar",e.detail.avatarUrl)
			
			uni.compressImage({
				src: e.detail.avatarUrl,
				quality: 50,
				success: res => {
					console.log(res.tempFilePath)
					
					uni.getFileSystemManager().readFile({
					    filePath: res.tempFilePath, //选择图片返回的相对路径
					    encoding: 'base64', //编码格式
					    success: res => { //成功的回调
							this.avatarUrlValue = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
							console.log('头像base64: ',this.avatarUrlValue,this.avatarUrlValue.length);
							
							uni.request({
								url: `${BU_API}/pat_app/accounts/update`,
								data: {
									uuid		: this.uuid,
									avatarUrl	: this.avatarUrlValue,
								},
								header: {},
								method: "POST",
								success: (res:any) => {
									console.log( "头像更新成功:", res.data )
									
									if (res.data['error']){
										uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
										return false;
									}
									
									uni.setStorage({
										key: 'avatarUrlValue',
										data: this.avatarUrlValue
									});
															
								},fail: (err: any) => {
									console.error( err )
									uni.showToast({ icon: 'none', title: '更新用户信息到服务器失败' })
								}
							});
							
					    },
					    fail: (e) => {
					      console.log("图片转换失败");
					    }
					})
					
					
				}
			})
			
		
		},
		
		methods: { 
			bindblur(e) {
				console.log("bindblur",e.detail.value)
				this.nickNameValue = e.detail.value
				this.nickNameValue = this.nickNameValue.trim()
				console.log("nickNameValue",this.nickNameValue)
				uni.request({
					url: `${BU_API}/pat_app/accounts/update`,
					method: "POST",
					header: {},
					data: {
						uuid		: this.uuid,
						nickname	: this.nickNameValue,
					},
					success: (res:any) => {
						console.log( "昵称更新成功:", res.data )
						
						if (res.data['error']){
							uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
							return false;
						}
	
						uni.setStorage({
							key: 'nickNameValue',
							data: this.nickNameValue
						});
						
					},fail: (err:any) => {
						console.error( err )
						uni.showToast({ icon: 'none', title: '更新用户信息到服务器失败' })
					}
				})
			},
		
		}  
	}
</script>

<script lang="ts" setup>
	import { ref } from 'vue'
	import Nav from '@/comps/navbar/navbar.vue'
	import { BU_API } from '@/assets/config'
	import { onLoad } from "@dcloudio/uni-app"
	
	const mobileValue = ref("")
	onLoad( async (option:any) => {
		const mobile = uni.getStorageSync('mobileValue');
		if (mobile) {
			mobileValue.value = mobile
		} 
	})
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
	
</script>

<style lang="less" scoped>
	button::after {
		 border: none;
	}
	
.home{
	.box{
		background-color: #fff;
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
