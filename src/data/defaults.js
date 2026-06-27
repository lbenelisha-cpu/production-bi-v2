export const facilityTargets=[
{id:"1543",name:"מתקן 1543",unit:"ליטר",targetType:"packagingLines",productionTarget:0,packagingTarget:0,active:true},
{id:"1542",name:"מתקן 1542",unit:"ליטר",targetType:"packagingLines",productionTarget:0,packagingTarget:0,active:true},
{id:"1541",name:"מתקן 1541",unit:"ליטר",targetType:"monthly",productionTarget:210000,packagingTarget:210000,active:true},
{id:"1540",name:"מתקן 1540",unit:"ק״ג",targetType:"daily",productionTarget:18000,packagingTarget:18000,active:true},
{id:"1528",name:"מתקן 1528",unit:"ליטר",targetType:"daily",productionTarget:80000,packagingTarget:80000,active:true},
{id:"1525",name:"מתקן 1525",unit:"ליטר",targetType:"monthly",productionTarget:130000,packagingTarget:130000,active:true},
{id:"1524",name:"מתקן 1524",unit:"ליטר",targetType:"daily",productionTarget:6000,packagingTarget:6000,active:true},
{id:"1523",name:"מתקן 1523",unit:"ליטר",targetType:"daily",productionTarget:40000,packagingTarget:40000,active:true},
{id:"1521",name:"מתקן 1521",unit:"ליטר",targetType:"daily",productionTarget:0,packagingTarget:0,active:true},
{id:"1519",name:"מתקן 1519",unit:"ק״ג",targetType:"daily",productionTarget:0,packagingTarget:0,active:true}
];
export const facilityAliases={"28":"1528"};
export function normalizeFacilityId(id){const clean=String(id||"").trim();return facilityAliases[clean]||clean;}
export const packagingLineTargets=[{id:"1L",name:"קו 1 ליטר",dailyTarget:18000,unit:"ליטר"},{id:"5L",name:"קו 5 ליטר",dailyTarget:60000,unit:"ליטר"},{id:"10_20L",name:"קו 10/20 ליטר",dailyTarget:60000,unit:"ליטר"}];
