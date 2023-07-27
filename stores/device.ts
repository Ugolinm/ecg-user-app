import { defineStore } from 'pinia';

export interface Device {
	connected?:boolean;				// 监听得到的设备连接状态
	name?:string; 						// 设备名称
	deviceId?:string; 				// 设备uuid
	serviceId?:string; 				// 设备的服务uuid(获取的index:0的serviceId): 6e400001-b5a3-f393-e0a9-e50e24dcca9e
	writeCharacteristicId?:string; // 设备的特征值uuid(获取的可写charactisticId)
	notifyCharacteristicId?:string; // 设备的特征值uuid(获取的通知charactisticId)
	version?:string; 					// 暂时没有用
}
export const useDeviceStore = defineStore('device', ()=>{
	let curr_device: Device
	let devices: Device[] = []
	
	function setCurrDev(dev: Device){
		curr_device = dev
	}
	function getCurrDev(): Device{
		return curr_device
	}
	function isConnected(){
		return ( curr_device && curr_device?.name )?true:false
	}
	
	function addDevice(dev: Device){
		const index = devices.findIndex(item=>item.name===dev.name)
		if( index===-1 ) devices.push( dev )
	}
	function deDevice(dev: Device){
		const index = devices.findIndex(item=>item.name===dev.name)
		if( index!==-1 ) devices.splice(index, 1)
	}
	function clearDevices(){
		devices = []
	}
	function getDevices(){
		return devices
	}
	function disconnect(){
		curr_device = null
	}
	
	return { setCurrDev, getCurrDev, isConnected, addDevice, deDevice, getDevices, clearDevices, disconnect }
});