import { WX_USERINFO, WX_PHONE, WX_SESSION } from '@/stores/account'
import { WX_API } from '@/assets/config'

export function getUserInfo(): Promise<{code:string; wx_userinfo:WX_USERINFO}>{
	return new Promise((resolve,reject)=>{
		console.log("执行了吗")
		uni.login({
			provider: 'weixin',
			success: (loginRes) => {
				const { code } = loginRes
				if( !code ){
					uni.showToast({ icon: 'error', title: '登录异常' })
					reject()
				} else {
					// get nickname and icon
					uni.getUserInfo({
						provider: 'weixin',
						success: (infoRes) => {
							const { nickName, avatarUrl } = infoRes.userInfo
							const wx_userinfo: WX_USERINFO = { nickName, avatarUrl }
							console.log("用户信息",wx_userinfo)
							resolve( {code, wx_userinfo} )
						},fail: err => {
							console.error( err )
							uni.showToast({ icon: 'none', title: '获取用户信息失败' })
							reject()
						}
					});
				}
			},
			fail: (failRes) => {
				console.error(failRes)
				uni.showToast({ icon: 'error', title: '登录异常' })
				reject()
			}
		})
	})
}

export function getSession(code:string){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${WX_API}/wx/patient/session/${code}`,
			success: (res:any) => {
				const wx_session: WX_SESSION = res?.data
				resolve( wx_session )
			},fail: err => {
				console.error( err )
				uni.showToast({ icon: 'none', title: '获取用户信息失败' })
				reject()
			}
		})
	})
}

export function getPhoneInfo(code:string){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${WX_API}/wx/patient/phone/${code}`,
			success: (res:any) => {
				console.log( res )
				const phone: WX_PHONE = res.data.phone_info
				if( phone?.phoneNumber ) {
					resolve( phone )
				} else {
					uni.showToast({ icon: 'none', title: '未能成功获取手机号, 请重试' })
					reject()
				}
			},fail: (err) => {
				console.error( err )
				uni.showToast({ icon: 'none', title: '获取手机号异常' })
				reject()
			}
		})
	})
}