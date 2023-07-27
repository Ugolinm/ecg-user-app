<template>
	<view class="home">
		<Nav title="使用者管理" bg="#02CD88" :back="true" @back="onBack"/>
		
		<!-- empty -->
		<view class="empty-box" v-if="!patients || patients.length===0">
			<image class="icon" src="../../../static/mine/users-empty.png" mode="" style="margin-top:100px;width: 215px;height: 178px;"></image>
			<text class="hint">暂无使用者</text>
			
			<button class="btn" type="default" @click="onAddUser" style="position: fixed;bottom: 80px;width: calc(100% - 160px);border-radius: 25px; background-color: #02CD88;">添加使用者</button>
		</view>
		
		<view class="user-list" v-else>
			<uni-swipe-action>
				<uni-swipe-action-item v-for="user of patients" :left="swipeOptions" :right-options="swipeOptions" @click="onSwipeClick($event, user)">
					<view class="item" @click="onClick($event, user)">
						<view class="tag" v-if="user?.uuid==currPat?.uuid">当前使用者</view>
						<view class="user">
							<view class="base">
								<text class="name">{{user?.name}}</text>
								<text class="age">{{user?.age}}岁</text>
								<image :src="user?.gender===0 ? '../../../static/mine/man.png':'../../../static/mine/women.png'"  mode="" style="margin-left: 15px;width: 13px;height: 13px;"></image>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
			<button class="geo-btn primary full large bold" style="position: fixed;bottom: 100px;margin-left: 5px;width: calc(100% - 30px);" @click="onAddUser">添加使用者</button>
		</view>
		
		<zwy-popup v-bind:ishide="isshow" width="335px" height="317px" radius="10px">
			<!-- 自定义展示内容 -->
			<view class="content">
				<image class="warnIcon" src="../../static/mine/dele.png"></image>
				<view class="title">
					<text>使用者“</text>
					<text style="color: #02CD88">{{name}}</text>
					<text>”还有正在进行中的服务，</text>
				</view>
				<view class="subTitle">暂时无法删除，请在服务结束后再试~</view>

				<button class="btn" type="default" @click="confirm" 
				style="position: fixed;bottom: 40px;width: 130px;border-radius: 22.5px; background-color: #01CC88;color: #FFFFFF;">我知道了</button>
				
			</view>
		</zwy-popup>
		
		<zwy-popup v-bind:ishide="isshow2" width="335px" height="317px" radius="10px">
			<!-- 自定义展示内容 -->
			<view class="content">
				<image class="warnIcon" src="../../static/mine/dele2.png"></image>
				<view class="title">
					<text>使用者“</text>
					<text style="color: #02CD88">{{name}}</text>
					<text>”删除后相关个人信息、</text>
				</view>
				<view class="subTitle">报告及心电数据将被清空且无法找回~</view>
				<view class="deleBtn">
					<button class="btn" type="default" @click="cancle" 
					style="position: fixed;bottom: 40px;margin-left: -140px; width: 130px;border-radius: 22.5px; background-color: #cdcdcd;color: #FFFFFF;">取消</button>
					<button class="btn" type="default" @click="confirm2" 
					style="position: fixed;bottom: 40px;margin-left: 10px;width: 130px;border-radius: 22.5px; background-color: #FF4858;color: #FFFFFF;">确认删除</button>
				</view>
			</view>
		</zwy-popup>
		
		
	</view>
</template>

<script lang="ts">
	import { BU_API } from '@/assets/config'
	export default {
		data() {
			return {
				isshow:false,
				isshow2:false,
				name:'',
				user:'',
			}
		},
		methods: { 
			onSwipeClick(e:any, user:Patient){
				uni.showModal({
					title:'您确定删除该成员吗？',
					confirmText: '确认删除',
					confirmColor:'#FF4D4F',
					cancelColor:'#666666',
					success: async (res) => {
						if( res?.confirm ){
							uni.request({
								url: `${BU_API}/pat_app/patients/predelete/${user.uuid}`,
								method: "POST",
								header: {},
								success: (res:any) => {
									if (res.data['error']){
										uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
										return false;
									}
									
									let pending = res.data.pending
									let diagnosed = res.data.diagnosed
									let waiting = res.data.waiting
									let reviewed = res.data.reviewed
									this.name = user.name
									
									console.log( "预删除成功", pending,diagnosed,waiting, reviewed)
									
									if (pending>0 || diagnosed>0) {
										this.isshow = true
										
									} else {
										this.user = user
										this.isshow2 = true
									}
									
								},fail: (err: any) => {
									console.error( "预删除失败", err )
									uni.showToast({ icon: 'none', title: '更新使用者信息到服务器失败' })
									
								}
							})
							
						}
					}
				})
			},
			
			confirm(){
				this.isshow = false
			},
			confirm2(){
				remove(this.user)
				this.isshow2 = false
				uni.redirectTo({
				    url: '/pages/mine/users/users'
				});
			},
			cancle(){
				this.isshow2 = false
			},
			onClick(e:any, user:Patient){
				
				console.log( "onClick", user )
				
				uni.navigateTo({
					url:'/pages/mine/users/adduser/userInfo?user=' + JSON.stringify(user)
				})
			}
			
		}
	}
</script>

<script lang="ts" setup>
	import { Ref, ref } from 'vue'
	import Nav from '@/comps/navbar/navbar.vue'
	import { onLoad,onShow,onUnload } from "@dcloudio/uni-app"
	import { usePatientStore, Patient } from '@/stores/patient';
	import { find, remove } from '@/assets/patient';

	const patStore = usePatientStore()
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
	let patients: Ref<Patient[]> = ref([])
	let currPat: Ref<Patient> = ref()
	onLoad( async (option:any) => {
		console.log("adduser 页面 onLoad:", option)
		// let's submit to find
		try{
			const result: Patient[] = await find()
			patients.value = result
			patStore.setPatients( result )
			currPat.value = patStore.getCurrPat()
		}catch(ex){
			console.error( ex )
		}
	})
	onShow( async (option:any) => {
		uni.$on("getlist",async (e)=>{
			console.log( "监听")
			
		    try{
		    	const result: Patient[] = await find()
		    	patients.value = result
		    	patStore.setPatients( result )
		    	currPat.value = patStore.getCurrPat()
				
		    }catch(ex){
		    	console.error( ex )
		    }
		}) 
	})
	onUnload( async () => {
		console.log( "清除监听")
		// 清除监听
		uni.$off('getlist'); 
	})

	const swipeOptions = ref([
		{
			text: '删除',
			style: {
					backgroundColor: '#e88080'
			}
		}
	])

	const onAddUser = ()=>{
		if( patients.value?.length>=5 ){
			uni.showToast({
				icon:'none', title:'最多设置5个使用者'
			})
		}else{
			uni.redirectTo({
				url: '/pages/mine/users/adduser/adduser?from=users'
			})
		}
	}
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	
	button::after {
		 border: none;
	}
	
	.home{
		.alert{
			background-color: antiquewhite;
			color: #ff5a5f;
			font-size: 12px;
			padding: 10px 10px;
			margin-bottom: 10px;
		}
		.addBtnBack{
			position: absolute;
			bottom: 25px;
			width: 316px;
			height: 166px;
			z-index: -1;
		}
		.btnBack{
			position: absolute;
			bottom: 30px;
			width: 100%;
			height: 166px;
			z-index: -1;
		}
		.user-list{
			padding: 10px;
			.item{
				// line-height: 69px;
				background-color: #fff;
				margin: 5px 0;
				padding: 15px;
				border-radius: 10px;
				height: 35px;
				font-size: 12px;
				color: #999;
				position: relative;
				.tag{
					position: absolute;
					right: 0;
					top: 0;
					background-color: rgba(28, 155, 254, .2);;
					color: @geo-primary;
					border-top-right-radius: 8px;
					border-bottom-left-radius: 8px;
					font-size: 10px;
					padding: 4px 8px;
				}
				.user{
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					.base{
						.name{
							height: 35px;
							font-size: 18px;
							color: #333333;
							font-weight: normal;
							line-height: 35px;
						}
						.age{
							margin-left: 15px;
							font-size: 13px;
						}
						.flag{
							padding: 0 5px;
						}
					}
					.phone{
						font-size: 10px;
						margin-top: 5px;
					}
				}
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
			width: 112px;
			height: 86px;
		}
		.title {
			font-size: 15px;
			margin-top: 30px;
			color: #474747;
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
</style>
