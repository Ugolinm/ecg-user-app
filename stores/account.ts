import { defineStore } from 'pinia';

export interface WX_USERINFO {
	nickName?:string;
	avatarUrl?:string;
	gender?:number;
}
export interface WX_SESSION {
	openid?: string;
	session_key?: string;
	unionid?: string;
}
export interface WX_PHONE {
	phoneNumber?: string;
	purePhoneNumber?: string;
	countryCode?: string;
	watermark?: {
		appid?: string;
		timestamp?: number;
	};
}
export const useWxUserStore = defineStore('account', ()=>{
	let wx_userinfo: WX_USERINFO = {}
	let wx_phoneinfo: WX_PHONE = {}
	let wx_session: WX_SESSION = {}
	let wx_uuid: string
	
	function setWxUserInfo(info: WX_USERINFO){
		wx_userinfo = info
	}
	function getWxUserInfo(){
		return wx_userinfo
	}
	function isLoggedIn(){
		if( wx_userinfo && Object.keys(wx_userinfo).length>0 ) return true
		return false
	}
	
	function setWxPhoneInfo(info: WX_PHONE){
		wx_phoneinfo = info
	}
	function getWxPhoneInfo(){
		return wx_phoneinfo
	}
	
	function setWxSession(info: WX_SESSION){
		wx_session = info
	}
	function getWxSession(){
		return wx_session
	}
	
	function setUUID(uuid: string){
		wx_uuid = uuid
	}
	function getUUID(){
		return wx_uuid
	}
	
	return { wx_userinfo, setWxUserInfo, getWxUserInfo, isLoggedIn, wx_phoneinfo, setWxPhoneInfo, getWxPhoneInfo, setWxSession, getWxSession, setUUID, getUUID }
});