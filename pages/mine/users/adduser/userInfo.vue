<template>
	<view class="home">
		<Nav title="使用者详情" bg="#02CD88" :back="true" @back="onBack"/>
		
		<view class="list">
			<image class="line" src="../../static/mine/line.png" mode=""></image>
			<view class="title">
				基本信息
			</view>
			<view class="item">
				<view class="left">
					<text class="required">*</text>
					<text class="title">姓名</text>
				</view>
				<view class="right">
					<input class="text" disabled="true" style="margin-right: 10px;color: #333333;" type="text" v-model="pat_name" placeholder="请填写" placeholder-style="color:#999999" @input="onNameKey" maxlength="10" />
				</view>
			</view>
			
			<view class="item">
				<view class="left">
					<text class="required">*</text>
					<text class="title">性别</text>
				</view>
				<view class="right" @click="onModify('性别', 'drop', ['男','女'])">
					<text class="value">{{pat_gender===1?'女':(pat_gender===0?'男':'请选择')}}</text>
					<image class="more-icon" src="../../static/mine/next.png" mode=""></image>
				</view>
			</view>
			
			<view class="item">
				<view class="left">
					<text class="required">*</text>
					<text class="title">出生日期</text>
				</view>
				<view class="right" @click="onBirth">
					<view class="value">{{pat_birth||'请选择'}}
					</view>
					<image class="more-icon" src="../../static/mine/next.png" mode=""></image>
				</view>
			</view>
			
			<view class="item">
				<view class="left">
					<text class="title">手机号</text>
				</view>
				<view class="right">
					<!-- <text class="value">{{patient?.mobile||'请填写'}}</text> -->
					<input class="uni-input text" style="margin-right: 10px;color: #333333;" type="number" v-model="pat_mobile" placeholder="请填写" placeholder-style="color:#999999" @input="onMobileKey" maxlength="11" />
					<!-- <image class="more-icon" src="../../static/mine/next.png" mode=""></image> -->
				</view>
			</view>
			
			<view class="item">
				<view class="left">
					<text class="title">关系</text>
				</view>
				<view class="right" @click="onModify('关系', 'drop', relationships)">
					<text class="value" >{{pat_relationship||'请选择'}}</text>
					<image class="more-icon" src="../../static/mine/next.png" mode=""></image>
				</view>
			</view>
			
			
			
		</view>
		
		<button class="geo-btn primary full large bold" style="margin-top: 30%;margin-left: 15px;width: calc(100% - 30px);" @click="onSave" :loading="saving">保存</button>
		
		<!-- popup model -->
		<view style="width: 100%;">
			<uni-popup ref="popup_model" background-color="#fff">
				<view>
					<picker-view  v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="picker-item" v-for="(item,index) in years" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-item" v-for="(item,index) in months" :key="index">{{item}}月</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-item" v-for="(item,index) in days" :key="index">{{item}}日</view>
						</picker-view-column>
						
						<button class="geo-btn primary full" style="position: fixed;bottom: 30px;margin-left: 30px;width: 130px;height: 40px;background-color: #EDEDED; color: #03C160;" @click="cancle">取消</button>
						<button class="geo-btn primary full" style="position: fixed;bottom: 30px;margin-left: calc(100% - 160px);width: 130px;height: 40px;background-color: #03C160;" @click="confirm">确定</button>
						
					</picker-view>
				</view>
			</uni-popup>
		</view>
		
	</view>
</template>

<script lang="ts" setup>
	import { Ref, nextTick, ref } from 'vue'
	import Nav from '@/comps/navbar/navbar.vue'
	import { getAge2,format, getBirthDay,js_date_time} from '@/assets/utils'
	import { onLoad } from "@dcloudio/uni-app"
	import { usePatientStore, Patient } from '@/stores/patient';
	import { update } from '@/assets/patient';

const patStore = usePatientStore()

	const enum pageFrom {
		index = 'index',
		users = 'users'
	}
	
	const relationships = ref(['本人','父亲','母亲','其他'])
	
	let patient: Patient = {}
	const pat_name = ref()
	const pat_birth = ref()
	const pat_mobile = ref()
	const pat_gender = ref()
	const pat_relationship = ref()
	
	onLoad((option:any) => {
		console.log("userInfo 页面 onLoad:", option)
		patient = JSON.parse(option.user)
		patStore.modifingPatient( patient )
		pat_name.value = patient?.name
		
		if (patient.birth){
			pat_birth.value = js_date_time(patient?.birth)
		} else {
			pat_birth.value = '请选择'
		}
		pat_mobile.value = patient?.mobile
		pat_gender.value = patient?.gender
		pat_relationship.value = patient?.relationship
	})
	
	const onBack = ()=>{
		uni.navigateBack()
	}
	
	const onBirth = ()=>{
		popup_model.value.open("bottom")
	}
	
	const onNameKey = (e)=>{
		const v = e.target?.value
		console.log( v )
		const rule = /[^\u4E00-\u9FA5A-Za-z]/g
		nextTick(()=>{
			pat_name.value = v?.replace(rule, '')
			patient.name = pat_name.value
			// patStore.modifingPatient( patient )
		})
	}
	
	const onMobileKey = (e)=>{
		const v = e.target?.value
		console.log( v )
		const rule = /[^\d]/g
		pat_mobile.value = v?.replace(rule, '')
		patient.mobile = pat_mobile.value
		// patStore.modifingPatient( patient )
	}
	
	const onModify = (key:string, type:string, options?:any)=>{
		if( type=='drop'){
			uni.showActionSheet({
				itemList:options,
				success: (res) => {
					console.log(res?.tapIndex)
					if( key==='性别' ){
						pat_gender.value = res?.tapIndex
						patient.gender = res?.tapIndex
						// patStore.modifingPatient( patient )
					}
					if( key==='关系' ){
						pat_relationship.value = relationships.value[res?.tapIndex]
						patient.relationship = relationships.value[res?.tapIndex]
						// patStore.modifingPatient( patient )
					}
				},
				fail: (res) => {
					console.log(res)
				}
			})
		}
	}
	
	const saving = ref(false)
	const onSave = async ()=>{
		// 保存到stores、提交至服务器
		patStore.modifingPatient( patient )
		// const item: Patient = patStore.modifingPatient()
		
		if( !patient?.name || !patient?.birth || !(patient?.gender===0 || patient?.gender===1) ){
			uni.showToast({ icon: 'none', title: '姓名、性别、出生日期不能为空' })
			return
		}
		
		if( (patient?.gender===0 && pat_relationship.value==='母亲') || (patient?.gender===1 && pat_relationship.value==='父亲') ){
			uni.showToast({ icon: 'none', title: '请选择正确的关系' })
			return
		}
		
		const mobile_rule =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/
		if( patient?.mobile && !mobile_rule.test( patient?.mobile ) ){
			uni.showToast({ icon: 'none', title: '不是有效的手机号' })
			return
		}
		
		uni.showLoading({ title: '保存中...' })
		saving.value = true
		try{
			await update()
			uni.$emit("getlist",{})
			uni.navigateBack()
		}catch(ex){}
		
		setTimeout(()=>{
			saving.value = false
		}, 1000)
		uni.hideLoading()
	}
	
	const popup_model = ref()
	
	const date = new Date()
	const years = []
	const year = ref(date.getFullYear()-18)
	const months = []
	const month = ref(date.getMonth() + 1)
	const days = []
	const day = ref(date.getDate())
	for (let i = 1850; i <= date.getFullYear()-18; i++) {
			years.push(i)
	}
	for (let i = 1; i <= 12; i++) {
			months.push(i)
	}
	for (let i = 1; i <= 31; i++) {
			days.push(i)
	}
	const value = ref([9999, month.value - 1, day.value - 1])
	const visible = ref(true)
	const indicatorStyle = ref(`height: 50px;`)
	const bindChange = (e)=> {
		console.log( e )
		
		const val = e.detail.value
		year.value = years[val[0]]
		month.value = months[val[1]]
		day.value = days[val[2]]
		pat_birth.value = getBirthDay(year.value, month.value, day.value)
		patient.birth = getAge2(year.value, month.value, day.value)
	}
	
	const cancle = ()=> {
		popup_model.value.close("bottom")
	}
	
	const confirm = (e)=> {
		pat_birth.value = getBirthDay(year.value, month.value, day.value)
		
		console.log("getAge2", getAge2(year.value, month.value, day.value) )
		
		patient.birth = getAge2(year.value, month.value, day.value)
		
		popup_model.value.close("bottom")
	}
	
</script>

<style lang="less" scoped>
	@import url("@/assets/common.less");
	
	button::after {
		 border: none;
	}
	.home{
		background-color: #F5F7FB;
		background-repeat: no-repeat;
		background-size: contain;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		.btnBack{
			position: absolute;
			margin-top: 15%;
			width: 100%;
			height: 166px;
			z-index: -1;
		}
		.hint{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 30px;
			color: #fff;
			.subject{
				font-size: 16px;
			}
			.message{
				font-size: 12px;
				margin-top: 20px;
				margin-bottom: 30px;
			}
		}
		.list{
			background-color: #fff;
			padding: 20px;
			.title{
				margin-top: -25px;
				z-index: 66;
			}
			.line{
				height: 4px;
				width: 80px;
				z-index: -1;
			}
			.item{
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 15px 0;
				border-bottom: 1px solid #eee;
				font-size: 14px;
				color: #555;
				&:last-child{
					border-bottom: 0;
				}
				.left{
					.required{
						color: @geo-error;
					}
					.title{
						padding: 0 4px;
					}
				}
				.right{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.text{
						text-align: right;
					}
					.value{
						padding: 0 4px;
					}
					.more-icon{
						width: 8px;
						height: 13px;
					}
				}
			}
		}
		.picker-view {
			width: 750rpx;
			height: 650rpx;
			margin-top: 20rpx;
		}
		.picker-item {
			line-height: 50px;
			align-items: center;
			justify-content: center;
			text-align: center;
		}
	}
</style>
