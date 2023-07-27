import { useDeviceStore, Device } from '@/stores/device'
const devStore = useDeviceStore()
const ruleOfDevName = /^H[a-zA-Z0-9]+$/i // TODO: 设备名字的规则

/**
 * 启动搜索
 * [1] 启动适配器
 * [2] 扫描设备
 * [3] 监听适配器状态
 */
export function startSearch(){
	console.log("开启蓝牙适配器")
	uni.openBluetoothAdapter({
		success: (res:any) => {
			console.log("开启成功", res)
			uni.showToast({ icon: 'none', title: '开始扫描设备...' })
			discovery()
		},
		fail: (err) => {
			console.error("开启失败", err)
			if( err?.errMsg?.endsWith("already opened") ) {
				console.log("失败的原因是[already opened], 无需开启, 开始扫描设备...")
				uni.showToast({ icon: 'none', title: '开始扫描设备...' })
				discovery()
			} else {
				uni.showModal({
					title:'蓝牙开启失败, 请打开蓝牙',
					confirmText: '确定',
					confirmColor:'#01CC88',
					cancelColor:'#666666',
					success: async (res) => {
						if( res?.confirm ){
							uni.openSetting({
							  success (res) {
							    console.log(res.authSetting)
							  }
							})
						}
					}
				})
			}
		},
		complete: () => {
			console.log("开启蓝牙操作结束,进行状态监听")
			uni.onBluetoothAdapterStateChange((res)=>{
				if( !res.available ) {
					console.error("当前蓝牙状态不可用")
					uni.showToast({ icon: 'none', title: '当前蓝牙状态不可用, 请开启' })
				}
			})
		}
	})
}

/**
 * 停止搜索
 */
export function stopSearch(): void {
	console.log("停止扫描设备")
	uni.stopBluetoothDevicesDiscovery({
		success: () => {
			console.log("停止扫描成功")
		},
		fail: (err) => {
			console.error("停止扫描失败:", err)
		}
	})
}

/**
 * 扫描设备
 */
function discovery() {
	console.log("扫描前清除缓存中的历史设备信息")
	devStore.clearDevices()
	uni.startBluetoothDevicesDiscovery({
		// allowDuplicatesKey: true, //允许重复上报同一个设备
		success: (res: any) => {
			console.log("扫描设备成功", res)
			uni.onBluetoothDeviceFound(({devices}) => {
				console.log("发现设备->", devices)
				if( devices && devices.length>0 ){
					const device = devices[0]
					const dev_name = device?.name || device?.localName
					if ( dev_name && ruleOfDevName.test(dev_name) ) { // 搜索到的设备有名称标识, 且名称符合正则条件
						console.log("添加设备到缓存中...", device)
						devStore.addDevice({ name: device?.name, deviceId: device?.deviceId })
					} else {
						console.warn("无效设备或者设备不是目标设备:", dev_name)
					}
				}
			});
		},
		fail: (err) => {
			console.error( "扫描设备失败:", err )
			uni.showToast({ icon: 'none', title: '扫描设备失败' })
			console.log("停止扫描")
			uni.stopBluetoothDevicesDiscovery({})
		}
	});
}

/**
 * 连接设备
 */
export function connect(item: Device){
	console.log("连接设备:", item)
	if( !item || !item.deviceId ) return Promise.reject('无法识别的设备')
	
	return new Promise((resolve, reject)=>{
		uni.createBLEConnection({
			deviceId: item?.deviceId,
			success: (res1: any) => {
				console.log("连接成功:", res1)
				item.connected = true
				setTimeout(() => {
					// 停止搜索
					console.log("连接成功后立即停止搜索")
					uni.stopBluetoothDevicesDiscovery({})
					// 获取服务和特征
					getServices( item.deviceId ).then((res2)=>{
						const { deviceId, serviceId, writeCharacteristicId, notifyCharacteristicId } = res2
						item.deviceId = deviceId
						item.serviceId = serviceId
						item.writeCharacteristicId = writeCharacteristicId
						item.notifyCharacteristicId = notifyCharacteristicId
						resolve( item )
					}).catch( reject )
				}, 1000);
			},
			fail:(err)=>{
				console.error("连接失败:",err)
				item.connected = false
				reject(err)
			}
		});
		
		// 监听蓝牙连接
		console.log("监听蓝牙连接状态")
		uni.onBLEConnectionStateChange(function (res) {
			// 该方法回调中可以用于处理连接意外断开等异常情况
			console.log(`设备 ${res.deviceId} 状态已改变, 连接状态= ${res.connected}`)
			// 如果是当前设备, 则解除绑定
			console.log("设备断开连接后主动清除当前连接设备缓存")
			const curr_dev: Device = devStore.getCurrDev()
			if( curr_dev && curr_dev?.deviceId && res.deviceId===curr_dev.deviceId && !res.connected ) devStore.disconnect() // 当前设备断开连接时
		});
		
		// 监听接收数据
		console.log("监听接收数据")
		uni.onBLECharacteristicValueChange((characteristic) => {
			const hex: string = ab2hex( characteristic.value )
			if( hex?.startsWith("aa05") || hex?.startsWith("aa06") || hex?.startsWith("aa07") ){
				console.log("监听到了特征值变化=", hex )
			}
			
			// 测试用
			// const head = hex.substring(0,4)
			// if( characteristic_test?.findIndex(ch => head==ch) === -1 ){
			// 	characteristic_test.push( head )
			// 	console.log("监听到了特征值变化=", hex, ", 特征Id=", characteristic.characteristicId )
			// }
		});
	})
}
// const characteristic_test = [] // 测试用

/**
 * 断开连接
 */
export function disconnect(dev: Device){
	console.log("断开设备连接")
	if( !dev || !dev.deviceId ) return Promise.reject('无法识别的设备')
	
	return new Promise((resolve, reject)=>{
		uni.closeBLEConnection({
			deviceId: dev?.deviceId,
			success: res=>{
				console.log("断开连接成功:", res)
				dev.connected = false
				resolve( dev )
			},
			fail: err=>{
				console.error("断开连接失败:",err)
				reject( err )
			}
		})
	})
}

/**
 * 获取服务
 */
function getServices(deviceId: string): Promise<{
	deviceId:	string; 
	serviceId:	string; 
	writeCharacteristicId:	string; 
	notifyCharacteristicId:	string;
}> {
	console.log("开始获取设备服务")
	return new Promise((resolve, reject)=>{
		uni.getBLEDeviceServices({ deviceId,
			success: (res1:any) => {
				const { services } = res1
				if( services && services.length>0 ){
					console.log("获取服务成功:", services)
					const serviceId = services[0]?.uuid
					console.log('开始获取指定ServiceId的特征值', serviceId)
					uni.getBLEDeviceCharacteristics({ deviceId, serviceId,
						success: (res2) => {
							const { characteristics } = res2
							if( characteristics && characteristics.length>0 ){
								console.log('获取特征值成功:', characteristics)
								let writeCharacteristicId: any, notifyCharacteristicId: any
								for(let i=0; i<characteristics.length; i++){
									const characteristic = characteristics[i]
									if( characteristic?.properties?.write ){
										console.log('当前具有写功能的特征值:', characteristic)
										writeCharacteristicId = characteristic?.uuid
									}
									if( characteristic?.properties?.notify ){
										console.log('当前具有通知功能的特征值:', characteristic)
										notifyCharacteristicId = characteristic?.uuid
										console.log("启用notify通知", notifyCharacteristicId)
										uni.notifyBLECharacteristicValueChange({ deviceId, serviceId, characteristicId: notifyCharacteristicId, state: true,
											success:(res1)=>{
												console.log( "启用notify成功", res1 )
											},
											fail(err1) {
												console.log("启用notify失败", err1)
											}
										})
									}
								}
								if( writeCharacteristicId ) {
									resolve({ deviceId, serviceId, writeCharacteristicId, notifyCharacteristicId })
								} else {
									console.warn('连接成功, 获取服务成功, 获取特征值成功, 但是特征值不具有写入权限')
									uni.showToast({ icon: 'none', title: '当前设备不可写数据' })
								}
							} else {
								console.error('连接成功, 获取服务成功, 但是无法获取特征值')
								reject('连接成功, 获取服务成功, 但是无法获取特征值')
							}
						},
						fail(err2) {
							console.error("获取特征值失败:", err2)
							reject( err2 )
						}
					})
				} else {
					console.error("连接成功, 但是获取服务失败")
					reject("连接成功, 但是获取服务失败")
				}
			},
			fail:(err1)=>{
				console.error("获取服务失败:", err1)
				reject( err1 )
			}
		})
	})
}

/**
 * 写数据类型
 */
export enum WriteBleType {
	USERID 	 = 'userid',
	WIFINAME = 'wifi-name',
	WIFIPASS = 'wifi-pass',
	CLEAR = 'clear',
}

/**
 * 写数据
 */
export function writeBLE(type:string, value:string, device: Device): Promise<any>{
	console.log("原始写入数据=", value)
	if( !value ) return Promise.reject('未指定写入数据')
	
	console.log("写入数据类型=", type)
	let mode = 0x00
	if( type===WriteBleType.USERID ) 				mode = 0x05
	else if( type===WriteBleType.WIFINAME ) mode = 0x06
	else if( type===WriteBleType.WIFIPASS ) mode = 0x07
	else if( type===WriteBleType.CLEAR ) mode = 0x0E
	else return Promise.reject('未指定写入数据的类型')
	
	
	if( type===WriteBleType.CLEAR ) {
		//帧头+ 帧类别+数据长度+名字字节长度+帧尾
		const bytes = new ArrayBuffer(20)
		const dataview = new DataView(bytes)
		dataview.setUint8(0, 0xAA)
		dataview.setUint8(1, mode)
		for (let i = 0; i < 17; i++) { // TODO: 根据最大长度限制进行末尾补0
			dataview.setUint8( i + 2, 0x00)
		}
		dataview.setUint8(19, 0xCC)
		
		//蓝牙下发指令
		return write( bytes, device );
	} else {
		const len = Math.min( value?.length, 16) // TODO: 目前设备只支持16位长度
		//帧头+ 帧类别+数据长度+名字字节长度+帧尾
		const bytes = new ArrayBuffer(4 + len)
		const dataview = new DataView(bytes)
		dataview.setUint8(0, 0xAA)
		dataview.setUint8(1, mode)
		dataview.setUint8(2, len)
		for (let i = 0; i < len; i++) { // TODO: 根据最大长度限制进行末尾补0
			dataview.setUint8( i + 3, value.charCodeAt(i)??0x00 )
		}
		dataview.setUint8(len + 3, 0xCC)
		
		//蓝牙下发指令
		return write( bytes, device );
	}
}

function write(data: any, device: Device){
	return new Promise((resolve, reject)=>{
		if( !device || !device?.deviceId || !device?.serviceId || !device?.writeCharacteristicId ){
			console.error('设备信息缺失, 无法写入数据', device)
			reject('设备信息缺失, 无法写入数据')
		} else{
			console.log("准备向设备", device, "写入数据(AB)", data)
			console.log("数据的16进制(HEX)", ab2hex(data))
			// const test_data:any = hex2ab("AA050361626300000000000000000000000000CC") // 仅测试使用 abc
			uni.writeBLECharacteristicValue({
				deviceId: device?.deviceId, serviceId: device?.serviceId, characteristicId: device?.writeCharacteristicId,
				value: data, /** 文档上看是 ArrayBuffer, 实际查看代码定义是 any[] */
				// value: test_data,
				success :(res)=> {
					console.log('发送数据成功', res);
					resolve(res)
				},
				fail:(err)=>{
					console.error('发送数据失败', err)
					reject(err)
				}
			})
		}
	})
}

/**
 * ArrayBuffer转换16进制字符串
 */
export function ab2hex(ab: any): string {
	const byteArray = new Uint8Array( ab );
	const hexParts = [];
	for(let i = 0; i < byteArray.length; i++) {
		// convert value to hexadecimal
		const hex = byteArray[i].toString(16);
		// pad with zeros to length 2
		const paddedHex = ('00' + hex).slice(-2);
		// push to array
		hexParts.push(paddedHex);
	}
	return hexParts.join("")
}

/**
 * 16进制字符串转ArrayBuffer
 */
export function hex2ab(hex: string): ArrayBuffer {
	if( !hex ) return
	return new Uint8Array( hex.match(/[\da-f]{2}/gi).map( h=>parseInt(h,16) ) ).buffer
}