import {facilityTargets,packagingLineTargets,normalizeFacilityId} from "../data/defaults.js";
export const SETTINGS_KEY="adama_production_bi_settings_v2";export const ENTRIES_KEY="adama_production_bi_entries_v1";
export function loadSettings(){try{const saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}");const facilities=(saved.facilities||facilityTargets).map(f=>({...f,id:normalizeFacilityId(f.id),name:f.id==="28"?"מתקן 1528":f.name})).filter((f,i,a)=>a.findIndex(x=>x.id===f.id)===i);return{facilities,lines:saved.lines||packagingLineTargets,audit:saved.audit||[]}}catch{return{facilities:facilityTargets,lines:packagingLineTargets,audit:[]}}}
export function saveSettings(s){localStorage.setItem(SETTINGS_KEY,JSON.stringify(s))}
export function loadEntries(){try{return JSON.parse(localStorage.getItem(ENTRIES_KEY)||"[]").map(e=>({...e,facility:normalizeFacilityId(e.facility)}))}catch{return[]}}
export function saveEntries(e){localStorage.setItem(ENTRIES_KEY,JSON.stringify(e))}
export function fmt(n){return Math.round(Number(n||0)).toLocaleString("en-US")}
export function todayISO(){return new Date().toISOString().slice(0,10)}
