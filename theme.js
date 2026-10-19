// Colours for 500 More. One place for every colour the app uses.
// Each activity (hike, bike, paddle) has its own theme. A trip picks its theme with "activity" in trip.json.
// Day colours are shared by all trips; a trip can override them with "dayColors" (a list of colours).
(function(){
var DAY=["#f26b3a","#f6c445","#8dbf6a","#4fb3c4","#c58cdb"];
var THEMES={
 hike:{theme:"#2f6b4f",
  light:{bg:"#f3efe5",fg:"#25322b",mut:"#6a766d",card:"#fbf9f3",line:"#ddd6c4",acc:"#2f6b4f",hi:"#c4622d"},
  dark:{bg:"#131b17",fg:"#e8eee9",mut:"#9bb0a3",card:"#1c2721",line:"#33453b",acc:"#7fc8a0",hi:"#ff9a5e"},
  mk:{s:"#d32f2f",c:"#1e6fe0",p:"#f5a623",w:"#1e88e5"},out:"#0b2a12"},
 bike:{theme:"#865d36",
  light:{bg:"#efe7da",fg:"#3e362e",mut:"#6f5f4e",card:"#f9f4eb",line:"#dacbb8",acc:"#865d36",hi:"#ac8968"},
  dark:{bg:"#2a241f",fg:"#f0e8dc",mut:"#b8a898",card:"#3e362e",line:"#594c3f",acc:"#ac8968",hi:"#c9a47c"},
  mk:{s:"#a8452b",c:"#3f6f8a",p:"#e0a63a",w:"#3a86b8"},out:"#2a1f16",tint:"sepia(.3) saturate(.85) contrast(.96)",tintDark:"sepia(.3) saturate(.8) brightness(.82) contrast(.96)"},
 paddle:{theme:"#31708e",
  light:{bg:"#f7f9fb",fg:"#1e3442",mut:"#5a6e7b",card:"#ffffff",line:"#d5e4ef",acc:"#31708e",hi:"#687864"},
  dark:{bg:"#14222b",fg:"#e6eef4",mut:"#9db4c3",card:"#1e313d",line:"#30495a",acc:"#8fc1e3",hi:"#8fa38b"},
  mk:{s:"#a8452b",c:"#687864",p:"#e0a63a",w:"#5085a5"},out:"#14222b"}
};
function vars(o){return "--bg:"+o.bg+";--fg:"+o.fg+";--mut:"+o.mut+";--card:"+o.card+";--line:"+o.line+";--acc:"+o.acc+";--hi:"+o.hi}
function pick(act){return THEMES[act]||THEMES.hike}
function applyTheme(act){
 var T=pick(act),m=T.mk,css=":root{"+vars(T.light)+"}@media(prefers-color-scheme:dark){:root{"+vars(T.dark)+"}}"
  +".mk.w{background:"+m.w+"}.mk.s,.mk.e,.stop.s i,.stop.e i{background:"+m.s+"}.mk.c,.stop.c i{background:"+m.c+"}.mk.p,.stop.p i{background:"+m.p+";color:#3a2a00}"+(T.tint?"#map.tinted .leaflet-tile-pane{filter:"+T.tint+"}@media(prefers-color-scheme:dark){#map.tinted .leaflet-tile-pane{filter:"+(T.tintDark||T.tint)+"}}":"");
 var s=document.getElementById("theme")||document.createElement("style");s.id="theme";s.textContent=css;document.head.appendChild(s);
 var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",T.theme);
 window.TH=T;return T}
window.THEMES=THEMES;window.DAY_COLORS=DAY;window.applyTheme=applyTheme;window.themeOf=pick;
})();
