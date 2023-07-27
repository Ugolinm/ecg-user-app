import { useWxUserStore } from '@/stores/account';
import { BU_API } from '@/assets/config'

const accStore = useWxUserStore()

export function find(pageno:number, pagecnt:number): Promise<any[]>{
	const uuid: string = accStore.getUUID()
	
	const userUUID = uni.getStorageSync('userUUID');
	
	console.log("report当前使用者:", userUUID)
	
	if (userUUID) {
		return new Promise((resolve,reject)=>{
			uni.request({
				url: `${BU_API}/pat_app/reports/pat/${userUUID}`,
				method: "POST",
				header: {},
				data: {pageno, pagecnt},
				success: (res:any) => {
					console.log( "查找成功", res.data )
					
					if (res.data['error']){
						uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
						return false;
					}
					
					resolve( res.data )
				},fail: (err: any) => {
					console.error( "查找失败", err )
					uni.showToast({ icon: 'none', title: '查找报告失败' })
					reject()
				}
			})
		})
	} else {
		console.log("report当前账号:", uuid)
		return new Promise((resolve,reject)=>{
			uni.request({
				url: `${BU_API}/pat_app/reports/${uuid}`,
				method: "POST",
				header: {},
				data: {pageno, pagecnt},
				success: (res:any) => {
					console.log( "查找成功", res.data )
					
					if (res.data['error']){
						uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
						return false;
					}
					
					resolve( res.data )
				},fail: (err: any) => {
					console.error( "查找失败", err )
					uni.showToast({ icon: 'none', title: '查找报告失败' })
					reject()
				}
			})
		})
	}
	
	
}
