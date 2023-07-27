import { BU_API } from "./config"

export function fetchLaws(filename:string): Promise<string> {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BU_API}/doc_web/fetch-laws/${filename}`,
			success: ({data}:any) => {
				resolve( data )
			},fail: err => {
				console.error( err )
				reject( err )
			}
		})
	})
}