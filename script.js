const BUY_LINK = "#vip"; // TODO: replace with Stripe/PayPal link

const SERVERS = [
  { id:1, mode:"retake", tag:"RETAKE", name:"RETAKE #1 — Mirage Only", map:"de_mirage", ip:"play.nexus-cs2.eu:27015", players:19, max:24, tick:128 },
  { id:2, mode:"retake", tag:"RETAKE", name:"RETAKE #2 — Multi Map", map:"Multi / Inferno / Nuke", ip:"play.nexus-cs2.eu:27016", players:22, max:24, tick:128 },
  { id:3, mode:"dm", tag:"DEATHMATCH", name:"DM FFA #1 — Dust2", map:"de_dust2", ip:"play.nexus-cs2.eu:27017", players:16, max:20, tick:128 },
  { id:4, mode:"dm", tag:"DEATHMATCH", name:"DM Pistol Only", map:"de_inferno", ip:"play.nexus-cs2.eu:27018", players:11, max:20, tick:128 },
  { id:5, mode:"surf", tag:"SURF", name:"SURF Beginner — Tier 1-2", map:"surf_beginner", ip:"play.nexus-cs2.eu:27019", players:24, max:32, tick:128 },
  { id:6, mode:"surf", tag:"SURF", name:"SURF Pro — Tier 3-6", map:"surf_utopia", ip:"play.nexus-cs2.eu:27020", players:9, max:32, tick:128 },
];

const BANS = [
  { nick:"aim.diffuser", reason:"Aimbot", len:"Permanent", admin:"DIMA" },
  { nick:"xX_sniper_Xx", reason:"Wallhack", len:"Permanent", admin:"Auto-AC" },
  { nick:"surfEnjoyer99", reason:"Chat spam", len:"1 day", admin:"Mira" },
  { nick:"clutch_or_kick", reason:"Griefing", len:"7 days", admin:"DonJ" },
  { nick:"awp_no_scope", reason:"Toxicity", len:"3 days", admin:"Mira" },
  { nick:"spinbotter.cz", reason:"Spinbot", len:"Permanent", admin:"Auto-AC" },
  { nick:"rushB_tony", reason:"Teamkill", len:"1 day", admin:"DIMA" },
];

const TOP = [
  { nick:"donjj", elo:2841, kd:"1.42", hs:"58%" },
  { nick:"mira.flick", elo:2710, kd:"1.35", hs:"52%" },
  { nick:"RETAKEKING", elo:2655, kd:"1.31", hs:"49%" },
  { nick:"surf_god", elo:2590, kd:"1.28", hs:"41%" },
  { nick:"headshot.machine", elo:2512, kd:"1.24", hs:"61%" },
  { nick:"anton1337", elo:2477, kd:"1.19", hs:"45%" },
  { nick:"nukeEnjoyer", elo:2399, kd:"1.15", hs:"38%" },
  { nick:"pistol Pete", elo:2320, kd:"1.12", hs:"35%" },
];

const RULES = {
  general: [
    ["01","No cheating, macros, scripts or exploits. Instant permaban."],
    ["02","No toxicity, racism or hate speech — in chat or voice."],
    ["03","No griefing, teamkilling or intentionally blocking teammates."],
    ["04","Respect admins. Do not impersonate staff."],
    ["05","No advertising other servers / Discord links without permission."],
  ],
  retake: [
    ["01","Play the objective — don't hide to farm K/D."],
    ["02","No delaying round over 20s as last T/CT."],
    ["03","DM: no camping spawns, no team stacking."],
    ["04","Use !vote for maps, don't spam votes."],
  ],
  surf: [
    ["01","No shortcutting / pre-strafing outside allowed zones."],
    ["02","Don't block start / end zones. Use !hide if needed."],
    ["03","No bhop scripts — legit movement only."],
    ["04","Respect WR runs — no mic spam on bonus stages."],
  ]
};

const $ = s => document.querySelector(s);
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"),2200);
}
function copyText(txt, msg){
  navigator.clipboard?.writeText(txt).then(()=>toast(msg || ("Copied: "+txt))).catch(()=>toast(txt));
}

// render servers
let activeFilter = "all";
function renderServers(){
  const grid = $("#serverGrid"); grid.innerHTML = "";
  SERVERS.filter(s=>activeFilter==="all"||s.mode===activeFilter).forEach(s=>{
    const pct = Math.round(s.players/s.max*100);
    const full = s.players>=s.max;
    const el = document.createElement("div");
    el.className = "srv"+(full?" full":"");
    el.innerHTML = `
      <div class="srv-top"><span class="tag ${s.mode}">${s.tag}</span><span class="tick">${s.tick} TICK</span></div>
      <div><h3>${s.name}</h3><div class="map">📍 ${s.map}</div></div>
      <div class="players"><span>${full?"FULL":s.players+" / "+s.max+" players"}</span><span>${pct}%</span></div>
      <div class="pbar"><i style="width:${pct}%"></i></div>
      <div class="ip"><span>${s.ip}</span><button data-copy="${s.ip}">COPY</button></div>
      <div class="srv-btns">
        <button class="btn btn-outline" data-copy="${s.ip}">Copy IP</button>
        <a class="btn btn-primary" href="steam://connect/${s.ip}">Connect</a>
      </div>`;
    grid.appendChild(el);
  });
  grid.querySelectorAll("[data-copy]").forEach(b=>b.onclick=e=>{e.preventDefault();copyText(b.dataset.copy,"Server IP copied — paste in console: connect "+b.dataset.copy)});
}

function renderQuick(){
  const q = $("#quickList"); q.innerHTML = "";
  const sorted = [...SERVERS].sort((a,b)=>(b.max-b.players)-(a.max-a.players)).slice(0,4);
  sorted.forEach(s=>{
    const row = document.createElement("div"); row.className="qc-row";
    row.innerHTML = `<span class="mode ${s.mode}">${s.tag}</span>
      <div style="flex:1"><b>${s.name.split("—")[0]}</b><small>${s.players}/${s.max} • ${s.map}</small><div class="bar"><i style="width:${s.players/s.max*100}%"></i></div></div>
      <button class="qc-join">JOIN</button>`;
    row.querySelector("button").onclick = ()=>{ window.location.href = `steam://connect/${s.ip}`; toast("Launching CS2… "+s.ip); };
    q.appendChild(row);
  });
  const total = SERVERS.reduce((a,s)=>a+s.players,0);
  const max = SERVERS.reduce((a,s)=>a+s.max,0);
  $("#totalOnline").textContent = total;
  $("#heroOnline").textContent = total + 211; // + website visitors illusion
}

// bans
function renderBans(filter=""){
  const tb = $("#banTable tbody"); tb.innerHTML="";
  BANS.filter(b=>(b.nick+b.reason+b.admin).toLowerCase().includes(filter.toLowerCase())).forEach(b=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td><b>${b.nick}</b></td><td><span class="ban-reason">${b.reason}</span></td><td class="ban-len">${b.len}</td><td style="color:var(--muted)">${b.admin}</td>`;
    tb.appendChild(tr);
  });
  if(!tb.children.length) tb.innerHTML=`<tr><td colspan="4" style="color:var(--muted)">No bans found.</td></tr>`;
}

// stats
function renderStats(){
  const tb=$("#statsTable tbody"); tb.innerHTML="";
  TOP.forEach((p,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td class="rank-${i+1}">${i+1}</td><td><b>${p.nick}</b></td><td style="font-family:monospace">${p.elo}</td><td>${p.kd}</td><td>${p.hs}</td>`;
    tb.appendChild(tr);
  });
}

// rules
function renderRules(k="general"){
  const box=$("#rulesList"); box.innerHTML="";
  RULES[k].forEach(([n,t])=>{ const d=document.createElement("div"); d.className="rule"; d.innerHTML=`<b>${n}</b><span>${t}</span>`; box.appendChild(d); });
}

// counters
function counters(){
  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=+el.dataset.count; let cur=0; const step=Math.max(1,Math.round(target/60));
    const h=setInterval(()=>{cur+=step; if(cur>=target){cur=target;clearInterval(h);} el.textContent=cur.toLocaleString();},24);
  });
}

// fake live fluctuation
setInterval(()=>{
  SERVERS.forEach(s=>{
    if(s.players < s.max && Math.random()>0.5) s.players++;
    else if(s.players>3 && Math.random()>0.7) s.players--;
  });
  renderServers(); renderQuick();
},8000);

document.addEventListener("DOMContentLoaded", ()=>{
  renderServers(); renderQuick(); renderBans(); renderStats(); renderRules(); counters();

  document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); activeFilter=b.dataset.filter; renderServers();
  });
  document.querySelectorAll("[data-rules]").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("[data-rules]").forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); renderRules(b.dataset.rules);
  });

  $("#banSearch").oninput = e=>renderBans(e.target.value);
  $("#burger").onclick = ()=>$("#navLinks").classList.toggle("open");
  document.querySelectorAll("#navLinks a").forEach(a=>a.onclick=()=>$("#navLinks").classList.remove("open"));

  document.querySelectorAll(".buy-btn").forEach(b=>b.onclick=()=>toast(`${b.dataset.plan} — redirecting to checkout… (${BUY_LINK})`));
  $("#copyDiscord").onclick = ()=>copyText("discord.gg/nexuscs2","Discord invite copied!");
  $("#connectFastest").onclick = ()=>{
    const best=[...SERVERS].sort((a,b)=>(b.max-b.players)-(a.max-a.players))[0];
    window.location.href=`steam://connect/${best.ip}`; toast("Connecting to "+best.name);
  };
});
