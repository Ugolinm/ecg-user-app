let BU_API = "", WX_API = ""

if ( process.env.NODE_ENV === 'development' ){
	console.log('现在是开发环境')
	// 开发环境
	WX_API = 'http://localhost:8080/wx'
	BU_API = 'http://localhost:8080/bu' 
} else {
	console.log('现在是生产环境')
	// 生产环境
	WX_API = 'http://localhost:8080' 
	BU_API = 'https://api.alphaecg.cn/bu' 
	
}

export { WX_API, BU_API }