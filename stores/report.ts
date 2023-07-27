import { defineStore } from 'pinia';

export interface Report {
	patient_id?:string;
	report_id?:string;
	patient_name?:string;
	data_id?:string;
	data_up_tm?:string;
	report_up_tm?:string;
}
export const useReportStore = defineStore('report', ()=>{
	let reports: Report[] = []
	
	function addReport(report: Report){
		const index = reports.findIndex(item=>item?.report_id===report?.report_id)
		if( index===-1 ) reports.push( report )
	}
	function deReport(report: Report){
		const index = reports.findIndex(item=>item?.report_id===report?.report_id)
		if( index!==-1 ) reports.splice(index, 1)
	}
	function clearReports(){
		reports = []
	}
	function setReports(added: Report[]){
		reports = added
	}
	function getReports(){
		return reports
	}
	function joinReports(added: Report[]){
		reports = reports.concat( added )
		return reports
	}
	
	return { addReport, deReport, clearReports, setReports, getReports, joinReports }
});