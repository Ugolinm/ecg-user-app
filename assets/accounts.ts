import { WX_USERINFO, WX_PHONE, WX_SESSION } from '@/stores/account'
import { WX_API, BU_API } from '@/assets/config'
import { useWxUserStore } from '@/stores/account'
const wx_user_store = useWxUserStore()

export interface T_ACCOUNTS {
	uuid?: string;
	openid?: string;
	unionid?: string;
	mobile?: string;
	nickname?: string;
	avatarUrl?: string;
	create_tm?: string;
}

export function signup(){
	//TODO:
	const userinfo: WX_USERINFO = wx_user_store.getWxUserInfo()
	const session: WX_SESSION   = wx_user_store.getWxSession()
	const phone: WX_PHONE       = wx_user_store.getWxPhoneInfo()
	const account: T_ACCOUNTS   = {
		unionid		: session?.unionid,
		openid		: session?.openid,
		mobile		: phone?.phoneNumber,
		nickname	: userinfo?.nickName,
		avatarUrl	: userinfo?.avatarUrl
	}
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/accounts/signup`,
			method: "POST",
			header: {},
			data: account,
			success: (res:any) => {
				console.log( "注册微信账号:", res.data )
				
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				
				const {uuid} = res.data
				if(uuid) wx_user_store.setUUID(uuid)
				resolve( res.data )
			},fail: (res:any) => {
				console.error( res )
				uni.showToast({ icon: 'none', title: '保存用户信息到服务器失败' })
				reject()
			}
		})
	})
}

export function getOld(){
	const uuid: string = wx_user_store.getUUID()
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/accounts/${uuid}`,
			method: "GET",
			header: {},
			success: (res:any) => {
				console.log( "获取用户头像成功:", res.data )
				
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '查找的微信用户信息不存在' })
					return false;
				}
				
				uni.setStorage({
					key: 'avatarUrlValue',
					data: res.data.avatarUrl
				});
				uni.setStorage({
					key: 'nickNameValue',
					data: res.data.nickname
				});
				
				resolve( res.data )
			},fail: (res:any) => {
				console.error( res )
				uni.showToast({ icon: 'none', title: '获取用户信息失败' })
				reject()
			}
		})
	})
}

export function updateNickname(nickname:string){
	const uuid: string = wx_user_store.getUUID()
	
	const account: T_ACCOUNTS   = {
		uuid		: uuid,
		nickname	: nickname,
	}
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/accounts/update`,
			method: "POST",
			header: {},
			data: account,
			success: (res:any) => {
				console.log( "昵称更新成功:", res.data )
				
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				
				uni.setStorage({
					key: 'nickNameValue',
					data: res.data.nickname
				});
				
				resolve( res.data )
			},fail: (res:any) => {
				console.error( res )
				uni.showToast({ icon: 'none', title: '更新用户信息到服务器失败' })
				reject()
			}
		})
	})
}

export function updateAvatarUrl(avatarUrl:string){
	const uuid: string = wx_user_store.getUUID()
	
	const account: T_ACCOUNTS   = {
		uuid		: uuid,
		avatarUrl	: avatarUrl,
	}
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/pat_app/accounts/update`,
			method: "POST",
			header: {},
			data: account,
			success: (res:any) => {
				console.log( "头像更新成功:", res.data )
				
				if (res.data['error']){
					uni.showToast({ icon: 'none', title: '服务器异常，请联系客服' })
					return false;
				}
				
				const {uuid} = res.data
				if(uuid) wx_user_store.setUUID(uuid)
				resolve( res.data )
			},fail: (res:any) => {
				console.error( res )
				uni.showToast({ icon: 'none', title: '更新用户信息到服务器失败' })
				reject()
			}
		})
	})
}