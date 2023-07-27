export function getAge(birth:number) {
	if( birth===0 ) return 0
	
	const today = Date.now()
	const diff = today - birth
	if( diff>0 ) return Math.ceil((today-birth)/31536000000)
	return 0
}

export function getAge2(year:number, month:number, day:number) {
	if( year===0 ) return 0
	
	const date = new Date()
	date.setFullYear(year)
	date.setMonth(month-1)
	date.setDate(day)
	
	const today = Date.now()
	const diff = today - date.getTime()
	if( diff>0 ){
		// return Math.ceil(diff/31536000000)
		
		return date.getTime()
		
	} else {
		return 0
	}
}

export function getBirthDay(year:number, month:number, day:number) {
	let result = year + '-' + month + '-' + day;
	return result
}

export function collectTime(time:number) {
	if( time < 60 ) return `${time}秒`
	if( time >= 60 && time < 60*60 ) return `${(time/60).toFixed(2)}分钟`
	if( time >= 60*60 ) return `${(time/60/60).toFixed(2)}小时`
}

function ts_digits(ts:number){
  return ts.toString().length
}
function ts_10to13(ts_10:number){
  return ts_10*1000
}
enum TS_DIGIT {
  _10 = 10,
  _13 = 13
}

export function js_date_time(unixtime:string): string {
	var dateTime = new Date(parseInt(unixtime))
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth() + 1;
	var day = dateTime.getDate();
	var timeSpanStr = year + '-' + month + '-' + day;
	return timeSpanStr;
}


export function format ( fmt: string, val: Date|string|number ): string{
	
	let dt:any;
	if( val instanceof Date ){
		dt = val
		
	}else if( typeof val === 'number' ){
		dt = new Date( ts_digits(val)===TS_DIGIT._10?ts_10to13(val):val )
		
	}else if( typeof val === 'string' ){
		if( /^\d+$/.test(val) ){
			const ts = parseInt(val)
			dt = new Date( ts_digits(ts)===TS_DIGIT._10?ts_10to13(ts):ts )
		} else {
			try{
				dt = new Date(val)
			}catch(ex){
				dt = new Date( Date.parse(val.replace(/-/g,'/')) )
			}
		}
	
	}else{
		console.log( "无法识别日期类型:", val )
		return val
	}
	const Y = dt.getFullYear(); //year
	const M = dt.getMonth()+1;  //month 
	const D = dt.getDate();     //day 
	const h = dt.getHours();    //hour 
	const m = dt.getMinutes();  //minute 
	const s = dt.getSeconds();  //second 
	const Q = Math.floor((dt.getMonth()+3)/3); //quarter 
	const S = dt.getMilliseconds(); //millisecond 

	const _Y = Y.toString();
	const _M = M.toString().replace(/^(\d)$/,"0$1");
	const _D = D.toString().replace(/^(\d)$/,"0$1");
	const _h = h.toString().replace(/^(\d)$/,"0$1");
	const _m = m.toString().replace(/^(\d)$/,"0$1");
	const _s = s.toString().replace(/^(\d)$/,"0$1");
	const _Q = Q.toString();
	const _S = S.toString().replace(/^(\d)$/,"0$1");

	const _v = fmt.replace(/Y/g,_Y).replace(/M/g,_M).replace(/D/g,_D)
				.replace(/h/g,_h).replace(/m/g,_m).replace(/s/g,_s)
				.replace(/S/g,_S).replace(/Q/g,_Q);
	return _v;
}

