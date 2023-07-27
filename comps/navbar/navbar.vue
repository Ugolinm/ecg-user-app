<template>
	<view class="nav-bar" :style="{'height': nav_bar_height + 'px', 'background': bg}">
		<view class="status-bar" :style="{'height': status_bar_height + 'px'}"></view>
		<view class="title-bar" :style="{'height': title_bar_height + 'px'}">
			<image class="back-btn" src="../../static/mine/back.png" mode="" v-if="back" @click="onBack"></image>
			<text class="title">{{title}}</text>
			<view class="dummy" v-if="back">&nbsp;</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue'
	
	const { title, bg, back } = defineProps({
		title: { type: String, default: "" },
		bg: { type: String, default: "transparent" },
		back: { type: Boolean, default: false }
	})
	
	const emits = defineEmits(["back"])
	
	const onBack = ()=>{
		emits("back")
	}
	
	const nav_bar_height = ref(0), status_bar_height = ref(0), title_bar_height = ref(0)
	onMounted(()=>{
		let menuButtonObject = uni.getMenuButtonBoundingClientRect();
		uni.getSystemInfo({//获取系统信息
				success: res => {
						title_bar_height.value = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2;
						status_bar_height.value = res.statusBarHeight
						nav_bar_height.value = title_bar_height.value + status_bar_height.value
						// console.log( nav_bar_height, status_bar_height, title_bar_height )
				},
				fail(err) {
						console.log(err);
				}
		})
	})
</script>

<style lang="less" scoped>
	.nav-bar{
		display: flex; 
		flex-direction: column;
		.status-bar {
			// background-color: black;
			display: inline-flex;
			width: 100%;
		}
		.title-bar {
			// background-color: red;
			display: inline-flex;
			width: 100%;
			align-items: center;
			justify-content: center;
			.back-btn{
				width: 10px;
				height: 18px;
				padding: 0 20px;
			}
			.title{
				flex: 1;
				color: white;
				font-size: 18px;
				font-weight: bold;
				text-align: center;
			}
			.dummy{
				width: 50px;
			}
		}
	}
</style>
