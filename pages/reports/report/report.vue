<template>
	<!-- <view class="home"> -->
<!-- 		<Nav :back="true" bg="#1c9bfe" @back="onBack"/>
		<view class="rep-container"> -->
			<web-view :webview-styles="webviewStyles" :src="report_url"></web-view>
<!-- 		</view>
	</view> -->
</template>

<script lang="ts" setup>
	// import Nav from '@/comps/navbar/navbar.vue'
	import { ref } from 'vue'
	import { onLoad } from "@dcloudio/uni-app"
	import { BU_API } from '@/assets/config'
	
	// const onBack = ()=>{
	// 	uni.navigateBack()
	// }
	
	const webviewStyles = {
		progress: {
			color: '#02CD88'
		}
	}
	
	const repid = ref()
	const report_url = ref('')
	onLoad((option:any) => {
		console.log("adduser 页面 onLoad:", option)
		repid.value = option?.repid
		report_url.value = `${BU_API}/${repid.value}`
	})
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	.home{
		background-color: #fff;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		.rep-container{
			flex: 1;
			background-color: red;
			overflow: auto;
		}
	}
</style>
