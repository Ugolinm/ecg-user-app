import { defineStore } from 'pinia';

export interface Patient {
	uuid?:string;
	name?:string; // unique
	age?:number;
	birth?:number;
	mobile?:string;
	gender?:number;
	belongto?:string;
	relationship?:string;
	create_tm?:string;
}
export const usePatientStore = defineStore('patient', ()=>{
	let curr_patient: Patient
	let modifiing_patient: Patient
	let patients: Patient[] = []
	
	function setCurrPat(patient: Patient){
		curr_patient = patient
	}
	function getCurrPat(): Patient{
		return curr_patient
	}
	function isPatEnrolled(){
		return ( curr_patient && curr_patient?.name )?true:false
	}
	
	function addPatient(patient: Patient){
		const index = patients.findIndex(item=>item?.name===patient?.name)
		if( index===-1 ) patients.push( patient )
	}
	function dePatient(patient: Patient){
		const index = patients.findIndex(item=>item?.name===patient?.name)
		if( index!==-1 ) patients.splice(index, 1)
	}
	function clearPatients(){
		patients = []
	}
	function setPatients(list: Patient[]){
		patients = list
	}
	function getPatients(){
		return patients
	}
	
	function modifingPatient(pat?:Patient){
		if( !pat ) return modifiing_patient
		else modifiing_patient = pat
	}
	
	return { addPatient, dePatient, clearPatients, setPatients, getPatients, setCurrPat, getCurrPat, modifingPatient, isPatEnrolled }
});