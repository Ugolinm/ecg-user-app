import { useWxUserStore } from '@/stores/account';
import { BU_API } from '@/assets/config'

const accStore = useWxUserStore()

export function findOrder(pageno:number, pagecnt:number): Promise<any[]>{
	const uuid: string = accStore.getUUID()
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/hist/order/unpaid/${uuid}`,
			method: "POST",
			header: {},
			data: {pageno, pagecnt},
			success: (res:any) => {
				console.log( "findOrder查找成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "findOrder查找失败", err )
				uni.showToast({ icon: 'none', title: '查找未付款失败' })
				reject()
			}
		})
	})
	
}

export function findTraded(pageno:number, pagecnt:number): Promise<any[]>{
	const uuid: string = accStore.getUUID()
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/hist/traded/${uuid}`,
			method: "POST",
			header: {},
			data: {pageno, pagecnt},
			success: (res:any) => {
				console.log( "findTraded查找成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "findTraded查找失败", err )
				uni.showToast({ icon: 'none', title: '查找已支付失败' })
				reject()
			}
		})
	})
	
}

export function findConsume(pageno:number, pagecnt:number): Promise<any[]>{
	const uuid: string = accStore.getUUID()
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/hist/consume/${uuid}`,
			method: "POST",
			header: {},
			data: {pageno, pagecnt},
			success: (res:any) => {
				console.log( "findConsume查找成功", res.data )
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				resolve( res.data )
			},fail: (err: any) => {
				console.error( "findConsume查找失败", err )
				uni.showToast({ icon: 'none', title: '查找已消费失败' })
				reject()
			}
		})
	})
	
}
