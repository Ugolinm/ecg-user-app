import { defineStore } from 'pinia';

export interface WiFi {
	wifi_name?:string;
	wifi_pass?:string;
}
export const useWiFiStore = defineStore('wifi', ()=>{
	let wifi: WiFi
	
	function setWiFi(w: WiFi){
		wifi = w
	}
	function getWiFi(){
		return wifi
	}
	function isWiFiSet(){
		return ( wifi && wifi?.wifi_name )?true:false
	}
	
	return { setWiFi, getWiFi, isWiFiSet }
});