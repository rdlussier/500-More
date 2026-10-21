#!/usr/bin/env node
// Turns a GPX route (from Gaia, Komoot, AllTrails, Garmin...) into a starting trip file.
// Usage:
//   node tools/gpx-to-trip.js route.gpx --id my-trip --name "My Trip" --activity hike --region "Cascades" --days 4
// Options:
//   --id         folder name, letters/numbers/dashes (required)
//   --name       full trip name (required)      --short   short name for messages (default: name)
//   --activity   hike | bike | paddle (required) --region  place name (required)
//   --days N     split into N days of similar length (default 1)
//   --day-ends 12,30,45   or choose where each day ends, in km (the last day ends at the route end)
//   --timezone   default America/Vancouver       --declination  default 15 (degrees east)
//   --tolerance  line simplification in metres, default 6 (bigger = fewer points)
//   --use-gpx-elevation   bake elevation from the GPX file (only if every point has it)
//   --add-to-index        also add the trip to trips/index.json
//   --force      overwrite an existing trip file
// Day names, descriptions and stops are written as "TODO" for you (or Claude) to fill in.
// GPX waypoints within 300 m of the route become points of interest on the right day.
const fs=require("fs"),path=require("path");
const argv=process.argv.slice(2),file=argv[0],opt={};
for(let i=1;i<argv.length;i++){if(argv[i].startsWith("--")){const k=argv[i].slice(2),v=argv[i+1]&&!argv[i+1].startsWith("--")?argv[++i]:true;opt[k]=v}}
const die=m=>{console.error("ERROR "+m);process.exit(1)};
if(!file||file.startsWith("--"))die("give the GPX file first, e.g. node tools/gpx-to-trip.js route.gpx --id my-trip --name \"My Trip\" --activity hike --region \"Cascades\"");
for(const k of["id","name","activity","region"])if(!opt[k]||opt[k]===true)die("missing --"+k);
if(!/^[a-z0-9_-]+$/.test(opt.id))die("--id can only use a-z, 0-9, - and _");
if(!["hike","bike","paddle"].includes(opt.activity))die("--activity must be hike, bike or paddle");
let xml;try{xml=fs.readFileSync(file,"utf8")}catch(e){die("cannot read "+file)}
const attr=(s,n)=>{const m=s.match(new RegExp("\\b"+n+'\\s*=\\s*"([^"]*)"'));return m?+m[1]:NaN};
const dec=s=>s.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").trim();
// track points (all tracks, or the route points if there is no track)
let pts=[];const trkBlock=xml.match(/<trk[\s>][\s\S]*?<\/trk>/g)||[];
const grab=(re,src)=>{let m,o=[];while((m=re.exec(src)))o.push(m);return o};
for(const b of trkBlock)for(const m of grab(/<trkpt\b([^>]*?)(\/>|>([\s\S]*?)<\/trkpt>)/g,b)){const e=m[3]&&m[3].match(/<ele>([^<]*)<\/ele>/);pts.push([attr(m[1],"lat"),attr(m[1],"lon"),e?+e[1]:NaN])}
if(!pts.length)for(const m of grab(/<rtept\b([^>]*?)(\/>|>([\s\S]*?)<\/rtept>)/g,xml)){const e=m[3]&&m[3].match(/<ele>([^<]*)<\/ele>/);pts.push([attr(m[1],"lat"),attr(m[1],"lon"),e?+e[1]:NaN])}
pts=pts.filter(p=>Math.abs(p[0])<=90&&Math.abs(p[1])<=180);
if(pts.length<2)die("no route found in the GPX file (needs a track or a route)");
const wpts=grab(/<wpt\b([^>]*?)(\/>|>([\s\S]*?)<\/wpt>)/g,xml).map(m=>{const n=m[3]&&m[3].match(/<name>([\s\S]*?)<\/name>/),d=m[3]&&m[3].match(/<(?:desc|cmt)>([\s\S]*?)<\/(?:desc|cmt)>/);return{lat:attr(m[1],"lat"),lng:attr(m[1],"lon"),name:n?dec(n[1]):"",desc:d?dec(d[1]):""}}).filter(w=>Math.abs(w.lat)<=90);
const hav=(a,b)=>{const r=Math.PI/180,dy=(b[0]-a[0])*r,dx=(b[1]-a[1])*r,h=Math.sin(dy/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dx/2)**2;return 12742*Math.asin(Math.sqrt(h))};
// drop repeated points, cumulative km along the original line
let clean=[pts[0]];for(let i=1;i<pts.length;i++)if(hav(clean[clean.length-1],pts[i])>0.002)clean.push(pts[i]);
const cum=[0];for(let i=1;i<clean.length;i++)cum.push(cum[i-1]+hav(clean[i-1],clean[i]));
const total=cum[cum.length-1];if(total<0.2)die("route is only "+total.toFixed(2)+" km long");
// simplify (Douglas-Peucker, tolerance in metres)
function simplify(tolM){const keep=new Uint8Array(clean.length);keep[0]=keep[clean.length-1]=1;const c0=Math.cos(clean[0][0]*Math.PI/180),X=p=>p[1]*111320*c0,Y=p=>p[0]*111320;
 const st=[[0,clean.length-1]];while(st.length){const[a,b]=st.pop();let md=0,mi=-1;const ax=X(clean[a]),ay=Y(clean[a]),bx=X(clean[b]),by=Y(clean[b]),dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;
  for(let i=a+1;i<b;i++){const px=X(clean[i])-ax,py=Y(clean[i])-ay,t=l?Math.max(0,Math.min(1,(px*dx+py*dy)/l)):0,d=Math.hypot(px-t*dx,py-t*dy);if(d>md){md=d;mi=i}}
  if(md>tolM&&mi>0){keep[mi]=1;st.push([a,mi],[mi,b])}}
 return clean.map((_,i)=>i).filter(i=>keep[i])}
let tol=+opt.tolerance||6,ix=simplify(tol);while(ix.length>3500&&tol<200){tol*=1.5;ix=simplify(tol)}
const R=ix.map(i=>[+clean[i][0].toFixed(5),+clean[i][1].toFixed(5),+cum[i].toFixed(2)]);
const end=R[R.length-1][2];
const eleOk=clean.every(p=>!isNaN(p[2]));
// day boundaries
let ends=[];if(typeof opt["day-ends"]=="string"){ends=opt["day-ends"].split(",").map(Number);if(ends.some(x=>isNaN(x)||x<=0||x>=end)||ends.some((x,i)=>i&&x<=ends[i-1]))die("--day-ends must be increasing km values inside the route (0 to "+end+")")}
else{const n=Math.max(1,Math.round(+opt.days||1));for(let i=1;i<n;i++)ends.push(+(end*i/n).toFixed(1))}
const bounds=[0,...ends,end];const nDays=bounds.length-1;
const kmAt=(lat,lng)=>{let best=null;for(let i=0;i<R.length-1;i++){const c=Math.cos(lat*Math.PI/180),ax=(R[i][1]-lng)*c,ay=R[i][0]-lat,dx=(R[i+1][1]-R[i][1])*c,dy=R[i+1][0]-R[i][0],l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/l)):0,d=Math.hypot(ax+t*dx,ay+t*dy)*111.32;if(!best||d<best.d)best={d,km:R[i][2]+t*(R[i+1][2]-R[i][2])}}return best};
const days=[];for(let i=0;i<nDays;i++){const a=bounds[i],b=bounds[i+1];days.push({title:"TODO day "+(i+1)+" title",desc:"TODO describe the day",from:+a.toFixed(2),to:+b.toFixed(2),stops:[[+a.toFixed(2),i?"TODO day "+i+" camp":"TODO start name",i?"Start of the day.":"TODO start","s"],[+b.toFixed(2),i==nDays-1?"TODO finish name":"TODO day "+(i+1)+" camp",i==nDays-1?"Finish.":"TODO camp description","e"]]})}
let used=0;wpts.forEach(w=>{const k=kmAt(w.lat,w.lng);if(!k||k.d>0.3)return;const di=days.findIndex((d,i)=>k.km>=d.from&&(k.km<d.to||i==days.length-1));if(di<0)return;const d=days[di];d.stops.splice(d.stops.length-1,0,[+k.km.toFixed(2),w.name||"TODO waypoint",w.desc||"","p"]);used++});
days.forEach(d=>d.stops.sort((a,b)=>a[0]-b[0]||(a[3]=="s"?-1:b[3]=="s"?1:a[3]=="e"?1:-1)));
const first=R[0];
const trip={format:1,id:opt.id,name:opt.name,short:typeof opt.short=="string"?opt.short:opt.name,region:opt.region,activity:opt.activity,timezone:typeof opt.timezone=="string"?opt.timezone:"America/Vancouver",declination:opt.declination!==undefined?+opt.declination:15,weather:{lat:first[0],lon:first[1]},
 offline:opt.activity=="hike"?{mode:"box",padding:.15,zoomMin:11,zoomMax:15}:{mode:"corridor",bufferKm:opt.activity=="paddle"?3:1.5,zoomMin:11,zoomMax:15},route:R};
if(opt["use-gpx-elevation"]){if(!eleOk)console.log("WARNING the GPX has no elevation on every point, so elevation was not baked in");else if(opt.activity!="paddle")trip.elevation=ix.map(i=>Math.round(clean[i][2]*10)/10)}
trip.days=days;trip.sidetrips=[];trip.water=[];
if(opt.activity=="paddle")trip.tides={station:"TODO station name",code:"TODO",id:"TODO",source:"Canadian Hydrographic Service predictions",datum:"chart datum"};
const out=path.join(__dirname,"..","trips",opt.id,"trip.json");
if(fs.existsSync(out)&&!opt.force)die(out+" already exists (use --force to overwrite)");
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(trip));
if(opt["add-to-index"]){const ip=path.join(__dirname,"..","trips","index.json"),ij=JSON.parse(fs.readFileSync(ip,"utf8"));if(ij.trips.some(t=>t.id==opt.id))console.log("NOTE "+opt.id+" is already in trips/index.json, left as is");else{ij.trips.push({id:opt.id,name:opt.name,region:opt.region,activity:opt.activity,days:nDays,km:+end.toFixed(1),prep:{packing:"soon",logistics:"soon"}});fs.writeFileSync(ip,"{\n\"trips\":[\n"+ij.trips.map(t=>JSON.stringify(t)).join(",\n")+"\n]\n}\n");console.log("Added to trips/index.json (prep buttons set to \"soon\")")}}
console.log("Wrote "+path.relative(process.cwd(),out));
console.log("  "+clean.length+" GPX points -> "+R.length+" route points (tolerance "+Math.round(tol)+" m), "+end.toFixed(1)+" km, "+nDays+" day(s)"+(used?", "+used+" waypoint(s) placed as stops":""));
console.log("  Next: replace every TODO (day titles, descriptions, stop names), set the tides station if paddling, then run: node tools/check-trips.js "+opt.id);
