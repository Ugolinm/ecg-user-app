<template>
	<view class="home">
		<Nav title="格式化设备内存" bg="#02CD88" :back="true" @back="onBack"/>
		<view class="box">
			<view class="search-box">
				<view class="type-box">
					<image src="../../static/mine/ble/1.png" style="margin-top: 11px;margin-left:15px;width: 14px;height:13px;"></image>
					<text class="type-title">温馨提示：请确保您的设备已打开</text>
				</view>
				
				<text class="hint">格式化需要先连接设备</text>
				<image src="../../static/mine/ble/3.png" style="margin-top: 30px;width: 185px;height:185px;"></image>
				<text class="hint2">正在搜索设备...</text>
				
			</view>
			
			<!-- result -->
			<view class="empty" v-if="(!ble_list || ble_list.length===0) && time_past==duration">
				<text class="hint">未搜索到设备哦~</text>
			</view>
			<view class="results" v-else>
				<text class="label">已发现的设备</text>
				<view class="list">
					<view class="item" v-for="dev of ble_list" :key="dev?.name">
						<image src="../../static/mine/ble/2.png" style="margin-top: 13px;margin-left:15px;width: 40px;height:40px;"></image>
						<text class="name">{{dev?.name}}</text>
						<button class="geo-btn primary full" style="position: absolute;margin-top: 13px;margin-left: calc(100% - 180px);width: 80px;height: 40px ;border-radius: 20px;background-color: #01CC88;" @click="onConnect(dev)">连接</button>
					</view>
				</view>
			</view>
		</view>
		
		<button class="geo-btn primary full large bold" style="bottom: 170px;margin-left: 15px;width: calc(100% - 30px);" @click="onBleSearch" >重新搜索</button>
		
		<zwy-popup v-bind:ishide="isshow" width="335px" height="328px" radius="10px">
			<!-- 自定义展示内容 -->
			<view class="content">
				<image class="warnIcon" src="../../static/mine/ble/4.png"></image>
				<view class="title">设备连接成功您是否要格式化</view>
				<view class="subTitle">
					格式化后设备文件无法恢复
				</view>
				<view class="subTitle">
					注意检查文件是否都已上传
				</view>
				
				<view class="deleBtn">
					<button class="btn" type="default" @click="confirm" 
					style="position: fixed;bottom: 40px;margin-left: -140px; width: 130px;border-radius: 22.5px; background-color: #FF4858;color: #FFFFFF;">确认格式化</button>
					<button class="btn" type="default" @click="cancle"
					style="position: fixed;bottom: 40px;margin-left: 10px;width: 130px;border-radius: 22.5px; background-color: #01CC88;color: #FFFFFF;">取消</button>
				</view>
			</view>
		</zwy-popup>
		
		
	</view>
</template>

<script lang="ts" setup>
	import { Ref, ref, onUnmounted } from 'vue'
	import Nav from '@/comps/navbar/navbar.vue'
	import { onLoad } from "@dcloudio/uni-app"
	import { startSearch, stopSearch, connect } from '@/assets/ble'
	import { useDeviceStore, Device } from '@/stores/device'
	import { writeBLE, WriteBleType } from '@/assets/ble'
		
	const devStore = useDeviceStore()
	
	onLoad( async (option:any) => {
		console.log("ble=>onLoad:", option)
		// 开始搜索
		onBleSearch()
		
	})
	
	const ble_list: Ref<Device[]> = ref( devStore.getDevices() )
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
	let isshow = ref(false)
	
	const confirm = ()=>{
		isshow.value = false
		const currDev: Device = devStore.getCurrDev()
		writeBLE( WriteBleType.CLEAR, 'clear', currDev )
		uni.navigateBack({
		    // success:function(){
		    //     uni.showToast({ icon:'none', title:'格式化成功' })
		    // }
		})
	}
	const cancle = ()=>{
		isshow.value = false
		uni.navigateBack()
	}
	
	// 连接设备
	const onConnect = (dev: Device)=>{
		onStopSearch() // 当试图连接设备时停止搜索
		uni.showLoading({ title: '正在连接设备' })
		connect( dev ).then((res:any)=>{
			console.log("连接成功回调", dev, res)
			devStore.setCurrDev( dev )
			isshow.value = true
			
		}).catch(err=>{
			console.error( err )
			uni.showToast({ icon:'error', title:'连接失败' })
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	// 页面加载时搜索设备
	let intv:any, time_past = ref(0), duration = ref(30)
	const onBleSearch = ()=>{
		time_past.value = 0
		startSearch()
		intv = setInterval( ()=>{
			time_past.value += 1
			ble_list.value = devStore.getDevices()
			if( time_past.value===duration.value ) onStopSearch()
		}, 1000)
		
	}
	
	// 停止搜索
	const onStopSearch = ()=>{
		clearInterval(intv)
		intv = null
		stopSearch()
	}
	
	// 页面销毁时停止搜索
	onUnmounted( onStopSearch )
	
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	.home{
		background-color: #F5F6F8;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		
		button::after{
			border: none;
		}
		.box{
			height: 100%;
			display: flex;
			flex-direction: column;
			font-size: 12px;
			color: #F5F6F8;
			.search-box{
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 370px;
				overflow: hidden;
				.type-box{
					position: flex;
					flex-direction: row;
					justify-content:center;
					background-color: #FFEEE5;
					margin-top: 15px;
					width: calc(100% - 30px);
					height: 35px;
					border-radius: 5px;
					.type-title{
						position: absolute;
						margin-top: 7px;
						margin-left: 15px;
						height: 20px;
						font-size: 15px;
						font-weight: 400;
						color: #333333;
						line-height: 20px;
					}
				}
				.hint{
					margin-top: 30px;
					font-size: 15px;
					line-height: 21px;
					font-weight: 500;
					text-align: center;
					color: #333333;
				}
				.hint2{
					margin-top: 15px;
					font-size: 14px;
					line-height: 21px;
					font-weight: 600;
					text-align: center;
					color: #666666;
				}
				.searching{
					background-color: red;
					height: 291px;
					display: flex;
					flex-direction: column;
					align-items: center;
					// padding-top: 30px;
					position: relative;
				}
				.search-control{
					// background-color: aqua;
					margin-bottom: 10px;
					color: #666666;
				}
			}
			.empty{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				// margin-top: 100px;
				.icon{
					width: 213px;
					height: 195px;
				}
				.hint{
					font-size: 14px;
					color: #999;
				}
			}
			.results{
				flex: 1;
				// height: 50%;
				overflow-y: auto;
				background-color: #F5F6F8;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 12px;
				color: #777;
				padding: 10px;
				.label{
					width: 100%;
					margin: 0 10px;
					font-size: 14px;
					color: #333;
					text-align: left;
					line-height: 30px;
				}
				.list{
					width: 100%;
					height: calc(100% - 112px);
					overflow: auto;
				}
			}
			// .item{
			// 	background-color: #fff;
			// 	border-radius: 8px;
			// 	padding: 15px;
			// 	height: 65px;
			// 	margin: 10px 0;
			// 	position: flex;
			// 	flex-direction: row;
			// 	.name{
			// 		font-size: 16px;
			// 		font-weight: 500;
			// 		text-align: center;
			// 		color: #333333;
			// 	}
				
			// }
			.item{
				position: flex;
				flex-direction: row;
				background-color: #FFFFFF;
				margin-top: 15px;
				margin-left: 0px;
				width: 100%;
				height: 65px;
				border-radius: 10px;
				.name{
					position: absolute;
					margin-top: 24px;
					margin-left: 15px;
					height: 20px;
					font-size: 15px;
					font-weight: 400;
					color: #333333;
					line-height: 20px;
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
			font-size: 18px;
			margin-top: 20px;
			color: #333333;
			font-weight: normal;
		}
		.subTitle {
			font-size: 15px;
			margin-top: 10px;
			color: #666666;
			font-weight: normal;
		}
		.deleBtn{
			flex-direction: row;
		}
		
	}
</style>
