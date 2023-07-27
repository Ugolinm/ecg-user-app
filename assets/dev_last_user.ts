import { Device, useDeviceStore } from '@/stores/device'
import { Patient, usePatientStore } from '@/stores/patient'
import { useWxUserStore } from '@/stores/account';
import { BU_API } from '@/assets/config'

export interface T_DEV_LAST_USER {
	dev_id?: string;
	dev_name?: string;
	dev_version?: string;
	last_userid?: string;
	last_used_tm?: string;
}
export function enroll(): Promise<any>{
	const patStore = usePatientStore()
	const devStore = useDeviceStore()
	const currPat: Patient = patStore.getCurrPat()
	const currDev: Device = devStore.getCurrDev()
	
	const dev: T_DEV_LAST_USER = {
		dev_id: currDev?.deviceId,
		dev_name: currDev?.name,
		dev_version: currDev?.version,
		last_userid: currPat?.uuid
	}
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/dev/enroll`,
			method: "POST",
			header: {},
			data: dev,
			success: (res:any) => {
				resolve( res.data )
			},fail: (err: any) => {
				console.error( err )
				uni.showToast({ icon: 'none', title: '登记用户信息到服务器失败' })
				reject(err)
			}
		})
	})
}

export function find(): Promise<any[]>{
	const devStore = useDeviceStore()
	const currDev = devStore.getCurrDev()
	const accStore = useWxUserStore()
	const acc_id: string = accStore.getUUID()
	
	const conds = {
		dev_id: currDev?.deviceId,
		dev_name: currDev?.name,
		belongto: acc_id
	}
	console.log("最后一次使用者的查找条件:", conds)
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/dev/status`,
			method: "POST",
			header: {},
			data: conds,
			success: (res:any) => {
				resolve( res.data )
			},fail: (err: any) => {
				console.error( err )
				uni.showToast({ icon: 'none', title: '获取用户信息到服务器失败' })
				reject()
			}
		})
	})
}