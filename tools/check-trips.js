#!/usr/bin/env node
// Checks every trip file before you publish. Usage:  node tools/check-trips.js [trip-id ...]
// Prints ERRORS (must fix) and WARNINGS (look at them). Exit code 1 if any errors.
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const rd=p=>fs.readFileSync(path.join(root,p),"utf8");
let idx;try{idx=JSON.parse(rd("trips/index.json")).trips}catch(e){console.log("ERROR trips/index.json cannot be read: "+e.message);process.exit(1)}
const want=process.argv.slice(2),ids=want.length?want:idx.map(t=>t.id);
const ACT=["hike","bike","paddle"],KINDS=["s","e","c","p"];
let totalErr=0,totalWarn=0;
const seen=new Set();idx.forEach(e=>{if(seen.has(e.id)){console.log("ERROR trips/index.json lists "+e.id+" twice");totalErr++}seen.add(e.id)});
const dirs=fs.readdirSync(path.join(root,"trips")).filter(d=>fs.existsSync(path.join(root,"trips",d,"trip.json")));
dirs.forEach(d=>{if(!seen.has(d)){console.log("WARNING trips/"+d+" exists but is not listed in trips/index.json, so it will not show on the home page");totalWarn++}});
const hav=(a,b)=>{const r=Math.PI/180,dy=(b[0]-a[0])*r,dx=(b[1]-a[1])*r,h=Math.sin(dy/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dx/2)**2;return 12742*Math.asin(Math.sqrt(h))};
for(const id of ids){
 const E=[],W=[],e=idx.find(x=>x.id==id);
 if(!e)E.push("not listed in trips/index.json");
 if(!/^[a-z0-9_-]+$/.test(id))E.push("trip id must only use a-z, 0-9, - and _");
 let t=null;try{t=JSON.parse(rd("trips/"+id+"/trip.json"))}catch(x){E.push("trips/"+id+"/trip.json cannot be read: "+x.message)}
 if(t){
  const need=["format","id","name","short","region","activity","timezone","declination","weather","offline","route","days","sidetrips","water"];
  need.forEach(k=>{if(!(k in t))E.push("missing \""+k+"\"")});
  if(t.id!==undefined&&t.id!==id)E.push("\"id\" is \""+t.id+"\" but the folder is \""+id+"\"");
  if(!ACT.includes(t.activity))E.push("\"activity\" must be hike, bike or paddle");
  try{new Intl.DateTimeFormat("en",{timeZone:t.timezone})}catch(_){E.push("\"timezone\" is not a valid time zone name (example: America/Vancouver)")}
  if(!t.weather||!(Math.abs(t.weather.lat)<=90&&Math.abs(t.weather.lon)<=180))E.push("\"weather\" needs lat and lon numbers");
  if(typeof t.declination!=="number")E.push("\"declination\" must be a number (degrees east, about 15 for BC and Washington)");
  const O=t.offline||{};if(!["box","corridor"].includes(O.mode))E.push("\"offline.mode\" must be box or corridor");
  if(t.activity&&t.activity!="hike"&&O.mode=="box")W.push("bike and paddle trips should use offline mode corridor (box can download far too many tiles)");
  if(O.zoomMax>16)W.push("offline zoomMax above 16 downloads a very large number of tiles");
  const R=Array.isArray(t.route)?t.route:[];
  if(R.length<2)E.push("route needs at least 2 points");
  let badPt=0,badKm=0,big=0;
  R.forEach((p,i)=>{if(!(Array.isArray(p)&&p.length>=3&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180&&typeof p[2]=="number"))badPt++;else if(i){if(p[2]<R[i-1][2])badKm++;const dk=p[2]-R[i-1][2],dd=hav(R[i-1],p);if(dd>1.5&&dd>dk*3+0.3)big++}});
  if(badPt)E.push(badPt+" route points are not [lat, lng, km]");if(badKm)E.push("route km goes backwards at "+badKm+" points");
  if(big)W.push(big+" route points jump much further on the map than their km changes (a gap or a bad point in the line?)");
  if(R.length>6000)W.push("route has "+R.length+" points, which may be slow on a phone (aim for under 4,000)");
  const end=R.length?R[R.length-1][2]:0;
  if(e){if(Math.abs(end-e.km)>0.06)E.push("trips/index.json says "+e.km+" km but the route is "+end+" km");
   if(e.days!==(t.days||[]).length)E.push("trips/index.json says "+e.days+" days but the trip has "+(t.days||[]).length);
   ["name","region","activity"].forEach(k=>{if(e[k]!==t[k])E.push("\""+k+"\" differs between trips/index.json (\""+e[k]+"\") and trip.json (\""+t[k]+"\")")});
   if("done" in e){if(!(Number.isInteger(e.done)&&e.done>=2000&&e.done<=2200))E.push("\"done\" in trips/index.json must be a 4-digit year (example: 2027)");if(!e.short)W.push("\"done\" is set but trips/index.json has no \"short\" name, so the Past trips list will use the full trip name")}
   const pp=e.prep||{};Object.keys(pp).forEach(k=>{if(!["packing","logistics"].includes(k))W.push("unknown prep button \""+k+"\"");else if(!(pp[k]=="soon"||/^https:\/\//.test(pp[k])))E.push("prep."+k+" must be an https link or \"soon\"")})}
  const D=Array.isArray(t.days)?t.days:[];
  if(!D.length)E.push("trip has no days");
  if(D.length&&Math.abs(D[0].from)>0.01)E.push("day 1 should start at km 0 (starts at "+D[0].from+")");
  if(D.length&&Math.abs(D[D.length-1].to-end)>0.06)E.push("last day ends at km "+D[D.length-1].to+" but the route ends at "+end);
  D.forEach((d,i)=>{const n="day "+(i+1);
   if(!d.title)E.push(n+" has no title");if(!d.desc)W.push(n+" has no description");
   if(!(d.to>d.from))E.push(n+": \"to\" must be bigger than \"from\"");
   if(i&&Math.abs(d.from-D[i-1].to)>0.01)E.push(n+" starts at km "+d.from+" but the day before ends at km "+D[i-1].to);
   const S=Array.isArray(d.stops)?d.stops:[];
   if(!S.some(s=>s[3]=="s"))E.push(n+" has no start stop (kind \"s\")");if(!S.some(s=>s[3]=="e"))E.push(n+" has no end stop (kind \"e\")");
   S.forEach((s,j)=>{const m=n+" stop "+(j+1)+" ("+s[1]+")";
    if(typeof s[0]!="number"||s[0]<d.from-0.05||s[0]>d.to+0.05)E.push(m+": km "+s[0]+" is outside the day ("+d.from+" to "+d.to+")");
    if(!s[1])E.push(m+": no name");if(!KINDS.includes(s[3]))E.push(m+": kind must be s, e, c or p");
    if((s[4]==null)!=(s[5]==null))E.push(m+": needs both a latitude and a longitude, or neither");
    if(/TODO/i.test(JSON.stringify(s)))W.push(m+" still has TODO text")});
   if(/TODO/i.test(d.title+" "+d.desc))W.push(n+" still has TODO text");
   const ks=S.map(s=>s[0]);for(let j=1;j<ks.length;j++)if(ks[j]<ks[j-1]-0.05){W.push(n+": stops are not in km order");break}});
  if(Array.isArray(t.elevation)){if(t.elevation.length!==R.length)E.push("\"elevation\" has "+t.elevation.length+" values but the route has "+R.length+" points");if(!t.elevation.every(v=>typeof v=="number"&&v>-100&&v<6000))E.push("\"elevation\" has values that are not sensible metres")}
  else if(t.activity!="paddle")W.push("no baked \"elevation\": the first phone to open the trip must be online to fetch it");
  if(t.activity!="paddle"&&(!Array.isArray(t.water)||!t.water.length))W.push("no baked water spots (\"water\" is empty): the app will try to fetch them online");
  (t.water||[]).forEach((w,i)=>{if(!(typeof w.lat=="number"&&typeof w.lng=="number"&&typeof w.km=="number"&&w.n))E.push("water spot "+(i+1)+" needs n, lat, lng, km")});
  (t.sidetrips||[]).forEach((s,i)=>{if(!(s.day>=1&&s.day<=D.length&&Array.isArray(s.points)&&s.points.length>1&&s.name))E.push("side trip "+(i+1)+" needs name, day (1 to "+D.length+") and points")});
  if(t.notes!==undefined&&!(Array.isArray(t.notes)&&t.notes.every(x=>typeof x=="string")))E.push("\"notes\" must be a list of text lines");
  if(t.tides!==undefined){const T=t.tides;["station","code","id"].forEach(k=>{if(!T||!T[k])E.push("tides needs \""+k+"\"")})}
  if(t.tides&&/TODO/.test(JSON.stringify(t.tides)))W.push("tides station still has TODO text");
  if(t.activity=="paddle"&&!t.tides)W.push("paddle trip has no \"tides\" station");
  if(t.legend!==undefined&&!Array.isArray(t.legend))E.push("\"legend\" must be a list");
  if(t.dayColors!==undefined&&!(Array.isArray(t.dayColors)&&t.dayColors.every(c=>/^#[0-9a-f]{3,8}$/i.test(c))))E.push("\"dayColors\" must be a list of #colours");
  if(JSON.stringify(t).length>400000)W.push("trip file is over 400 KB");
 }
 console.log("\n"+id+": "+(E.length?E.length+" error(s)":"OK")+(W.length?", "+W.length+" warning(s)":""));
 E.forEach(x=>console.log("  ERROR   "+x));W.forEach(x=>console.log("  WARNING "+x));
 totalErr+=E.length;totalWarn+=W.length}
console.log("\n"+(totalErr?"FAILED: "+totalErr+" error(s)":"PASSED")+(totalWarn?" ("+totalWarn+" warning(s))":""));
process.exit(totalErr?1:0);
