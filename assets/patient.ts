import { usePatientStore, Patient } from '@/stores/patient';
import { useWxUserStore } from '@/stores/account';
import { BU_API } from '@/assets/config'

const patStore = usePatientStore()
const accStore = useWxUserStore()

export function add(){
	const uuid: string = accStore.getUUID()
	
	console.log("登记用户时检查当前账号:", uuid)
	const item: Patient = patStore.modifingPatient()
	item.belongto = uuid
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/patients/add`,
			method: "POST",
			header: {},
			data: item,
			success: (res:any) => {
				console.log( "添加成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "添加失败", err )
				uni.showToast({ icon: 'none', title: '保存使用者信息到服务器失败' })
				reject()
			}
		})
	})
}

export function update(){
	const uuid: string = accStore.getUUID()
	
	console.log("登记用户时检查当前账号:", uuid)
	const item: Patient = patStore.modifingPatient()
	item.belongto = uuid
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/patients/update`,
			method: "POST",
			header: {},
			data: item,
			success: (res:any) => {
				console.log( "更新成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "更新失败", err )
				uni.showToast({ icon: 'none', title: '保存使用者信息到服务器失败' })
				reject()
			}
		})
	})
}

export function remove(pat: Patient){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/patients/delete`,
			method: "POST",
			header: {},
			data: pat,
			success: (res:any) => {
				console.log( "删除成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "删除失败", err )
				uni.showToast({ icon: 'none', title: '更新使用者信息到服务器失败' })
				reject()
			}
		})
	})
}

export function find(): Promise<Patient[]>{
	const uuid: string = accStore.getUUID()
	
	console.log("patient查找用户时检查当前账号:", uuid)
	if( !uuid ) return Promise.reject('当前账户信息丢失, 无法查询使用者信息')
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/patients/find`,
			method: "POST",
			header: {},
			data: {belongto: uuid},
			success: (res:any) => {
				console.log( "查找用户成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "查找用户失败", err )
				uni.showToast({ icon: 'none', title: '查找使用者信息到服务器失败' })
				reject()
			}
		})
	})
}