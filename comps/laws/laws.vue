<template>
	<view class="home">
		<Nav :title="title" bg="#02CD88" :back="true" @back="onBack"/>
		<view class="box">
			<view v-html="html" class="content"></view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import Nav from '@/comps/navbar/navbar.vue'
	import { onLoad } from "@dcloudio/uni-app"
	import { fetchLaws } from "@/assets/laws"
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
	const title = ref("")
	const html = ref("")
	onLoad( async (option:any) => {
		console.log("laws page onLoad:", option)
		title.value = option?.type==='privacy'?'隐私政策':'用户协议'
		const filename = option?.type==='privacy'?'privacy-user-app':'terms-user-app'
		const content = await fetchLaws( filename )
		html.value = content
	})
</script>

<style lang="less" scoped>
	.home{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.box{
			// background-color: aqua;
			width: 100%;
			height: 90%;
			overflow: auto;
			.content{
				padding: 15px;
				font-size: 14px;
				color: #333;
			}
		}
	}

</style>
