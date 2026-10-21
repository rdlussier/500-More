const LS=(()=>{try{const s=window.localStorage;s.getItem("_t");return s}catch(_){const m={};return new Proxy(m,{get:(t,k)=>k=="removeItem"?(x=>{delete t[x]}):t[k],set:(t,k,v)=>(t[k]=String(v),true)})}})();
const TRIP=window.TRIP,P=TRIP.route.map(r=>[r[0],r[1],0,r[2]]),D=TRIP.days.map(d=>({t:d.title,d:d.desc,a:d.from,b:d.to,st:d.stops,km:+(d.to-d.from).toFixed(1),up:0,dn:0})),S=TRIP.sidetrips.map(s=>({n:s.name,c:s.day-1,p:s.points}));
const VER=19,K=n=>TRIP.id+":"+n;const BIKE=TRIP.activity=="bike",PADDLE=TRIP.activity=="paddle",TIDE=TRIP.tides&&TRIP.tides.id?TRIP.tides:null;let EL=false,ELS="loading",ELE="";const $=s=>document.querySelector(s),f=n=>Math.round(n).toLocaleString("en");
const IC={start:'<path d="M8 5v14l11-7z"/>',flag:'<path d="M5 3h2v18H5zM8 4h10l-2.5 4 2.5 4H8z"/>',tent:'<path d="M12 3L2 20h20L12 3zm0 7l5 8h-3.3L12 15.2 10.3 18H7l5-8z"/>',star:'<path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6z"/>',info:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 5h2v2h-2zm0 4h2v6h-2z"/>',drop:'<path d="M12 2.5c3.2 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.8-6.8 6-11z"/>',mtn:'<path d="M2 20l7-12 4 6.5 2.5-3.5L22 20z"/>',locate:'<path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 1h2v4h-2zM11 19h2v4h-2zM1 11h4v2H1zM19 11h4v2h-4z"/><circle cx="12" cy="12" r="2"/>',route:'<path d="M3 18c3-9 6 4 9-4s6-3 9-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',up:'<path d="M12 4l7 8h-4.5v8h-5v-8H5z"/>',down:'<path d="M12 20l-7-8h4.5V4h5v8H19z"/>',clock:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1 3h2v5.4l3.5 2-1 1.7L11 13z"/>',dist:'<path d="M3 12l4-4v3h10V8l4 4-4 4v-3H7v3z"/>',layers:'<path d="M12 2L2 7l10 5 10-5-10-5zm0 12.5L4.5 10.8 2 12l10 5 10-5-2.5-1.2L12 14.5zm0 4L4.5 14.8 2 16l10 5 10-5-2.5-1.2L12 18.5z"/>',sun:'<circle cx="12" cy="12" r="4.5"/><path d="M11 1h2v3h-2zM11 20h2v3h-2zM1 11h3v2H1zM20 11h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zM16.3 17.7l1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zM16.3 6.3l2.1-2.1 1.4 1.4-2.1 2.1z"/>'};
const ic=(n,s=16)=>`<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" fill-rule="evenodd" aria-hidden="true">${IC[n]}</svg>`,IK={s:"start",e:"flag",c:"tent",p:"star"};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])),hc=h=>{if(isNaN(h))return"–";const m=Math.round(h*60);return Math.floor(m/60)+"h"+String(m%60).padStart(2,"0")};
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform=="MacIntel"&&navigator.maxTouchPoints>1),STANDALONE=!!(navigator.standalone||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches));let DP=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();DP=e});
const RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const near=k=>P.reduce((a,b)=>Math.abs(b[3]-k)<Math.abs(a[3]-k)?b:a);
const seg=(a,b)=>P.filter(p=>p[3]>=a&&p[3]<=b).map(p=>[p[0],p[1]]);
const map=L.map("map",{zoomControl:false});
map.setView([P[0][0],P[0][1]],12);
const topo=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:19,maxNativeZoom:navigator.onLine===false?15:17,subdomains:"abc",attribution:"© OpenTopoMap, © OSM"}),sat=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,maxNativeZoom:17,attribution:"Tiles © Esri, Maxar, Earthstar Geographics"});
let base=LS.base=="sat"?sat:topo;base.addTo(map);const tint=()=>$("#map").classList.toggle("tinted",!!TH.tint&&base===topo);tint();
function netZoom(){topo.options.maxNativeZoom=navigator.onLine===false?15:17;if(map.hasLayer(topo))topo.redraw()}addEventListener("online",netZoom);addEventListener("offline",netZoom);
function setBase(k){map.removeLayer(base);base=k=="sat"?sat:topo;base.addTo(map);tint();base.bringToBack();try{LS.base=k}catch(_){}document.querySelectorAll("#laymenu .opt").forEach(b=>b.setAttribute("aria-checked",b.dataset.b==k));$("#laymenu").style.display="none"}
$("#lay").innerHTML=ic("layers",22);$("#lay").onclick=e=>{e.stopPropagation();const m=$("#laymenu");m.style.display=m.style.display=="block"?"none":"block"};map.on("click",()=>{$("#laymenu").style.display="none"});document.querySelectorAll("#laymenu .opt").forEach(b=>{b.setAttribute("aria-checked",b.dataset.b==(base===sat?"sat":"topo"));b.onclick=()=>setBase(b.dataset.b)});
const fly=(b,o)=>RM?map.fitBounds(b,o):map.flyToBounds(b,{...o,duration:.8}),goTo=(a,b)=>RM?map.setView([a,b],15):map.flyTo([a,b],15,{duration:.7});
const rl=L.layerGroup().addTo(map),hll=L.layerGroup().addTo(map);
L.polyline(seg(0,1e9),{color:TH.out,weight:8,opacity:.85}).addTo(rl);
const all=L.polyline(seg(0,1e9),{opacity:0,weight:0,interactive:false}).addTo(map);
const DC=TRIP.dayColors||DAY_COLORS;D.forEach((d,i)=>{d.c=DC[i%DC.length];L.polyline(seg(d.a,i<D.length-1?d.b+.2:d.b),{color:d.c,weight:4,opacity:1}).addTo(rl)});
S.forEach(s=>{L.polyline(s.p,{color:TH.out,weight:6,opacity:.7,dashArray:"4 7",interactive:false}).addTo(rl);L.polyline(s.p,{color:DC[s.c%DC.length],weight:3,opacity:1,dashArray:"4 7"}).bindTooltip(s.n,{sticky:true}).addTo(rl)});
const hl=L.layerGroup().addTo(map),water=L.layerGroup();
map.fitBounds(all.getBounds(),{paddingTopLeft:[20,20],paddingBottomRight:[20,44]});
function pickWater(els){const seen=new Set(),out=[];els.forEach(e=>{const g=e.geometry||(e.lat!=null?[{lat:e.lat,lon:e.lon}]:[]);let best=null;
 g.forEach(q=>{const ll=L.latLng(q.lat,q.lon),r=routeElev(ll);if(!best||r.d<best.d)best={d:r.d,ll,km:r.km}});
 const t=e.tags||{},lake=t.natural=="water"||t.natural=="spring";if(!best||best.d>(lake?(PADDLE?500:350):(PADDLE?300:60)))return;
 const n=t.name||(t.natural=="spring"?"Spring":t.waterway?"Stream":"Water"),k=n+best.ll.lat.toFixed(3)+best.ll.lng.toFixed(3);if(seen.has(k))return;seen.add(k);
 out.push({lat:+best.ll.lat.toFixed(5),lng:+best.ll.lng.toFixed(5),n,d:Math.round(best.d),km:+best.km.toFixed(2)})});return out}
function showWater(list){list.forEach(w=>{L.marker([w.lat,w.lng],{icon:L.divIcon({className:"",html:`<div class="mk w">${ic("drop",9)}</div>`,iconSize:[17,17]})}).bindPopup(esc(w.n)+"<br><small>"+w.d+" m from the "+(PADDLE?"route":"trail")+". Treat all water before drinking.</small>").addTo(water);WP.push({km:w.km,name:w.n,off:w.d});(w.k2||[]).forEach(k=>WP.push({km:k,name:w.n,off:w.d}))});
 WP.sort((a,b)=>a.km-b.km);WP=WP.filter((w,i)=>!i||w.km-WP[i-1].km>.15);if(lastLL)updProg(lastLL);setWst(list.length+" spots loaded");WLIST=list}
const pts=[];let lk=-9;P.forEach(p=>{if(p[3]-lk>=.15){pts.push(p[0]+","+p[1]);lk=p[3]}});pts.push(P[P.length-1][0]+","+P[P.length-1][1]);
const A1="around:"+(PADDLE?500:380)+","+pts.join(","),A2="around:"+(PADDLE?300:90)+","+pts.join(","),LW=PADDLE?'["water"!~"^(bay|strait|sea|lagoon|harbour|ocean|cove|fjord|channel|reef)$"]':"";
const q=`[out:json][timeout:60];(node["natural"="spring"](${A1});way["natural"="water"]${LW}(${A1});way["waterway"~"^(stream|river)$"](${A2}););out geom tags;`;
const EP=["https://overpass-api.de/api/interpreter","https://overpass.kumi.systems/api/interpreter","https://overpass.private.coffee/api/interpreter"];
async function getWater(q){let err;for(const u of EP){try{const r=await fetch(u,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)});if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();if(j.remark&&!(j.elements||[]).length)throw new Error("water service busy");return j}catch(e){err=e}}throw err}
let wl=null;try{wl=JSON.parse(LS[K("waterOSM6")]||"null")}catch(_){}
const getList=()=>getWater(q).then(j=>{const l=pickWater(j.elements);try{LS[K("waterOSM6")]=JSON.stringify(l)}catch(_){}return l});
function setWst(t){WST=t;const e=$("#wst");if(e)e.textContent=t}
Promise.resolve(TRIP.water).then(l=>{if(!Array.isArray(l)||!l.length)throw 0;return l}).catch(()=>Array.isArray(wl)?wl:getList()).then(showWater).catch(e=>{const m=e&&e.message||e;setWst("could not load ("+m+")")});
let lOn=true;$("#lns").onclick=()=>{lOn=!lOn;[rl,hll].forEach(g=>lOn?g.addTo(map):g.remove());$("#lns").style.opacity=lOn?1:.45};
let wOn=false;$("#wtr").style.opacity=.45;if(PADDLE)$("#wtr").title="Fresh water spots";$("#wtr").onclick=()=>{wOn=!wOn;wOn?water.addTo(map):water.remove();$("#wtr").style.opacity=wOn?1:.45;if(wOn&&!WLIST.length){const k=PADDLE?"fresh water":"water spots";toast(WST=="loading…"?"Still looking for "+k+". This needs a connection.":WST.indexOf("could")==0?"Water spots "+WST+".":"No "+k+" found near the route in the map data.",5000)}};
// legend for the base map symbols (real OpenTopoMap pictures, kept in legend/)
{const LI=window.LEGEND_ITEMS||{},LK=(TRIP.legend||(window.LEGEND_SETS||{})[TRIP.activity]||[]).filter(k=>LI[k]);
 if(!PADDLE||!LK.length)$("#leg").style.display="none";else{$("#leg").innerHTML=ic("info",22);
  $("#legmenu").innerHTML="<b>Map symbols</b>"+LK.map(k=>{const o=LI[k],w=o.w?Math.min(30,o.w*2):18;return`<div class="lg"><span><img src="legend/${o.f}" alt="" style="width:${w}px;image-rendering:pixelated"></span>${esc(o.l)}</div>`}).join("")+'<small>Shown on the map when zoomed in. Symbols from OpenTopoMap (CC-BY-SA).</small>';
  $("#leg").onclick=e=>{e.stopPropagation();const m=$("#legmenu");m.style.display=m.style.display=="block"?"none":"block"};map.on("click",()=>{$("#legmenu").style.display="none"})}}
$("#loc").innerHTML=ic("locate",22);$("#wtr").innerHTML=ic("drop",20);$("#wtr").style.color=TH.mk.w;$("#lns").innerHTML=ic("route",22);$("#elv").innerHTML=ic("mtn",14)+"–";if(PADDLE)$("#elv").style.display="none";
function toast(t,ms){const e=$("#toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",ms||4000)}
// compass (true north) and elevation
const DECL=TRIP.declination||0;// magnetic declination in degrees east, set per trip
const CARD=["N","NE","E","SE","S","SW","W","NW"];
function setHd(h){const t=(h+DECL+360)%360;$("#dial").style.transform=`rotate(${-t}deg)`;$("#hd").textContent=Math.round(t)+"° "+CARD[Math.round(t/45)%8]}
function onOri(e){let h;if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading;else if(e.alpha!=null&&(e.absolute||e.type=="deviceorientationabsolute")){const r=Math.PI/180,a=e.alpha*r,b=e.beta*r,g=e.gamma*r,rA=-Math.cos(a)*Math.sin(g)-Math.sin(a)*Math.sin(b)*Math.cos(g),rB=-Math.sin(a)*Math.sin(g)+Math.cos(a)*Math.sin(b)*Math.cos(g);h=(Math.atan2(rA,rB)/r+360)%360;if(Math.abs(e.beta||0)<50&&Math.abs(e.gamma||0)<50)h=(360-e.alpha+360)%360}else return;setHd(h)}
let cmpOn=false;async function startCmp(){if(cmpOn)return;try{if(typeof DeviceOrientationEvent!="undefined"&&DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!="granted"){toast("Compass permission denied.");return}
 addEventListener("deviceorientationabsolute",onOri,true);addEventListener("deviceorientation",onOri,true);cmpOn=true;setTimeout(()=>{if($("#hd").textContent=="–°")toast("No compass sensor found. It works on a phone.")},3000)}catch(_){toast("Compass unavailable on this device.")}}
$("#cmp").onclick=startCmp;if(typeof DeviceOrientationEvent!="undefined"&&DeviceOrientationEvent.requestPermission)setTimeout(()=>toast("Tap the compass to turn it on."),1500);else startCmp();
function routeElev(ll,hint){const c=Math.cos(ll.lat*Math.PI/180),cand=[];let best=null;for(let i=0;i<P.length-1;i++){const A=P[i],B=P[i+1],ax=(A[1]-ll.lng)*c,ay=A[0]-ll.lat,dx=(B[1]-A[1])*c,dy=B[0]-A[0],l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/l)):0,d=Math.hypot(ax+t*dx,ay+t*dy)*111320,r={d,e:A[2]+t*(B[2]-A[2]),km:A[3]+t*(B[3]-A[3])};if(d<150)cand.push(r);if(!best||d<best.d)best=r}
 if(hint!=null&&best&&best.d<150){let b2=best;cand.forEach(r=>{if(r.d<=best.d+15&&Math.abs(r.km-hint)<Math.abs(b2.km-hint))b2=r});return b2}return best}
function updElev(e){const r=routeElev(e.latlng);let t;if(EL&&r.d<50)t=f(r.e)+"m";else if(e.altitude!=null)t="≈"+f(e.altitude)+"m";else t="–";$("#elv").innerHTML=ic("mtn",14)+t}
// location
let me,acc,first=true;
function onFix(e){const ll=e.latlng;updElev(e);updProg(e.latlng);me?(me.setLatLng(ll),acc.setLatLng(ll).setRadius(e.accuracy)):(acc=L.circle(ll,{radius:e.accuracy,weight:1,color:"#2b7fff",fillOpacity:.12}).addTo(map),me=L.circleMarker(ll,{radius:8,color:"#fff",weight:3,fillColor:"#2b7fff",fillOpacity:1}).addTo(map));
 if(first){first=false;if(map.distance(ll,all.getBounds().getCenter())<60000)map.setView(ll,15);else toast("You're far from the route, so the map stays on the trail.")}}
map.on("locationfound",e=>{if(!TEST)onFix(e)});map.on("locationerror",()=>{if(first){first=false;toast("Location unavailable. Showing the route.")}});
map.locate({watch:true,enableHighAccuracy:true});
$("#loc").onclick=()=>me?map.setView(me.getLatLng(),Math.max(map.getZoom(),15)):map.locate({watch:true,enableHighAccuracy:true});
// sheet
const tabs=["All",...D.map((_,i)=>"Day "+(i+1))];
$("#tabs").innerHTML=tabs.map((n,i)=>`<button role="tab" onclick="show(${i},1)">${n}</button>`).join("");
const PW=320,PH=140,PL=38,PR=10,PT=10,PB=22;
function prof(d){if(PADDLE)return"";if(!EL)return"<p><small>The elevation profile loads once the app has been online.</small></p>";
 const q=P.filter(p=>p[3]>=d.a&&p[3]<=d.b),lo=Math.floor((Math.min(...q.map(p=>p[2]))-15)/50)*50,hi=Math.ceil((Math.max(...q.map(p=>p[2]))+15)/50)*50,x=k=>PL+(k-d.a)/(d.b-d.a)*(PW-PL-PR),y=e=>PH-PB-(e-lo)/(hi-lo)*(PH-PB-PT),pts=q.map(p=>x(p[3]).toFixed(1)+","+y(p[2]).toFixed(1)).join(" ");
 const grid=[0,1,2].map(g=>{const e=lo+(hi-lo)*g/2;return`<line x1="${PL}" x2="${PW-PR}" y1="${y(e)}" y2="${y(e)}" stroke="var(--line)"/><text x="${PL-4}" y="${y(e)+3}" text-anchor="end" font-size="8" fill="var(--mut)">${f(e)} m</text>`}).join("");
 const xt=[0,.5,1].map(t=>{const k=d.a+(d.b-d.a)*t;return`<text x="${x(k)}" y="${PH-7}" text-anchor="${t?t==1?"end":"middle":"start"}" font-size="8" fill="var(--mut)">${k.toFixed(1)} km</text>`}).join("");
 const dots=d.st.map((s,j)=>{const k=kd(d,j);if(s[4]!=null&&k!="s"&&k!="e")return"";return`<circle cx="${x(s[0])}" cy="${y(near(s[0])[2])}" r="4.5" fill="${{s:TH.mk.s,e:TH.mk.s,c:TH.mk.c,p:TH.mk.p}[k]}" stroke="#fff" stroke-width="1.5"/>`}).join("");
 return`<svg class="pr" viewBox="0 0 ${PW} ${PH}" data-lo="${lo}" data-hi="${hi}">${grid}<path d="M${x(d.a)},${y(lo)} L${pts.replace(/ /g," L")} L${x(d.b)},${y(lo)}Z" fill="${d.c}" fill-opacity=".3"/><polyline points="${pts}" fill="none" stroke="${TH.out}" stroke-width="4" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${d.c}" stroke-width="2" stroke-linejoin="round"/>${xt}${dots}<line id="pl" y1="${PT}" y2="${PH-PB}" stroke="var(--fg)" stroke-dasharray="3 2" style="display:none"/><circle id="pc" r="5" fill="${d.c}" stroke="#fff" stroke-width="2" style="display:none"/></svg><p id="pro" class="pro"><small>Touch or drag along the graph to follow the route on the map.</small></p>`}
function wireProf(d){const sv=$("#body svg.pr");if(!sv)return;const q=P.filter(p=>p[3]>=d.a&&p[3]<=d.b),lo=+sv.dataset.lo,hi=+sv.dataset.hi,pl=sv.querySelector("#pl"),pc=sv.querySelector("#pc"),ro=$("#pro");let mk=null;
 const x=k=>PL+(k-d.a)/(d.b-d.a)*(PW-PL-PR),y=e=>PH-PB-(e-lo)/(hi-lo)*(PH-PB-PT);
 const mv=e=>{const r=sv.getBoundingClientRect();if(!r.width)return;const vx=(e.clientX-r.left)/r.width*PW,k=Math.max(d.a,Math.min(d.b,d.a+(vx-PL)/(PW-PL-PR)*(d.b-d.a))),p=q.reduce((a,b)=>Math.abs(b[3]-k)<Math.abs(a[3]-k)?b:a),ll=L.latLng(p[0],p[1]);
  pl.setAttribute("x1",x(p[3]));pl.setAttribute("x2",x(p[3]));pc.setAttribute("cx",x(p[3]));pc.setAttribute("cy",y(p[2]));pl.style.display=pc.style.display="";
  ro.innerHTML=`<b>${(p[3]-d.a).toFixed(1)} km</b> into the day · ${f(p[2])} m · ${(d.b-p[3]).toFixed(1)} km to go`;
  mk?mk.setLatLng(ll):mk=L.circleMarker(ll,{radius:9,color:"#fff",weight:3,fillColor:d.c,fillOpacity:1}).addTo(hl);
  if(!map.getBounds().contains(ll))map.panTo(ll)};
 sv.addEventListener("pointerdown",e=>{try{sv.setPointerCapture(e.pointerId)}catch(_){}mv(e)});sv.addEventListener("pointermove",mv)}
// draggable panel
let sh=+LS.sheetH||45,dragging=false,moved=false,raf=0;
function setSh(v,anim){sh=v;document.documentElement.style.setProperty("--sh",v+"%");if(!anim&&!raf)raf=requestAnimationFrame(()=>{raf=0;map.invalidateSize()})}
{const gb=$("#grab");gb.addEventListener("pointerdown",e=>{dragging=true;moved=false;try{gb.setPointerCapture(e.pointerId)}catch(_){}});
 gb.addEventListener("pointermove",e=>{if(!dragging)return;moved=true;setSh(Math.max(14,Math.min(90,(innerHeight-e.clientY)/innerHeight*100)),false)});
 const up=()=>{if(!dragging)return;dragging=false;map.invalidateSize();try{LS.sheetH=Math.round(sh*10)/10}catch(_){}};gb.addEventListener("pointerup",up);gb.addEventListener("pointercancel",up);setSh(sh>=14&&sh<=90?sh:45,false)}
const kd=(d,j)=>d.st[j][3],sp=q=>q[4]!=null?[q[4],q[5]]:near(q[0]);
const today=()=>{const t=new Date();return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")},sdv=()=>LS[K("sd")]||today();
const MUL={r:1.4,n:1,f:.8};let cur=0,RENDERED=false,WP=[],lastLL=null,curKm=null,WST="loading…",WLIST=[];
const GH=BIKE?2:4,GW=BIKE?1:3;const gainRaw=(a,b)=>{let up=0,ref=null;P.forEach(p=>{if(p[3]<a||p[3]>b)return;if(ref==null)ref=p[2];const df=p[2]-ref;if(df>=GH){up+=df;ref=p[2]}else if(df<=-GH)ref=p[2]});return up};
const U=x=>EL?f(x):"–";
D.forEach(d=>d.sc=1);
const gain=(a,b,d)=>gainRaw(a,b)*d.sc,hrs=(a,b,d)=>EL?((b-a)/(BIKE?18:PADDLE?4:5)+gain(a,b,d)/600)*MUL[LS.pace||"r"]:NaN;
const hm=h=>{if(isNaN(h))return"–";const m=Math.round(h*60/5)*5;return Math.floor(m/60)+" h "+String(m%60).padStart(2,"0")+" m"};
function sun(ms,lat,lon){const r=Math.PI/180,jd=ms/864e5+2440587.5,n=Math.ceil(jd-2451545+8e-4),Js=n-lon/360,M=(357.5291+.98560028*Js)%360,C=1.9148*Math.sin(M*r)+.02*Math.sin(2*M*r)+3e-4*Math.sin(3*M*r),lam=(M+C+180+102.9372)%360,Jt=2451545+Js+.0053*Math.sin(M*r)-.0069*Math.sin(2*lam*r),dl=Math.asin(Math.sin(lam*r)*Math.sin(23.4397*r)),w=Math.acos((Math.sin(-.833*r)-Math.sin(lat*r)*Math.sin(dl))/(Math.cos(lat*r)*Math.cos(dl)))/r/360;return[(Jt-w-2440587.5)*864e5,(Jt+w-2440587.5)*864e5]}
function sunLine(i){const sd=sdv();const[a,b]=sun(Date.parse(sd)+(i-1)*864e5,P[0][0],P[0][1]),t=x=>new Date(x).toLocaleTimeString("en-US",{timeZone:TRIP.timezone,hour:"numeric",minute:"2-digit"});return`<p class="sun"><small>${ic("sun",14)} Sunrise ${t(a)} · Sunset ${t(b)} · ${hc((b-a)/36e5)} daylight</small></p>`}
function paintBars(){document.querySelectorAll(".pb").forEach(b=>{const a=+b.dataset.a,e=+b.dataset.b,fr=curKm==null?0:curKm>=e?1:curKm<=a?0:(curKm-a)/(e-a);b.firstChild.style.width=(fr*100).toFixed(1)+"%";const t=b.nextElementSibling;if(t&&t.classList.contains("pt"))t.textContent=curKm==null?"Not on the trail yet":fr>=1?"Done":fr<=0?"Not started":(curKm-a).toFixed(1)+" of "+(e-a).toFixed(1)+" km"})}
const net=(r,d)=>{if(PADDLE)return"";if(!EL)return"↑–";const n=Math.round(near(d.b)[2]-r.e);return(n<0?"↓":"↑")+f(Math.abs(n))+"m"};
function updProg(ll){lastLL=ll;const r=routeElev(ll,curKm),el=$("#prg");curKm=r.d>100?null:r.km;paintBars();el.style.display="block";
 if(r.d>100){el.innerHTML="<b>Off trail</b> "+(r.d<1000?Math.round(r.d)+"m":Math.round(r.d/1000)+"km");return}
 const d=D.find(x=>r.km>=x.a&&r.km<=x.b)||D[D.length-1],w=WP.find(x=>x.km>r.km+.05);
 el.innerHTML=`<b>Day ${D.indexOf(d)+1}</b><br>${(r.km-d.a).toFixed(1)}km done · ${(d.b-r.km).toFixed(1)}km left<br>${net(r,d)} ≈${hc(hrs(r.km,d.b,d))}`+(WP.length?`<br><span style="color:${TH.mk.w}">${ic("drop",11)}</span>${w?`${esc(w.name)} ${(w.km-r.km).toFixed(1)}km`+(w.off>30?` (+${f(w.off)}m)`:""):"none ahead"}`:"")}
let TEST=false;
function setTest(on){TEST=on;$("#tstb").style.display=on?"flex":"none";const t=$("#tst");if(t)t.textContent=(on?"Stop":"Start")+" practice mode";
 if(on){first=false;map.stopLocate();toast("Practice mode on. Tap the map to place yourself.",5000)}
 else{if(me){map.removeLayer(me);map.removeLayer(acc);me=acc=null}lastLL=null;curKm=null;$("#prg").style.display="none";$("#elv").innerHTML=ic("mtn",14)+"–";paintBars();first=true;map.locate({watch:true,enableHighAccuracy:true});toast("Practice mode off. Using your real location.")}}
map.on("click",e=>{if(TEST)onFix({latlng:e.latlng,accuracy:15,altitude:null})});$("#tstx").onclick=()=>setTest(false);
const card=(d,j,clk)=>`<div class="dcard${clk?" clk":""}" ${clk?`onclick="show(${j+1})"`:""} style="--c:${d.c}"><div class="dh"><span class="dpill">Day ${j+1}</span><b>${d.t}</b></div><div class="dsub">${(d.st.find(q=>q[3]=="s")||d.st[0])[1]} → ${(d.st.find(q=>q[3]=="e")||d.st[d.st.length-1])[1]}</div><div class="dr"><span>${ic("dist",14)} ${d.km} km</span>${PADDLE?"":`<span>${ic("up",14)} +${U(d.up)} m</span><span>${ic("down",14)} −${U(d.dn)} m</span>`}<span>${ic("clock",14)} ${hm(hrs(d.a,d.b,d))}</span></div><div class="pb" data-a="${d.a}" data-b="${d.b}"><i></i></div><small class="pt"></small></div>`;
const notesBox=()=>Array.isArray(TRIP.notes)&&TRIP.notes.length?`<div class="notes"><ul>${TRIP.notes.map((n,i)=>`<li${i?"":` class="first"`}>${esc(n)}</li>`).join("")}</ul></div>`:"";
const sum=k=>D.reduce((a,d)=>a+d[k],0);
function show(i,force){const same=!force&&RENDERED&&i==cur,openD=same?[...document.querySelectorAll("#body details[open]")].map(x=>x.id):[],st=same?$("#body").scrollTop:0;cur=i;RENDERED=true;document.querySelectorAll("#tabs button").forEach((b,j)=>b.setAttribute("aria-selected",j==i));hl.clearLayers();hll.clearLayers();let h;
 if(!i){if(!same)fly(all.getBounds(),{paddingTopLeft:[20,20],paddingBottomRight:[20,44]});
  h=`<p style="margin:0 0 6px"><a href="./" style="color:var(--acc);font-weight:600;text-decoration:none">‹ All trips</a></p><h2>${esc(TRIP.name)}</h2><small>${D.length} days ${BIKE?"bikepacking ":PADDLE?"paddling ":""}in the ${esc(TRIP.region)}</small>${notesBox()}<div class="stats${PADDLE?" three":""}"><div><b>${P[P.length-1][3].toFixed(1)} km</b><span>distance</span></div>${PADDLE?`<div><b>${D.length}</b><span>days</span></div>`:`<div><b>+${U(sum("up"))} m</b><span>gain</span></div><div><b>−${U(sum("dn"))} m</b><span>loss</span></div>`}<div><b>${hm(D.reduce((a,d)=>a+hrs(d.a,d.b,d),0))}</b><span>est. time</span></div></div>`+D.map((d,j)=>card(d,j,true)).join("")}
 else{const d=D[i-1];const line=L.polyline(seg(d.a,d.b),{color:"#ffffff",weight:10,opacity:.9}).addTo(hll);all.bringToFront();
  L.polyline(seg(d.a,d.b),{color:TH.out,weight:8}).addTo(hll);L.polyline(seg(d.a,d.b),{color:d.c,weight:4}).addTo(hll);if(!same)fly(line.getBounds(),{paddingTopLeft:[30,30],paddingBottomRight:[30,52]});
  d.st.forEach((q,j)=>{const p=sp(q);L.marker([p[0],p[1]],{icon:L.divIcon({className:"",html:`<div class="mk ${kd(d,j)}">${ic(IK[kd(d,j)],kd(d,j)=="s"||kd(d,j)=="e"?18:15)}</div>`,iconSize:[28,28]})}).bindPopup(`<b>${q[1]}</b><br>${q[2]}`).addTo(hl)});
  h=card(d,i-1,false)+`<p>${d.d}</p>`+sunLine(i)+prof(d)+`<div class="leg"><span><b style="color:${TH.mk.s}">${ic("start",14)}</b> Start</span><span><b style="color:${TH.mk.s}">${ic("flag",14)}</b> End of day</span><span><b style="color:${TH.mk.c}">${ic("tent",14)}</b> Campsite</span><span><b style="color:${TH.mk.p}">${ic("star",14)}</b> Point of interest</span></div>`+d.st.map((q,j)=>{const p=sp(q);return `<div class="stop ${kd(d,j)}" onclick="goTo(${p[0]},${p[1]})"><i>${ic(IK[kd(d,j)],kd(d,j)=="s"||kd(d,j)=="e"?15:13)}</i><div><b>${q[1]}</b> <small>${q[0].toFixed(1)}km${(q[3]=="s"||q[3]=="e")&&!PADDLE?" · "+U(near(q[0])[2])+"m":""}${q[0]>d.a+.05?" · "+hc(hrs(d.a,q[0],d))+" in":""}</small><p>${q[2]}</p></div></div>`}).join("")}
 h+=(EL?"":`<p><small>Elevation, gain and time ${ELS=="fail"?"could not load"+(ELE?" ("+ELE+")":"")+".":"are loading…"}</small> ${ELS=="fail"?'<button class="btn" style="width:auto;padding:4px 12px" onclick="loadElev()">Retry</button>':""}</p>`)+`${topBox()}<details id="wx"><summary>Trip date and offline map</summary><p><label>Trip start date <input type="date" id="sd"></label></p><p><label>Pace <select id="pc"><option value="r">Relaxed</option><option value="n">Normal</option><option value="f">Fast</option></select></label> <small>${PADDLE?"Rough paddling time for a loaded double sea kayak: 4 km/h, scaled by pace. Waiting for slack tide, breaks and stops are extra.":BIKE?"Rough riding time for a loaded gravel bike: 18 km/h plus 1 h per 600 m climbed, scaled by pace. Stops and breaks are extra.":"Times use Naismith's rule (5 km/h plus 1 h per 600 m climbed), scaled by pace."}</small></p><p><button class="btn" id="dl" style="width:100%">Save map for offline use</button><button class="btn" id="dlx" style="width:100%;margin-top:6px">Remove saved map</button><small id="dls"></small></p><div class="brow"><button class="btn" id="inst" style="display:none">Install app</button><button class="btn" id="shr">Share app</button><button class="btn" id="tst">${TEST?"Stop":"Start"} practice mode</button></div><small class="hint"><b>Install:</b> ${installTip()}</small><small class="hint"><b>Practice mode:</b> tap the map to place yourself on the trail and see the progress box, elevation and day bars. Real GPS is paused until you stop.</small>${EL&&LS[K("elev6")]?`<p><button class="btn" style="width:auto;padding:4px 12px" onclick="saveElev()">Save elevation file</button></p>`:""}<p><small>${PADDLE?"":"Elevation: AWS Terrain Tiles (USGS and NASA SRTM data). "}App version ${VER}</small></p></details>`;
 $("#body").innerHTML=h;openD.forEach(id=>{const e=document.getElementById(id);if(e)e.open=true});$("#body").scrollTop=st;if(!same){const b=$("#body");b.classList.remove("fx");void b.offsetWidth;b.classList.add("fx")}paintBars();wx(i);rain();if(PADDLE)wind();if(TIDE)tideFill();if(i&&EL)wireProf(D[i-1]);$("#dl").onclick=dl;$("#dlx").onclick=dlx;mapNote();$("#shr").onclick=shareApp;$("#tst").onclick=()=>setTest(!TEST);if(DP){const ib=$("#inst");ib.style.display="";ib.onclick=()=>DP.prompt()}const pc=$("#pc");pc.value=LS.pace||"r";pc.onchange=()=>{LS.pace=pc.value;show(cur);$("#wx").open=true;if(lastLL)updProg(lastLL)}}
// tides (pulled online when the trip date is set, then saved on the device)
const addDays=(s,n)=>new Date(Date.parse(s+"T00:00:00Z")+n*864e5).toISOString().slice(0,10);
function tideDraw(el,ev){const tz=TRIP.timezone,sd=sdv(),dfm=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"}),tfm=new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"numeric",minute:"2-digit"}),ld=m=>dfm.format(m*6e4),
 hi=i=>i>0?ev[i][1]>ev[i-1][1]:ev[i][1]>ev[i+1][1],hv=h=>(Math.round(h*10)/10+0).toFixed(1);
 const tf=m=>tfm.format(m*6e4).replace(" AM"," am").replace(" PM"," pm"),dn=d=>new Date(d+"T12:00:00Z").toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric",timeZone:"UTC"});
 const rows=D.map((_,k)=>{const d=addDays(sd,k),t=[];ev.forEach((e,i)=>{if(ld(e[0])==d)t.push(`<span class="${hi(i)?"th":"tl"}"><b>${hi(i)?"High":"Low"}</b> ${hv(e[1])} m, ${tf(e[0])}</span>`)});return`<div class="trw"><b>Day ${k+1}</b> <small>${dn(d)}</small><div class="tg">${t.join("")||"<small>No data</small>"}</div></div>`}).join("");
 el.innerHTML=rows}
async function tideFill(){const el=$("#td");if(!el)return;const sd=sdv(),n=D.length,key=TIDE.id+"|"+sd+"|"+n;let c=null;try{c=JSON.parse(LS[K("tides")]||"null")}catch(_){}
 if(c&&c.k==key&&Array.isArray(c.ev)&&c.ev.length){tideDraw(el,c.ev);return}
 el.innerHTML="<small>Loading tides…</small>";
 try{const r=await fetch(`https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${TIDE.id}/data?time-series-code=wlp-hilo&from=${addDays(sd,-1)}T12:00:00Z&to=${addDays(sd,n+1)}T00:00:00Z`);if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();
  const ev=j.map(x=>[Math.round(Date.parse(x.eventDate)/6e4),x.value]).filter(x=>x[0]==x[0]&&typeof x[1]=="number").sort((a,b)=>a[0]-b[0]);if(ev.length<2)throw new Error("no data");
  try{LS[K("tides")]=JSON.stringify({k:key,t:Date.now(),ev})}catch(_){}
  const e2=$("#td");if(e2&&sdv()==sd)tideDraw(e2,ev)}
 catch(e){const e2=$("#td");if(e2)e2.innerHTML="<small>Tides need an internet connection. Set the trip date while online and they are saved on this device."+(e&&e.message?" ("+esc(e.message)+")":"")+"</small>"}}
// weather (tucked away)
const ldC=ck=>{let c=null;try{c=JSON.parse(LS[K(ck)]||"null")}catch(_){}return c&&String(c.k).split("|")[0]==sdv()?c:null};
function wx(i){const sd=$("#sd");sd.value=sdv();sd.onchange=()=>{LS[K("sd")]=sd.value;show(i);$("#wx").open=true};
 if(!sd.value)return;const s0=new Date(sd.value),n=new Date(),lastDay=new Date(Math.min(s0.getTime()+(D.length-1)*864e5,n.getTime()+15*864e5)).toISOString().slice(0,10),key=sd.value+"|"+lastDay+(PADDLE?"|p":""),show2=(h,t)=>{$("#wo").innerHTML=h+(t?`<small>Saved forecast from ${new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</small>`:"")};
 const c=ldC("wxc");
 if((s0-n)/864e5>15){show2(c?c.h:"<small>Too far ahead for a forecast. Check back within 16 days of the trip.</small>",c&&c.t);return}
 if(c&&c.k==key&&Date.now()-c.t<3*36e5){show2(c.h,c.t);return}
 fetch(`https://api.open-meteo.com/v1/forecast?latitude=${TRIP.weather.lat}&longitude=${TRIP.weather.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max${PADDLE?"":",wind_speed_10m_max"}&timezone=auto&start_date=${sd.value}&end_date=${lastDay}`)
 .then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{const d=j.daily,h=d.time.map((t,k)=>`<p><b>Day ${k+1}</b> <small>${t}</small><br>High ${Math.round(d.temperature_2m_max[k])}°C, low ${Math.round(d.temperature_2m_min[k])}°C, rain ${d.precipitation_probability_max[k]}%${PADDLE?"":", wind "+Math.round(d.wind_speed_10m_max[k])+" km/h"}</p>`).join("");try{LS[K("wxc")]=JSON.stringify({k:key,t:Date.now(),h})}catch(_){}show2(h)})
 .catch(()=>show2(c?c.h:"<small>Weather needs an internet connection.</small>",c&&c.t))}
// paddle dropdowns and hourly wind
const NOWX="Forecasts only exist about 16 days ahead, so set the date closer to the trip.";
function topBox(){const nd=`<small>Set the trip start date in "Trip date and offline map" below. ${NOWX}</small>`;return`<div class="pdd"><details id="wxd"><summary>Weather</summary><div id="wo">${nd}</div></details>${PADDLE?`<details id="wnd"><summary>Wind</summary><div id="wi">${nd}</div></details>`:""}<details id="rnd"><summary>Rain</summary><div id="rn">${nd}</div></details>${TIDE?`<details id="tdd"><summary>Tides - ${esc(TIDE.station)}</summary><div id="td"></div></details>`:""}</div>`}
const wcl=v=>v<15?0:v<25?1:v<35?2:3,hf=h=>h==0?"12 am":h<12?h+" am":h==12?"12 pm":(h-12)+" pm",cp=d=>["N","NE","E","SE","S","SW","W","NW"][Math.round(d/45)%8];
function windDraw(el,days,t){const HR=[];for(let h=6;h<=20;h++)HR.push(h);let mx=null;
 days.forEach((x,k)=>x[1].forEach(r=>{if(!mx||r[3]>mx[0])mx=[r[3],k,r[0]]}));
 let h=mx?`<p class="wmx">Strongest gust: <b>${mx[0]} km/h</b>, day ${mx[1]+1} at ${hf(mx[2])}</p>`:"";
 h+=`<div class="wg wh"><span></span>${HR.map(x=>`<span>${x%3==0?(x%12||12)+(x<12?"a":"p"):""}</span>`).join("")}</div>`;
 days.forEach((x,k)=>{const m=new Map(x[1].map(r=>[r[0],r]));h+=`<div class="wg"><span class="dl">D${k+1}</span>${HR.map(hr=>{const r=m.get(hr);return r?`<button class="wc c${wcl(r[1])}" data-k="${k}" data-h="${hr}"><i style="transform:rotate(${(r[2]+180)%360}deg)">↑</i><b>${r[1]}</b></button>`:"<span></span>"}).join("")}</div>`});
 h+=`<p class="wk"><span>km/h</span><span class="c0">under 15</span><span class="c1">15-25</span><span class="c2">25-35</span><span class="c3">35+</span></p><small id="wdt">Tap an hour for direction and gusts. Arrows point the way the wind blows. Hours shown: 6 am to 8 pm.</small>`;
 if(t)h+=`<small class="hint">Saved forecast from ${new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</small>`;
 el.innerHTML=h;el.querySelectorAll(".wc").forEach(b=>b.onclick=()=>{const r=days[+b.dataset.k][1].find(q=>q[0]==+b.dataset.h);el.querySelectorAll(".wc.sel").forEach(q=>q.classList.remove("sel"));b.classList.add("sel");$("#wdt").innerHTML=`<b>Day ${+b.dataset.k+1}, ${hf(r[0])}:</b> wind ${r[1]} km/h from ${cp(r[2])}, gusts ${r[3]} km/h`})}
// hourly forecast helper: one fetch, saved on the device, drawn into a dropdown
function hourly(ck,vars,row,draw,sel,name){const sd=sdv(),s0=new Date(sd),n=new Date(),last=new Date(Math.min(s0.getTime()+(D.length-1)*864e5,n.getTime()+15*864e5)).toISOString().slice(0,10),key=sd+"|"+last,out=()=>$(sel);if(!out())return;
 const c=ldC(ck);
 if((s0-n)/864e5>15){if(c)draw(out(),c.d,c.t);else out().innerHTML="<small>Too far ahead for a forecast. Check back within 16 days of the trip.</small>";return}
 if(c&&c.k==key&&Date.now()-c.t<3*36e5){draw(out(),c.d,c.t);return}
 out().innerHTML="<small>Loading "+name+"…</small>";
 fetch(`https://api.open-meteo.com/v1/forecast?latitude=${TRIP.weather.lat}&longitude=${TRIP.weather.lon}&hourly=${vars}&timezone=auto&start_date=${sd}&end_date=${last}`)
 .then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{const q=j.hourly,days={};q.time.forEach((t,k)=>{const h=+t.slice(11,13),r=row(q,k);if(h<6||h>20||!r)return;(days[t.slice(0,10)]=days[t.slice(0,10)]||[]).push([h,...r])});
  const d=Object.keys(days).sort().map(k=>[k,days[k]]);if(!d.length)throw 0;try{LS[K(ck)]=JSON.stringify({k:key,t:Date.now(),d})}catch(_){}if(out()&&sdv()==sd)draw(out(),d)})
 .catch(()=>{if(out())c?draw(out(),c.d,c.t):out().innerHTML="<small>"+name+" needs an internet connection.</small>"})}
const wind=()=>hourly("wic","wind_speed_10m,wind_direction_10m,wind_gusts_10m",(q,k)=>q.wind_speed_10m[k]==null?null:[Math.round(q.wind_speed_10m[k]),Math.round(q.wind_direction_10m[k]),Math.round(q.wind_gusts_10m[k])],windDraw,"#wi","Wind");
const rain=()=>hourly("rnc","precipitation_probability,precipitation",(q,k)=>q.precipitation_probability[k]==null?null:[Math.round(q.precipitation_probability[k]),Math.round((q.precipitation[k]||0)*10)/10],rainDraw,"#rn","Rain");
const rcl=p=>p<20?0:p<50?1:p<80?2:3,mmf=v=>v<.05?"0":(Math.round(v*10)/10)+"";
function rainDraw(el,days,t){const HR=[];for(let h=6;h<=20;h++)HR.push(h);let mx=null;
 days.forEach((x,k)=>x[1].forEach(r=>{if(r[2]>0&&(!mx||r[2]>mx[0]))mx=[r[2],k,r[0],r[1]]}));
 let h=mx?`<p class="wmx">Heaviest hour: <b>${mmf(mx[0])} mm</b>, day ${mx[1]+1} at ${hf(mx[2])} (${mx[3]}% chance)</p>`:`<p class="wmx">No measurable rain forecast from 6 am to 8 pm.</p>`;
 h+=`<div class="wg wh"><span></span>${HR.map(x=>`<span>${x%3==0?(x%12||12)+(x<12?"a":"p"):""}</span>`).join("")}</div>`;
 days.forEach((x,k)=>{const m=new Map(x[1].map(r=>[r[0],r])),tot=x[1].reduce((s,r)=>s+r[2],0);h+=`<div class="wg"><span class="dl">D${k+1}<small>${mmf(tot)}mm</small></span>${HR.map(hr=>{const r=m.get(hr);return r?`<button class="wc rc r${rcl(r[1])}" data-k="${k}" data-h="${hr}"><b>${r[1]}</b></button>`:"<span></span>"}).join("")}</div>`});
 h+=`<p class="wk"><span>% chance</span><span class="r0">under 20</span><span class="r1">20-50</span><span class="r2">50-80</span><span class="r3">80+</span></p><small id="rdt">Tap an hour for the expected amount. The mm under each day is its total for these hours.</small>`;
 if(t)h+=`<small class="hint">Saved forecast from ${new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</small>`;
 el.innerHTML=h;el.querySelectorAll(".wc").forEach(b=>b.onclick=()=>{const r=days[+b.dataset.k][1].find(q=>q[0]==+b.dataset.h);el.querySelectorAll(".wc.sel").forEach(q=>q.classList.remove("sel"));b.classList.add("sel");$("#rdt").innerHTML=`<b>Day ${+b.dataset.k+1}, ${hf(r[0])}:</b> ${r[1]}% chance, ${mmf(r[2])} mm expected`})}
// offline tiles
const tx=(o,z)=>Math.floor((o+180)/360*2**z),ty=(a,z)=>{const r=a*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z)};
function tileList(O,z0,z1){const out=[],base="https://a.tile.opentopomap.org/";
 if(O.mode=="corridor"){const km=O.bufferKm||2,step=Math.max(.2,km/2),set=new Set();let last=-1e9;
  const add=p=>{const dy=km/111.32,dx=km/(111.32*Math.cos(p[0]*Math.PI/180));for(let z=z0;z<=z1;z++)for(let x=tx(p[1]-dx,z);x<=tx(p[1]+dx,z);x++)for(let y=ty(p[0]+dy,z);y<=ty(p[0]-dy,z);y++)set.add(z+"/"+x+"/"+y)};
  P.forEach(p=>{if(p[3]-last>=step){last=p[3];add(p)}});add(P[P.length-1]);set.forEach(k=>out.push(base+k+".png"));return out}
 const b=all.getBounds().pad(O.padding==null?.15:O.padding);for(let z=z0;z<=z1;z++)for(let x=tx(b.getWest(),z);x<=tx(b.getEast(),z);x++)for(let y=ty(b.getNorth(),z);y<=ty(b.getSouth(),z);y++)out.push(base+z+"/"+x+"/"+y+".png");return out}
async function dl(){const O=TRIP.offline||{},z0=O.zoomMin||11,z1=O.zoomMax||15,u=tileList(O,z0,z1),st=$("#dls"),btn=$("#dl");
 if(!self.caches){st.textContent=" This browser cannot save the map.";return}
 btn.disabled=true;let ok=0,bad=0;try{const c=await caches.open("m5-tiles-"+TRIP.id);for(let k=0;k<u.length;k+=4){await Promise.all(u.slice(k,k+4).map(async x=>{try{if(await c.match(x)){ok++;return}const r=await fetch(x,{mode:"cors"});if(r.ok){await c.put(x,r);ok++}else bad++}catch(_){bad++}}));st.textContent=` ${ok+bad} of ${u.length}`}}catch(e){bad=u.length-ok}
 try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(_){}
 st.textContent=bad?` Saved ${ok} of ${u.length}, ${bad} failed. Tap again to retry.`:` Saved all ${u.length} tiles (zoom ${z0} to ${z1}).`;if(!bad)try{LS[K("map")]=JSON.stringify({n:u.length,t:Date.now()})}catch(_){}btn.disabled=false}
function mapNote(){try{const m=JSON.parse(LS[K("map")]||"null");if(m&&$("#dls"))$("#dls").textContent=" Saved on "+new Date(m.t).toLocaleDateString("en-CA")+" ("+m.n+" tiles)."}catch(_){}}
async function dlx(){const st=$("#dls");try{await caches.delete("m5-tiles-"+TRIP.id);LS.removeItem(K("map"));st.textContent=" Saved map removed."}catch(e){st.textContent=" Could not remove the map."}}
function saveElev(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([LS[K("elev6")]||"[]"],{type:"application/json"}));a.download="elev.json";a.click()}
async function shareApp(){const url=location.origin+location.pathname+"?t="+encodeURIComponent(TRIP.id);try{if(navigator.share)await navigator.share({title:TRIP.name,text:"Trip app for our "+(TRIP.short||TRIP.name)+" trip",url});else{await navigator.clipboard.writeText(url);toast("Link copied")}}catch(_){}}
const installTip=()=>STANDALONE?"The app is installed on this device.":IOS?"On iPhone: tap Share, then Add to Home Screen. Do this before saving the map so Safari keeps it.":"On Android: open the browser menu, then tap Install app."
function startTab(){const s=LS[K("sd")];if(!s)return 0;const t=new Date(),ds=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`,k=Math.round((new Date(ds)-new Date(s))/864e5);return k>=0&&k<D.length?k+1:0}
function calc(raw){P.forEach((p,i)=>{let t=0,n=0;for(let j=Math.max(0,i-GW);j<=Math.min(P.length-1,i+GW);j++){t+=raw[j];n++}p[2]=t/n});
 D.forEach(d=>{d.up=gainRaw(d.a,d.b);d.dn=Math.max(0,d.up-(near(d.b)[2]-near(d.a)[2]))});EL=true}
const TERR=window.TERR||"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/";
const loadImg=u=>new Promise((ok,no)=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>ok(im);im.onerror=()=>no(new Error("map tile blocked"));im.src=u});
async function elevTiles(){const Z=13,n=2**Z,pos=P.map(p=>{const r=p[0]*Math.PI/180;return[(p[1]+180)/360*n,(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n]}),keys=[...new Set(pos.map(([x,y])=>Math.floor(x)+"/"+Math.floor(y)))],data={};
 for(const k of keys){const im=await loadImg(`${TERR}${Z}/${k}.png`),c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(im,0,0);data[k]=g.getImageData(0,0,256,256).data}
 const ev=(d,i,j)=>{const o=(j*256+i)*4;return d[o]*256+d[o+1]+d[o+2]/256-32768},cl=v=>Math.max(0,Math.min(255,v));
 const raw=pos.map(([x,y])=>{const tx=Math.floor(x),ty=Math.floor(y),d=data[tx+"/"+ty],fx=cl((x-tx)*256-.5),fy=cl((y-ty)*256-.5),i=Math.floor(fx),j=Math.floor(fy),a=fx-i,b=fy-j,i2=Math.min(255,i+1),j2=Math.min(255,j+1);return(ev(d,i,j)*(1-a)+ev(d,i2,j)*a)*(1-b)+(ev(d,i,j2)*(1-a)+ev(d,i2,j2)*a)*b});
 if(!raw.every(v=>v>-50&&v<4000))throw new Error("bad terrain data");return raw}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function getJ(u){const r=await fetch(u);if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}
async function elevMeteo(){const raw=[];for(let i=0;i<P.length;i+=50){const s=P.slice(i,i+50),u=`https://api.open-meteo.com/v1/elevation?latitude=${s.map(p=>p[0]).join(",")}&longitude=${s.map(p=>p[1]).join(",")}`;let j;for(let t=0;;t++){try{j=await getJ(u);break}catch(e){if(t>=2)throw e;await wait(1500)}}if(!j.elevation||j.elevation.length!=s.length)throw new Error("bad data");raw.push(...j.elevation);await wait(250)}return raw}
async function elevTopo(){const raw=[];for(let i=0;i<P.length;i+=100){const s=P.slice(i,i+100),j=await getJ("https://api.opentopodata.org/v1/srtm30m?locations="+s.map(p=>p[0]+","+p[1]).join("|"));if(!j.results||j.results.length!=s.length)throw new Error("bad data");raw.push(...j.results.map(x=>x.elevation));await wait(1100)}return raw}
const FRESH=/[?&]fresh/.test(location.search);
async function loadElev(){if(ELS=="busy")return;if(PADDLE){P.forEach(p=>p[2]=0);D.forEach(d=>{d.up=0;d.dn=0});EL=true;ELS="ok";show(cur);return}ELS="busy";let raw=null;if(!FRESH){const a=TRIP.elevation;if(Array.isArray(a)&&a.length==P.length)raw=a}if(!raw&&!FRESH)try{raw=JSON.parse(LS[K("elev6")]||"null")}catch(_){}
 if(!raw||raw.length!=P.length){let err="";raw=null;for(const f of[elevTiles,elevMeteo,elevTopo]){try{raw=await f();break}catch(e){err=e.message||String(e)}}
  if(!raw){ELS="fail";ELE=err;toast("Elevation could not load ("+err+").",8000);show(cur);return}
  raw=raw.map((v,i,a)=>v==null||isNaN(v)?(i?a[i-1]:0):v);try{LS[K("elev6")]=JSON.stringify(raw)}catch(_){}}
 ELS="ok";calc(raw);show(cur)}
cur=startTab();loadElev();if(!EL)show(cur);addEventListener("online",()=>{if(!EL)loadElev()});
