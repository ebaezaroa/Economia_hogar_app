// ── USUARIOS CONOCIDOS ────────────────────────────────────
const KNOWN_EMAILS = {
  'ebaezaroa@gmail.com':     'Erick',
  'ma.francisca89@gmail.com':'Fran',
};

function doLogin() {
  var email = document.getElementById('loginEmail').value.trim().toLowerCase();
  var errEl = document.getElementById('loginError');
  var name = KNOWN_EMAILS[email];
  if (!name) {
    errEl.textContent = 'Correo no reconocido. Intenta de nuevo.';
    return;
  }
  errEl.textContent = '';
  try {
    localStorage.setItem('casaEF_email', email);
    localStorage.setItem('casaEF_who', name);
  } catch(e) {}
  S.whoAmI = name;
  document.getElementById('loginScreen').classList.remove('on');
  updateWhoUI();
  save();
  toast('Bienvenid@ ' + name + '! 👋');
}

function showLogin() {
  document.getElementById('loginScreen').classList.add('on');
  setTimeout(function() {
    var el = document.getElementById('loginEmail');
    if (el) el.focus();
  }, 100);
}

function logOut() {
  try {
    localStorage.removeItem('casaEF_email');
    localStorage.removeItem('casaEF_who');
  } catch(e) {}
  S.whoAmI = '';
  showLogin();
}

let _fbAuth = null;
let _fbToken = null;
try {
  firebase.initializeApp({ databaseURL: 'https://casa-ef-default-rtdb.firebaseio.com' });
  _fbAuth = firebase.auth();
} catch(e) { console.warn('Firebase init failed:', e); }

async function _ensureToken() {
  if (_fbToken) return _fbToken;
  if (!_fbAuth) return null;
  try {
    let user = _fbAuth.currentUser;
    if (!user) {
      const cred = await _fbAuth.signInAnonymously();
      user = cred.user;
    }
    _fbToken = await user.getIdToken();
    setTimeout(async () => { _fbToken = null; }, 55 * 60 * 1000);
    return _fbToken;
  } catch(e) { return null; }
}

const FB = 'https://casa-ef-default-rtdb.firebaseio.com';

async function fbGet(path) {
  try {
    const token = await _ensureToken();
    const authQ = token ? '?auth=' + token : '';
    const r = await fetch(FB + path + '.json' + authQ);
    if (!r.ok) return null;
    return await r.json();
  } catch(e) { return null; }
}
async function fbSet(path, data) {
  try {
    const token = await _ensureToken();
    const authQ = token ? '?auth=' + token : '';
    const r = await fetch(FB + path + '.json' + authQ, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    return r.ok;
  } catch(e) { return false; }
}
const MF = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

const DC = {
  propital:    {label:'Servicio Propital',        color:'#6ab04c'},
  generador:   {label:'Generador (Erick)',         color:'#e17055'},
  arriendo:    {label:'Arriendo Villarrica',       color:'#4f9ef8'},
  electricidad:{label:'Electricidad Villarrica',   color:'#ffd60a'},
  agua:        {label:'Agua Villarrica',           color:'#34c759'},
  gas:         {label:'Gas Villarrica',            color:'#ff6b35'},
  internet:    {label:'Internet Villarrica',       color:'#7b6ef6'},
  cocina:      {label:'Cuota cocina',              color:'#5ac8fa'},
  dividendo:   {label:'Dividendo casa propia',     color:'#2d8cf0'},
  remodelacion:{label:'Remodelación casa nueva',   color:'#af52de'},
  aguaCasa:    {label:'Agua casa propia',          color:'#00b894'},
  luzCasa:     {label:'Luz casa propia',           color:'#fdcb6e'},
  internetCasa:{label:'Internet casa propia',      color:'#a29bfe'},
  pie:         {label:'Pie depto (Fran)',           color:'#0984e3'},
  abono:       {label:'Abono inicial depto (Erick)',color:'#74b9ff'},
  mesa:        {label:'Mesa depto nuevo',          color:'#fab1a0'},
  refrigerador:{label:'Refrigerador',              color:'#d63031'},
  iluminacion: {label:'Iluminación depto',         color:'#fdcb6e'},
  creditoFran: {label:'Crédito Fran BCI',          color:'#fd79a8'},
  leonAuto:    {label:'Auto León Subaru',          color:'#636e72'},
  auto:        {label:'Auto Subaru XV',            color:'#b2bec3'},
};

const RAW = [
  {y:2023,m:9,cats:{propital:60166,pie:600000,abono:124340,mesa:59990,refrigerador:329990,iluminacion:62930,creditoFran:121013}},
  {y:2023,m:10,cats:{propital:60166,pie:600000,abono:124340,creditoFran:121013}},
  {y:2023,m:11,cats:{propital:60166,pie:600000,abono:124340,creditoFran:121013}},
  {y:2023,m:12,cats:{propital:60166,pie:600000,abono:124340,creditoFran:121013}},
  {y:2024,m:1,cats:{propital:60166,pie:600000,abono:124340,creditoFran:121013}},
  {y:2024,m:2,cats:{propital:60166,pie:600000,abono:124340,creditoFran:121013}},
  {y:2024,m:3,cats:{propital:60166,arriendo:760000,electricidad:29344,agua:7800,pie:600000,creditoFran:121013}},
  {y:2024,m:4,cats:{generador:93199,arriendo:760000,electricidad:75105,gas:25900,internet:30394,pie:600000,creditoFran:121013,leonAuto:114800}},
  {y:2024,m:5,cats:{generador:93199,arriendo:760000,electricidad:76118,agua:28000,gas:25900,internet:30394,creditoFran:121013,leonAuto:114800}},
  {y:2024,m:6,cats:{generador:93199,arriendo:760000,electricidad:156000,agua:27663,gas:25900,internet:30394,creditoFran:121013,leonAuto:114800}},
  {y:2024,m:7,cats:{generador:93199,arriendo:760000,electricidad:116807,agua:29068,gas:25900,internet:21990,creditoFran:121013,leonAuto:114800}},
  {y:2024,m:8,cats:{generador:93199,arriendo:760000,electricidad:123601,agua:27000,gas:21900,internet:21990,leonAuto:114800,auto:150000}},
  {y:2024,m:9,cats:{generador:93199,arriendo:794960,electricidad:66521,agua:39054,gas:21900,internet:21990,leonAuto:114800,auto:150000}},
  {y:2024,m:10,cats:{arriendo:777480,electricidad:78666,agua:30832,gas:23500,internet:21087,leonAuto:114800,auto:150000}},
  {y:2024,m:11,cats:{arriendo:777480,electricidad:78413,agua:56704,gas:43000,internet:22309,leonAuto:114800,auto:150000}},
  {y:2024,m:12,cats:{arriendo:777480,electricidad:82951,agua:67000,gas:25900,internet:28396,leonAuto:114800,auto:150000}},
  {y:2025,m:1,cats:{arriendo:777480,electricidad:63504,agua:29571,internet:20638,leonAuto:114800,auto:150000}},
  {y:2025,m:2,cats:{arriendo:220000,electricidad:22600,agua:25300,gas:21800,internet:6000,auto:150000}},
  {y:2025,m:3,cats:{arriendo:550000,electricidad:25300,agua:20700,gas:22000,internet:22990}},
  {y:2025,m:4,cats:{arriendo:550000,electricidad:28300,agua:25300,gas:42800,internet:22990}},
  {y:2025,m:5,cats:{arriendo:550000,electricidad:65100,agua:23000,gas:32450,internet:22990}},
  {y:2025,m:6,cats:{arriendo:550000,electricidad:63800,agua:29900,gas:42500,internet:22990}},
  {y:2025,m:7,cats:{arriendo:550000,electricidad:75000,agua:29900,gas:43000,internet:22990}},
  {y:2025,m:8,cats:{arriendo:550000,electricidad:63500,agua:29900,gas:43000,internet:32990}},
  {y:2025,m:9,cats:{arriendo:550000,electricidad:50600,agua:30000,gas:42850,internet:32990}},
  {y:2025,m:10,cats:{arriendo:550000,electricidad:42300,agua:27600,gas:42550,internet:32990}},
  {y:2025,m:11,cats:{arriendo:550000,electricidad:31800,agua:28000,gas:42850,internet:33270}},
  {y:2025,m:12,cats:{arriendo:550000,electricidad:32800,agua:28000,gas:38000,internet:33270,cocina:95484,aguaCasa:1800}},
  {y:2026,m:1,cats:{arriendo:550000,electricidad:32600,agua:32200,gas:27300,internet:33270,cocina:95484,remodelacion:724618,aguaCasa:7700,luzCasa:5100}},
  {y:2026,m:2,cats:{arriendo:550000,electricidad:30400,agua:29900,gas:32450,internet:33531,cocina:95484,dividendo:546545,remodelacion:724618,aguaCasa:17600}},
  {y:2026,m:3,cats:{arriendo:550000,electricidad:29100,agua:23000,gas:37550,internet:33270,cocina:95484,dividendo:466802,remodelacion:724618,aguaCasa:9900,luzCasa:12100}},
  {y:2026,m:4,cats:{internet:18900,dividendo:469884,remodelacion:724618,aguaCasa:11750,luzCasa:18900,internetCasa:18900}},
  {y:2026,m:5,cats:{dividendo:469884,remodelacion:724618}},
  {y:2026,m:6,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:7,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:8,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:9,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:10,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:11,cats:{dividendo:466900,remodelacion:724618}},
  {y:2026,m:12,cats:{dividendo:466900,remodelacion:724618}},
];

// Client numbers from Excel
const DEFAULT_CLIENT_NUMS = {
  gas: '90509975',
  electricidad: '2734332',
  luzCasa: '000008050222',
  aguaCasa: '455924',
  internetCasa: '',
};

let S = {
  data: JSON.parse(JSON.stringify(RAW)),
  cats: JSON.parse(JSON.stringify(DC)),
  cuentas:[], vars:{}, paid:{}, comments:{},
  clientNums: Object.assign({}, DEFAULT_CLIENT_NUMS),
  history:[], remDay:25, whoAmI:'Erick', lightMode:false
};
let ci = S.data.length - 1;
let ct = 'detalle';
let tChart = null, pieChart = null, mCb = null;
let swipeLast = null;

// ── FIREBASE ── fbGet / fbSet definidos arriba con auth ──
function setSyncUI(type, msg) {
  ['sdot'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.className = 'sdot ' + type;
  });
  var t = document.getElementById('stxt');
  if (t) t.textContent = msg;
}

// ── MERGE — combina dos versiones sin perder cambios de ninguno ──
function mergeStates(local, remote) {
  if (!local) return remote;
  if (!remote) return local;
  var merged = JSON.parse(JSON.stringify(local));

  // data: por mes, gana el más reciente según dataTs
  var localTs = local.dataTs || {}, remoteTs = remote.dataTs || {};
  var allMonths = {};
  (local.data || []).forEach(function(d) { allMonths[d.y+'-'+d.m] = d; });
  (remote.data || []).forEach(function(d) {
    var key = d.y+'-'+d.m;
    var lt = localTs[key] || 0, rt = remoteTs[key] || 0;
    if (rt > lt) allMonths[key] = d;
  });
  merged.data = Object.values(allMonths).sort(function(a,b){ return a.y!==b.y?a.y-b.y:a.m-b.m; });
  merged.dataTs = Object.assign({}, localTs);
  Object.keys(remoteTs).forEach(function(k){ if((remoteTs[k]||0) > (localTs[k]||0)) merged.dataTs[k] = remoteTs[k]; });

  // paid, comments, vars: unión — nunca se pierde ninguna entrada
  merged.paid = Object.assign({}, remote.paid || {}, local.paid || {});
  merged.comments = Object.assign({}, remote.comments || {}, local.comments || {});
  var mergedVars = Object.assign({}, remote.vars || {});
  Object.keys(local.vars || {}).forEach(function(mk2) {
    if (!mergedVars[mk2]) { mergedVars[mk2] = local.vars[mk2]; return; }
    var ids = new Set(mergedVars[mk2].map(function(v){return v.id;}));
    local.vars[mk2].forEach(function(v){ if(!ids.has(v.id)) mergedVars[mk2].push(v); });
  });
  merged.vars = mergedVars;

  // cuentas: unión por id
  var cuentasMap = {};
  (remote.cuentas || []).forEach(function(c){ cuentasMap[c.id]=c; });
  (local.cuentas || []).forEach(function(c){ cuentasMap[c.id]=c; });
  merged.cuentas = Object.values(cuentasMap);

  // historial: unión, deduplicado por ts
  var histMap = {};
  (remote.history || []).concat(local.history || []).forEach(function(h){ histMap[h.ts]=h; });
  merged.history = Object.values(histMap).sort(function(a,b){return b.ts-a.ts;}).slice(0,60);

  // settings: gana el más reciente
  if ((remote.updatedAt||0) > (local.updatedAt||0)) {
    merged.remDay = remote.remDay ?? local.remDay;
    merged.cats = remote.cats || local.cats;
    merged.clientNums = remote.clientNums || local.clientNums;
  }
  return merged;
}

// ── SAVE — localStorage first, then Firebase ──────────────
async function save() {
  setSyncUI('spin', 'Guardando...');
  var ts = Date.now();
  S.updatedAt = ts;
  // Marca timestamp del mes actual para merge granular
  if (!S.dataTs) S.dataTs = {};
  if (S.data[ci]) S.dataTs[S.data[ci].y+'-'+S.data[ci].m] = ts;
  var payload = JSON.parse(JSON.stringify(S));
  // 1. localStorage inmediato
  try {
    localStorage.setItem('casaEF_v5', JSON.stringify(payload));
    localStorage.setItem('casaEF_v5_ts', String(ts));
  } catch(e) {}
  // 2. Firebase
  var ok = await fbSet('/casaEF', payload);
  if (ok) {
    setSyncUI('ok', 'Guardado · ' + new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}));
  } else {
    setSyncUI('err', 'Guardado local');
    setTimeout(async function() {
      var retry = await fbSet('/casaEF', payload);
      if (retry) setSyncUI('ok', 'Sincronizado');
    }, 4000);
  }
}

// ── INIT — carga y merge de datos ──────────────────────
async function init() {
  // 1. Verificar sesión guardada
  var savedEmail = null, savedWho = null;
  try {
    savedEmail = localStorage.getItem('casaEF_email');
    savedWho   = localStorage.getItem('casaEF_who');
  } catch(e) {}

  if (!savedEmail || !KNOWN_EMAILS[savedEmail]) {
    document.getElementById('loadingScreen').classList.add('hide');
    showLogin();
    return;
  }
  S.whoAmI = savedWho || KNOWN_EMAILS[savedEmail];

  // 2. Cargar localStorage inmediatamente (sin esperar Firebase)
  var localData = null;
  try {
    var ld = localStorage.getItem('casaEF_v5');
    if (ld) localData = JSON.parse(ld);
  } catch(e) {}

  if (localData && localData.data) {
    S.data = localData.data || S.data;
    S.dataTs = localData.dataTs || {};
    S.cats = localData.cats || S.cats;
    S.cuentas = localData.cuentas || [];
    S.vars = localData.vars || {};
    S.paid = localData.paid || {};
    S.comments = localData.comments || {};
    S.clientNums = localData.clientNums || Object.assign({}, DEFAULT_CLIENT_NUMS);
    S.history = localData.history || [];
    S.remDay = localData.remDay || 25;
    S.lightMode = localData.lightMode || false;
  }

  // 3. Mostrar la app de inmediato
  ci = Math.max(0, S.data.length - 1);
  var mc = document.getElementById('mCount');
  if (mc) mc.textContent = S.data.length;
  document.getElementById('loadingScreen').classList.add('hide');
  applyTheme(); checkRem(); render();
  setSyncUI('spin', 'Sincronizando...');

  // 4. Sincronizar con Firebase en background (sin bloquear UI)
  setTimeout(async function() {
    try {
      var remote = await fbGet('/casaEF');
      if (!remote) {
        // Sin datos remotos — subir lo local
        if (localData && localData.data && localData.data.length > 0) {
          fbSet('/casaEF', localData);
        } else {
          save();
        }
        setSyncUI('ok', 'Local');
        return;
      }

      var winner = null;
      if (localData && localData.data && remote.data) {
        winner = mergeStates(localData, remote);
        if (JSON.stringify(winner) !== JSON.stringify(remote)) {
          fbSet('/casaEF', winner);
        }
      } else if (remote && remote.data && remote.data.length > 0) {
        winner = remote;
        try {
          localStorage.setItem('casaEF_v5', JSON.stringify(remote));
          localStorage.setItem('casaEF_v5_ts', String(remote.updatedAt || Date.now()));
        } catch(e) {}
      }

      if (winner) {
        S.data = winner.data || S.data;
        S.dataTs = winner.dataTs || {};
        S.cats = winner.cats || S.cats;
        S.cuentas = winner.cuentas || [];
        S.vars = winner.vars || {};
        S.paid = winner.paid || {};
        S.comments = winner.comments || {};
        S.clientNums = winner.clientNums || Object.assign({}, DEFAULT_CLIENT_NUMS);
        S.history = winner.history || [];
        S.remDay = winner.remDay || 25;
        S.lightMode = winner.lightMode || false;
        ci = Math.max(0, S.data.length - 1);
        var mc2 = document.getElementById('mCount');
        if (mc2) mc2.textContent = S.data.length;
        applyTheme(); checkRem(); render();
      }
      setSyncUI('ok', 'Sincronizado');
    } catch(e) {
      setSyncUI('err', 'Sin conexión');
    }
  }, 0);
}

// ── HELPERS ───────────────────────────────────────────────
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function fmt(n){return '$'+Math.round(n).toLocaleString('es-CL');}
function mk(d){return d.y+'-'+d.m;}
function cuentasForMonth(d){
  return S.cuentas.filter(function(c){
    if(!c.fromY) return true; // legacy: apply to all
    if(d.y > c.fromY) return true;
    if(d.y === c.fromY && d.m >= c.fromM) return true;
    return false;
  });
}
function tot(d){
  var t=Object.values(d.cats).reduce(function(a,v){return a+(v||0);},0);
  (S.vars[mk(d)]||[]).forEach(function(v){t+=v.monto;});
  cuentasForMonth(d).forEach(function(c){t+=c.monto;});
  return t;
}
function toast(msg){var t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},2200);}
function showNotif(msg){var n=document.getElementById('notif');n.textContent=msg;n.classList.add('on');setTimeout(function(){n.classList.remove('on');},3000);}
function animNum(id,val){var el=document.getElementById(id);if(!el)return;el.innerHTML='<span class="anim-num">'+val+'</span>';}
function addHist(who,action,detail){if(!S.history)S.history=[];S.history.unshift({who:who,action:action,detail:detail||'',ts:Date.now()});if(S.history.length>60)S.history=S.history.slice(0,60);}
function applyTheme(){document.body.classList.toggle('light',!!S.lightMode);var tr=document.getElementById('themeTrack');if(tr)tr.classList.toggle('on',!!S.lightMode);}
function toggleTheme(){S.lightMode=!S.lightMode;applyTheme();save();}
function setWho(n){S.whoAmI=n;save();updateWhoUI();toast('Hola, '+n+'! 👋');}
function updateWhoUI(){var be=document.getElementById('btnErick');var bf=document.getElementById('btnFran');if(be)be.className='btn '+(S.whoAmI==='Erick'?'btn-p':'btn-s');if(bf)bf.className='btn '+(S.whoAmI==='Fran'?'btn-p':'btn-s');}
function checkRem(){var day=S.remDay||25,today=new Date(),left=day-today.getDate();var b=document.getElementById('remBanner');if(left>=0&&left<=5){b.classList.add('on');var t=tot(S.data[S.data.length-1]);document.getElementById('remTxt').textContent='Faltan '+left+' día'+(left!==1?'s':'')+' para el día de pago. Recuerda coordinar '+fmt(t/2)+' cada uno.';}else{b.classList.remove('on');}}
function saveRem(){S.remDay=parseInt(document.getElementById('remDay').value)||25;save();toast('Recordatorio guardado');checkRem();}
function chM(d){ci=Math.max(0,Math.min(S.data.length-1,ci+d));render();}
function showTab(tab,btn){ct=tab;document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on');});btn.classList.add('on');document.querySelectorAll('.pane').forEach(function(p){p.classList.remove('on');});document.getElementById('pane-'+tab).classList.add('on');render();}
function tog(id){document.getElementById(id).classList.toggle('on');}
function openM(title,fields,cb){document.getElementById('mTitle').textContent=title;document.getElementById('mFields').innerHTML=fields;mCb=cb;document.getElementById('mSave').onclick=function(){if(mCb)mCb();};document.getElementById('modal').classList.add('on');}
function closeM(e){if(!e||e.target===document.getElementById('modal')){document.getElementById('modal').classList.remove('on');mCb=null;}}

// ── ADD/DELETE MONTH ──────────────────────────────────────
function openAddMonth(){
  var last=S.data[S.data.length-1];
  var ny=last.y,nm=last.m+1;if(nm>12){nm=1;ny++;}
  var opts=MF.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===nm?' selected':'')+'>'+m+'</option>';}).join('');
  var lastLabel=MF[last.m-1]+' '+last.y;
  window._copyMode=true;
  openM('Agregar nuevo mes',
    '<div><div class="flabel">Mes</div><select id="nmM">'+opts+'</select></div>'+
    '<div><div class="flabel">Año</div><input id="nmY" type="number" value="'+ny+'" min="2020" max="2035"/></div>'+
    '<div style="margin-top:10px;background:var(--bg3);border-radius:var(--radius-sm);padding:10px;">'+
    '<div class="flabel" style="margin-bottom:8px;">¿Copiar valores de '+lastLabel+'?</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">'+
    '<button type="button" id="btnCpY" onclick="setCopyMode(true)" class="btn btn-p" style="font-size:11px;">✓ Sí, copiar</button>'+
    '<button type="button" id="btnCpN" onclick="setCopyMode(false)" class="btn btn-s" style="font-size:11px;">✕ En cero</button>'+
    '</div><div style="font-size:10px;color:var(--text3);margin-top:6px;" id="cpHint">Copia todos los montos de '+lastLabel+'</div></div>',
    function(){
      var m=parseInt(document.getElementById('nmM').value);
      var y=parseInt(document.getElementById('nmY').value);
      if(S.data.find(function(d){return d.y===y&&d.m===m;})){toast('Ese mes ya existe');return;}
      var baseCats=['aguaCasa','luzCasa'];
      var newCats={};
      // Copy from last month (no duplicates since it's an object)
      Object.keys(last.cats).forEach(function(k){newCats[k]=window._copyMode?(last.cats[k]||0):0;});
      // Ensure base cats exist
      baseCats.forEach(function(k){if(!(k in newCats))newCats[k]=0;});
      S.data.push({y:y,m:m,cats:newCats});
      S.data.sort(function(a,b){return a.y!==b.y?a.y-b.y:a.m-b.m;});
      ci=S.data.findIndex(function(d){return d.y===y&&d.m===m;});
      window._copyMode=true;
      var mc=document.getElementById('mCount');if(mc)mc.textContent=S.data.length;
      closeM();save();toast(MF[m-1]+' '+y+' agregado ✓');render();
    }
  );
}
function setCopyMode(val){
  window._copyMode=val;
  var y=document.getElementById('btnCpY');var n=document.getElementById('btnCpN');var h=document.getElementById('cpHint');
  var last=S.data[S.data.length-1];var ll=MF[last.m-1]+' '+last.y;
  if(y)y.className='btn '+(val?'btn-p':'btn-s');
  if(n)n.className='btn '+(val?'btn-s':'btn-p');
  if(h)h.textContent=val?'Copia todos los montos de '+ll:'El mes nuevo comienza en $0';
}
function deleteMonth(){
  var d=S.data[ci];var label=MF[d.m-1]+' '+d.y;
  if(S.data.length<=1){toast('No puedes eliminar el único mes');return;}
  openM('Eliminar mes',
    '<div style="text-align:center;padding:8px 0;"><div style="font-size:32px;margin-bottom:10px;">🗑️</div>'+
    '<div style="font-size:14px;font-weight:600;margin-bottom:6px;">¿Eliminar '+label+'?</div>'+
    '<div style="font-size:12px;color:var(--text2);line-height:1.5;">Se borrarán todos los gastos de este mes. Esta acción no se puede deshacer.</div></div>',
    function(){
      S.data.splice(ci,1);
      var mk2=d.y+'-'+d.m;
      delete S.vars[mk2];
      Object.keys(S.paid).forEach(function(k){if(k.startsWith(mk2))delete S.paid[k];});
      Object.keys(S.comments).forEach(function(k){if(k.startsWith(mk2))delete S.comments[k];});
      if(ci>=S.data.length)ci=S.data.length-1;
      var mc=document.getElementById('mCount');if(mc)mc.textContent=S.data.length;
      addHist(S.whoAmI||'Erick','eliminó el mes',label);
      closeM();save();toast(label+' eliminado');render();
    }
  );
}

// ── SWIPE ─────────────────────────────────────────────────
function initSwipe(){
  document.querySelectorAll('.crow').forEach(function(row){
    var sx=null;
    row.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
    row.addEventListener('touchmove',function(e){
      if(sx===null)return;
      var dx=e.touches[0].clientX-sx;
      if(dx<-30){if(swipeLast&&swipeLast!==row)swipeLast.classList.remove('swiped');row.classList.add('swiped');swipeLast=row;}
      else if(dx>15){row.classList.remove('swiped');}
    },{passive:true});
    row.addEventListener('touchend',function(){sx=null;},{passive:true});
  });
  document.addEventListener('touchstart',function(e){if(swipeLast&&!swipeLast.contains(e.target)){swipeLast.classList.remove('swiped');swipeLast=null;}},{passive:true});
}

// ── RENDER ────────────────────────────────────────────────
function render(){
  var d=S.data[ci],prev=ci>0?S.data[ci-1]:null;
  var t=tot(d),pt=prev?tot(prev):null;
  document.getElementById('mLbl').textContent=MF[d.m-1]+' '+d.y;
  animNum('mTot',fmt(t));animNum('mCada',fmt(t/2));animNum('spE',fmt(t/2));animNum('spF',fmt(t/2));
  var dh='';
  if(pt){var df=t-pt,pct=Math.round(Math.abs(df)/pt*100);
    dh=df>0?'<span class="pill p-up">▲ '+pct+'% vs ant.</span>':df<0?'<span class="pill p-dn">▼ '+pct+'% vs ant.</span>':'<span class="pill p-eq">= igual</span>';}
  document.getElementById('mDiff').innerHTML=dh;
  if(ct==='detalle')renderD(d);
  if(ct==='comparar')renderComp(d,prev);
  if(ct==='torta')renderPie(d);
  if(ct==='split')renderSplit(d);
  if(ct==='tendencia')renderTrend();
  if(ct==='historial')renderHist();
  if(ct==='exportar')renderExp(d,t);
  if(ct==='ajustes')renderAj();
}

function renderD(d){
  var catsWithBase=Object.assign({},d.cats);
  // From May 2026 onwards: always show these base cats
  if(d.y>2026||(d.y===2026&&d.m>=5)){
    ['aguaCasa','luzCasa','gas','internet'].forEach(function(k){
      if(!(k in catsWithBase))catsWithBase[k]=0;
    });
  } else if(d.y===2026&&d.m>=1){
    // Jan-Apr 2026: only casa propia cats
    ['aguaCasa','luzCasa'].forEach(function(k){
      if(!(k in catsWithBase))catsWithBase[k]=0;
    });
  }
  var es=Object.entries(catsWithBase).sort(function(a,b){
    if(a[1]===0&&b[1]===0)return 0;if(a[1]===0)return 1;if(b[1]===0)return -1;return b[1]-a[1];
  });
  cuentasForMonth(d).forEach(function(c){es.push(['__'+c.id,c.monto]);});
  var mx=Math.max.apply(null,es.map(function(e){return e[1];}));mx=mx||1;
  var catCnKeys=['electricidad','agua','gas','internet','luzCasa','aguaCasa','internetCasa','dividendo','arriendo','cocina'];
  var html='';
  es.forEach(function(entry){
    var k=entry[0],v=entry[1];
    var isC=k.startsWith('__');
    var ec=isC?S.cuentas.find(function(c){return c.id===k.slice(2);}):null;
    var lbl=isC?ec.label:(S.cats[k]?S.cats[k].label:k);
    var col=isC?ec.color:(S.cats[k]?S.cats[k].color:'#888');
    var pct=Math.round(v/mx*100);
    var isZero=v===0;
    var paidKey=mk(d)+'_'+k+'_paid';
    var paidInfo=S.paid&&S.paid[paidKey];
    var isPaid=!!paidInfo;
    var comment=S.comments&&S.comments[mk(d)+'_'+k]?S.comments[mk(d)+'_'+k]:'';
    var clientNum=S.clientNums&&S.clientNums[k]?S.clientNums[k]:'';
    var showCN=!isC&&catCnKeys.indexOf(k)!==-1;
    var safeK=esc(k),safeLbl=esc(lbl);
    html+='<div class="crow" style="'+(isPaid?'background:rgba(52,199,89,0.05);':'')+(isZero?'opacity:0.6;':'')+'">'+
      '<button class="paybtn'+(isPaid?' paid':'')+'" onclick="togglePaid(\''+safeK+'\',\''+esc(lbl).replace(/&#39;/g,"\\'")+'\','+isC+')">'+(isPaid?'✓':'')+'</button>'+
      '<div class="cinfo">'+
        '<div class="cname">'+safeLbl+'</div>'+
        (clientNum?'<div class="cnote">🔢 '+esc(clientNum)+'</div>':'')+
        (isPaid?'<div class="cnote green">✅ Pagó '+esc(paidInfo.who)+'</div>':'')+
        (comment?'<div class="cnote">💬 '+esc(comment)+'</div>':'')+
      '</div>'+
      '<div class="cbar"><div class="cbarf" style="width:'+pct+'%;background:'+(isPaid?'var(--green)':col)+'"></div></div>'+
      '<div class="camt" style="color:'+(isPaid?'var(--green)':'')+(isZero?';color:var(--text3)':'')+'">'+fmt(v)+'</div>'+
      '<div class="swipe-reveal">'+
        '<button class="xbtn" onclick="editG(\''+safeK+'\','+isC+')">editar</button>'+
        '<button class="xbtn" onclick="addComment(\''+safeK+'\',\''+esc(lbl).replace(/&#39;/g,"\\'")+'\')">💬</button>'+
        (showCN?'<button class="xbtn" onclick="editClientNum(\''+safeK+'\',\''+esc(lbl).replace(/&#39;/g,"\\'")+'\')">🔢</button>':'')+
      '</div>'+
    '</div>';
  });
  document.getElementById('catList').innerHTML=html||'<div class="empty">Sin gastos este mes</div>';
  var vrs=S.vars[mk(d)]||[];
  var vhtml='';
  vrs.forEach(function(v,i){
    vhtml+='<div class="crow">'+
      '<div class="cdot" style="background:#ffd60a"></div>'+
      '<div class="cinfo"><div class="cname">'+esc(v.label)+'</div><div class="cnote">'+esc(v.cuenta)+(v.nota?' · '+esc(v.nota):'')+'</div></div>'+
      '<div class="camt">'+fmt(v.monto)+'</div>'+
      '<div class="swipe-reveal"><button class="xbtn" onclick="editV('+i+')">editar</button><button class="xbtn red" onclick="delV('+i+')">✕</button></div>'+
    '</div>';
  });
  document.getElementById('varList').innerHTML=vhtml||'<div class="empty">Sin gastos variables este mes</div>';
  initSwipe();
}

function togglePaid(k,lbl,isC){
  var d=S.data[ci];var pk=mk(d)+'_'+k+'_paid';if(!S.paid)S.paid={};
  if(S.paid[pk]){delete S.paid[pk];toast('Marcado como pendiente');}
  else{S.paid[pk]={who:S.whoAmI||'Erick',ts:Date.now()};addHist(S.whoAmI||'Erick','confirmó pago de',lbl);toast('✅ '+lbl+' pagado por '+(S.whoAmI||'Erick'));}
  save();render();
}
function addComment(k,lbl){
  if(!S.comments)S.comments={};
  var cur=S.comments[mk(S.data[ci])+'_'+k]||'';
  openM('Comentario: '+lbl,'<div><div class="flabel">Comentario</div><input id="cmtV" value="'+esc(cur)+'" placeholder="Ej: subió por el frío"/></div>',
    function(){var val=document.getElementById('cmtV').value.trim();var ck=mk(S.data[ci])+'_'+k;if(val)S.comments[ck]=val;else delete S.comments[ck];closeM();save();toast('Comentario guardado');render();}
  );
}
function editClientNum(k,lbl){
  if(!S.clientNums)S.clientNums={};
  var cur=S.clientNums[k]||'';
  openM('N° cliente: '+lbl,'<div><div class="flabel">Número de cliente</div><input id="cnV" value="'+esc(cur)+'" placeholder="Ej: 000008050222" inputmode="numeric"/></div>',
    function(){var val=document.getElementById('cnV').value.trim();if(val)S.clientNums[k]=val;else delete S.clientNums[k];closeM();save();toast('Número guardado');render();}
  );
}
function editG(k,isC){
  var d=S.data[ci];var ec=isC?S.cuentas.find(function(c){return c.id===k.slice(2);}):null;
  var curLbl=isC?ec.label:(S.cats[k]?S.cats[k].label:k);
  var curVal=isC?ec.monto:(d.cats[k]||0);
  openM('Editar gasto',
    '<div><div class="flabel">Nombre</div><input id="eN" value="'+esc(curLbl)+'"/></div>'+
    '<div><div class="flabel">Monto ($)</div><input id="eV" type="number" value="'+curVal+'"/></div>'+
    (!isC?'<button type="button" id="delCatBtn" class="btn btn-danger" style="width:100%;margin-top:8px;font-size:13px;padding:12px;">🗑 Eliminar este gasto del mes</button>':''),
    function(){
      var n=document.getElementById('eN').value.trim();var v=parseFloat(document.getElementById('eV').value)||0;
      if(!n){toast('Escribe un nombre');return;}
      if(isC){ec.label=n;ec.monto=v;}else{if(S.cats[k])S.cats[k].label=n;d.cats[k]=v;}
      var who=S.whoAmI||'Erick';
      if(curLbl!==n)addHist(who,'renombró',curLbl+' → '+n);
      if(curVal!==v)addHist(who,'editó '+n,fmt(curVal)+' → '+fmt(v));
      closeM();save();toast('Guardado ✓');render();
    }
  );
  if(!isC){
    setTimeout(function(){
      var btn=document.getElementById('delCatBtn');
      if(btn)btn.addEventListener('click',function(){deleteCatFromMonth(k);});
    },50);
  }
}
function deleteCatFromMonth(k){
  var d=S.data[ci];var lbl=S.cats[k]?S.cats[k].label:k;
  var baseCats=['aguaCasa','luzCasa'];
  var isBase=baseCats.indexOf(k)!==-1;
  if(isBase){
    if(!confirm('\u00bfPoner "'+lbl+'" en $0 este mes?'))return;
    d.cats[k]=0;
  } else {
    if(!confirm('\u00bfEliminar "'+lbl+'" de '+MF[d.m-1]+' '+d.y+'?'))return;
    delete d.cats[k];
  }
  var mk2=mk(d);delete S.paid[mk2+'_'+k+'_paid'];delete S.comments[mk2+'_'+k];
  addHist(S.whoAmI||'Erick',isBase?'puso en $0':'elimin\u00f3 gasto',lbl+' de '+MF[d.m-1]);
  closeM();save();toast(isBase?lbl+' puesto en $0':lbl+' eliminado');render();
}
function addVar(){
  var n=document.getElementById('vN').value.trim(),m=parseFloat(document.getElementById('vM').value)||0;
  var c=document.getElementById('vC').value,o=document.getElementById('vO').value.trim();
  if(!n||!m){toast('Completa nombre y monto');return;}
  var k=mk(S.data[ci]);if(!S.vars[k])S.vars[k]=[];
  S.vars[k].push({id:Date.now().toString(),label:n,monto:m,cuenta:c,nota:o});
  document.getElementById('vN').value='';document.getElementById('vM').value='';document.getElementById('vO').value='';
  document.getElementById('fVar').classList.remove('on');
  addHist(S.whoAmI||'Erick','agregó gasto variable',n+' '+fmt(m));
  save();toast('Agregado ✓');render();
}
function editV(i){
  var k=mk(S.data[ci]),v=S.vars[k][i];
  openM('Editar variable',
    '<div><div class="flabel">Nombre</div><input id="evN" value="'+v.label+'"/></div>'+
    '<div><div class="flabel">Monto ($)</div><input id="evM" type="number" value="'+v.monto+'"/></div>'+
    '<div><div class="flabel">Nota</div><input id="evO" value="'+(v.nota||'')+'"/></div>',
    function(){var n=document.getElementById('evN').value.trim(),m=parseFloat(document.getElementById('evM').value)||0;
      if(!n){toast('Escribe un nombre');return;}
      v.label=n;v.monto=m;v.nota=document.getElementById('evO').value.trim();closeM();save();toast('Guardado ✓');render();}
  );
}
function delV(i){var k=mk(S.data[ci]);S.vars[k].splice(i,1);save();toast('Eliminado');render();}
function addCuenta(){
  var n=document.getElementById('ncN').value.trim(),m=parseFloat(document.getElementById('ncM').value)||0;
  var c=document.getElementById('ncC').value,col=document.getElementById('ncCol').value;
  if(!n||!m){toast('Completa nombre y monto');return;}
  var d=S.data[ci];
  S.cuentas.push({id:Date.now().toString(),label:n,monto:m,cuenta:c,color:col,fromY:d.y,fromM:d.m});
  document.getElementById('ncN').value='';document.getElementById('ncM').value='';
  document.getElementById('fCuenta').classList.remove('on');save();toast('Cuenta agregada ✓');render();
}
function editC(id){
  var c=S.cuentas.find(function(x){return x.id===id;});
  openM('Editar cuenta','<div><div class="flabel">Nombre</div><input id="ecN" value="'+c.label+'"/></div><div><div class="flabel">Monto ($)</div><input id="ecM" type="number" value="'+c.monto+'"/></div>',
    function(){var n=document.getElementById('ecN').value.trim(),m=parseFloat(document.getElementById('ecM').value)||0;if(!n){toast('Escribe un nombre');return;}c.label=n;c.monto=m;closeM();save();toast('Guardado ✓');render();}
  );
}
function delC(id){S.cuentas=S.cuentas.filter(function(c){return c.id!==id;});save();toast('Eliminada');render();}

function renderComp(d,prev){
  var t=tot(d),pt=prev?tot(prev):0,df=t-pt;
  var pct=pt?Math.round(Math.abs(df)/pt*100):0;
  var pl=prev?MF[prev.m-1]+' '+prev.y:'mes anterior';
  var color=df>0?'var(--red)':df<0?'var(--green)':'var(--amber)';
  document.getElementById('compHeader').innerHTML='<div class="met-l">Variación vs '+pl+'</div><div class="met-v" style="color:'+color+'">'+(df>0?'+':'')+fmt(df)+'</div><div class="met-s">'+(df===0?'Sin cambio':df>0?'▲ '+pct+'% más':'▼ '+pct+'% menos')+'</div>';
  if(!prev){document.getElementById('compList').innerHTML='<div class="empty">No hay mes anterior</div>';return;}
  var ks=new Set(Object.keys(d.cats).concat(Object.keys(prev.cats)));
  var rows=[];ks.forEach(function(k){var c=d.cats[k]||0,p=prev.cats[k]||0;if(c||p)rows.push({k:k,c:c,p:p,d:c-p});});
  rows.sort(function(a,b){return Math.abs(b.d)-Math.abs(a.d);});
  var mx=Math.max.apply(null,rows.map(function(r){return Math.max(r.c,r.p);}))||1;
  var html='';
  rows.forEach(function(r){
    var lbl=S.cats[r.k]?S.cats[r.k].label:r.k,col=S.cats[r.k]?S.cats[r.k].color:'#888';
    var pf=Math.round(r.c/mx*100);
    var ds=r.d===0?'<span style="color:var(--text3)">—</span>':r.d>0?'<span style="color:var(--red)">+'+fmt(r.d)+'</span>':'<span style="color:var(--green)">'+fmt(r.d)+'</span>';
    html+='<div class="crow" style="gap:7px;"><div class="cdot" style="background:'+col+'"></div><div style="flex:1;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(lbl)+'</div><div class="cbar"><div class="cbarf" style="width:'+pf+'%;background:'+col+'"></div></div><div style="font-size:11px;font-weight:600;min-width:66px;text-align:right;">'+fmt(r.c)+'</div><div style="font-size:10px;min-width:52px;text-align:right;">'+ds+'</div></div>';
  });
  document.getElementById('compList').innerHTML=html||'<div class="empty">Sin datos</div>';
}

function renderPie(d){
  var es=Object.entries(d.cats).filter(function(e){return e[1]>0;});
  cuentasForMonth(d).forEach(function(c){es.push(['__'+c.id,c.monto]);});
  (S.vars[mk(d)]||[]).forEach(function(v){es.push(['_v_'+v.id,v.monto]);});
  es.sort(function(a,b){return b[1]-a[1];});
  var t=es.reduce(function(a,e){return a+e[1];},0)||1;
  var lbls=es.map(function(e){var k=e[0];if(k.startsWith('_v_'))return 'Variable';if(k.startsWith('__')){var ec=S.cuentas.find(function(c){return c.id===k.slice(2);});return ec?ec.label:k;}return S.cats[k]?S.cats[k].label:k;});
  var vals=es.map(function(e){return e[1];});
  var cols=es.map(function(e){var k=e[0];if(k.startsWith('_v_'))return '#ffd60a';if(k.startsWith('__')){var ec=S.cuentas.find(function(c){return c.id===k.slice(2);});return ec?ec.color:'#888';}return S.cats[k]?S.cats[k].color:'#888';});
  if(pieChart)pieChart.destroy();
  pieChart=new Chart(document.getElementById('pieChart'),{type:'doughnut',data:{labels:lbls,datasets:[{data:vals,backgroundColor:cols,borderWidth:2,borderColor:'#1a1a1a'}]},options:{responsive:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return ' '+fmt(c.raw)+' ('+Math.round(c.raw/t*100)+'%)';}}}},cutout:'62%'}});
  var lgd='';es.forEach(function(e,i){lgd+='<div class="plr"><div class="pld" style="background:'+cols[i]+'"></div><div class="pln">'+esc(lbls[i])+'</div><div class="plp">'+Math.round(e[1]/t*100)+'%</div><div class="pla">'+fmt(e[1])+'</div></div>';});
  document.getElementById('pieLgd').innerHTML=lgd;
}

function renderSplit(d){
  var allCats=Object.entries(d.cats);
  var paidCount=allCats.filter(function(e){return S.paid&&S.paid[mk(d)+'_'+e[0]+'_paid'];}).length;
  var total=allCats.length;var pct=total?Math.round(paidCount/total*100):0;
  document.getElementById('paidSummary').innerHTML='<div style="padding:12px 13px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><span style="font-size:12px;color:var(--text2);">'+paidCount+' de '+total+' gastos confirmados</span><span style="font-size:12px;font-weight:600;color:'+(pct===100?'var(--green)':'var(--text)')+'">'+pct+'%</span></div><div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:'+(pct===100?'var(--green)':'var(--accent)')+';border-radius:3px;transition:width .4s;"></div></div>'+(pct===100?'<div style="font-size:11px;color:var(--green);margin-top:8px;text-align:center;">✅ Todos confirmados</div>':'')+'</div>';
  var html='';S.cuentas.forEach(function(c){
    var fromLabel=c.fromY?(' · desde '+MF[c.fromM-1]+' '+c.fromY):'';
    var active=!c.fromY||(d.y>c.fromY||(d.y===c.fromY&&d.m>=c.fromM));
    html+='<div class="crow" style="opacity:'+(active?1:0.45)+'"><div class="cdot" style="background:'+c.color+'"></div><div class="cinfo"><div class="cname">'+esc(c.label)+'</div><div class="cnote">'+esc(c.cuenta)+esc(fromLabel)+'</div></div><div class="camt">'+(active?fmt(c.monto):'—')+'</div><div class="acts"><button class="xbtn" onclick="editC(\''+esc(c.id)+'\')">editar</button><button class="xbtn red" onclick="delC(\''+esc(c.id)+'\')">✕</button></div></div>';
  });
  document.getElementById('cuentasList').innerHTML=html||'<div class="empty">Sin cuentas adicionales</div>';
}

function renderTrend(){
  var lbls=S.data.map(function(d){return MS[d.m-1]+' '+String(d.y).slice(2);});
  var tots=S.data.map(function(d){return tot(d);});var pp=tots.map(function(t){return Math.round(t/2);});
  if(tChart)tChart.destroy();
  tChart=new Chart(document.getElementById('tChart'),{type:'line',data:{labels:lbls,datasets:[{label:'Total',data:tots,borderColor:'#4f9ef8',backgroundColor:'rgba(79,158,248,.06)',borderWidth:2,pointRadius:2,tension:.35,fill:true},{label:'Por persona',data:pp,borderColor:'#7b6ef6',borderWidth:1.5,borderDash:[4,3],pointRadius:1.5,tension:.35,fill:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return fmt(c.raw);}}}},scales:{x:{ticks:{color:'#505050',font:{size:8},maxRotation:45,autoSkip:true,maxTicksLimit:12},grid:{display:false}},y:{ticks:{color:'#505050',font:{size:9},callback:function(v){return '$'+Math.round(v/1000)+'k';}},grid:{color:'rgba(255,255,255,.04)'}}}}});
  var yrs=[...new Set(S.data.map(function(d){return d.y;}))];
  var html='';yrs.forEach(function(y){var yd=S.data.filter(function(d){return d.y===y;});var s=yd.reduce(function(a,d){return a+tot(d);},0);html+='<div class="yr-row"><span style="font-size:13px;font-weight:700;min-width:46px;">'+y+'</span><span style="flex:1;font-size:10px;color:var(--text2);">'+yd.length+' meses · prom '+fmt(Math.round(s/yd.length))+'</span><span style="font-size:12px;font-weight:700;">'+fmt(s)+'</span></div>';});
  document.getElementById('yearSummary').innerHTML=html;
}

function renderHist(){
  var hist=S.history||[];
  if(!hist.length){document.getElementById('histList').innerHTML='<div class="empty">Sin cambios registrados aún</div>';return;}
  var html='';hist.forEach(function(h){var d=new Date(h.ts);var ds=d.toLocaleDateString('es-CL',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});var color=h.who==='Erick'?'#4f9ef8':'#7b6ef6';html+='<div class="hrow"><div class="hinfo"><div class="hmsg"><strong style="color:'+color+'">'+esc(h.who)+'</strong> '+esc(h.action)+(h.detail?': <em>'+esc(h.detail)+'</em>':'')+'</div><div class="htime">'+ds+'</div></div></div>';});
  document.getElementById('histList').innerHTML=html;
}

function buildTxt(d,t){
  var mn=MF[d.m-1]+' '+d.y;var lines=['🏠 Casa Erick & Fran','📅 '+mn,'─'.repeat(26),'Gastos:'];
  Object.entries(d.cats).filter(function(e){return e[1]>0;}).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){var lbl=S.cats[e[0]]?S.cats[e[0]].label:e[0];lines.push('  '+lbl+': '+fmt(e[1]));});
  cuentasForMonth(d).forEach(function(c){lines.push('  '+c.label+': '+fmt(c.monto));});
  var vrs=S.vars[mk(d)]||[];if(vrs.length){lines.push('Variables:');vrs.forEach(function(v){lines.push('  '+v.label+': '+fmt(v.monto)+(v.nota?' ('+v.nota+')':''));});}
  lines.push('─'.repeat(26),'💰 Total: '+fmt(t),'→ Erick: '+fmt(t/2),'→ Fran:  '+fmt(t/2));
  return lines.join('\n');
}
function renderExp(d,t){
  document.getElementById('expPre').textContent=buildTxt(d,t);
  var html='<tr><th>Mes</th><th style="text-align:right">Total</th><th style="text-align:right">c/u</th></tr>';
  S.data.forEach(function(dd,i){var tt=tot(dd);html+='<tr class="'+(i===ci?'cur':'')+'"><td>'+MS[dd.m-1]+' '+dd.y+'</td><td style="text-align:right;font-weight:'+(i===ci?600:400)+'">'+fmt(tt)+'</td><td style="text-align:right;color:var(--text2)">'+fmt(tt/2)+'</td></tr>';});
  document.getElementById('allMths').innerHTML=html;
}
function copyExp(){var d=S.data[ci];navigator.clipboard.writeText(buildTxt(d,tot(d))).then(function(){toast('Copiado');}).catch(function(){toast('Error');});}
function shareExp(){var d=S.data[ci],txt=buildTxt(d,tot(d));if(navigator.share)navigator.share({title:'Casa E&F',text:txt});else copyExp();}
function dlCSV(){var rows=['Mes,Total,Erick,Fran'];S.data.forEach(function(d){var t=tot(d);rows.push(MF[d.m-1]+' '+d.y+','+t+','+Math.round(t/2)+','+Math.round(t/2));});var b=new Blob([rows.join('\n')],{type:'text/csv'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='casa_ef.csv';a.click();URL.revokeObjectURL(u);toast('CSV descargado');}

function renderAj(){
  var savedEmail='';try{savedEmail=localStorage.getItem('casaEF_email')||'';}catch(e){}
  var nameEl=document.getElementById('sessionName');var emailEl=document.getElementById('sessionEmail');
  if(nameEl)nameEl.textContent=S.whoAmI||'—';if(emailEl)emailEl.textContent=savedEmail||'—';
  document.getElementById('remDay').value=S.remDay||25;updateWhoUI();
  var nl='';Object.entries(S.cats).forEach(function(e){nl+='<div class="crow"><div class="cdot" style="background:'+e[1].color+'"></div><div class="cinfo"><div class="cname">'+esc(e[1].label)+'</div></div><div class="acts"><button class="xbtn" onclick="renG(\''+esc(e[0])+'\')">renombrar</button></div></div>';});
  document.getElementById('namesList').innerHTML=nl;
  var catCnKeys=['electricidad','agua','gas','internet','luzCasa','aguaCasa','internetCasa','dividendo','arriendo','cocina'];
  var nums=S.clientNums||{};var cl='';
  catCnKeys.forEach(function(k){if(!S.cats[k])return;var num=nums[k]||'';cl+='<div class="crow"><div class="cdot" style="background:'+S.cats[k].color+'"></div><div class="cinfo"><div class="cname">'+esc(S.cats[k].label)+'</div>'+(num?'<div class="cnote">🔢 '+esc(num)+'</div>':'<div class="cnote" style="color:var(--text3)">Sin número</div>')+'</div><div class="acts"><button class="xbtn" onclick="editClientNum(\''+esc(k)+'\',\''+esc(S.cats[k].label).replace(/&#39;/g,"\\'")+'\')">'+esc(num?'editar':'+ agregar')+'</button></div></div>';});
  document.getElementById('clientNumsList').innerHTML=cl;
}
function renG(k){openM('Renombrar','<div><div class="flabel">Nuevo nombre</div><input id="rnN" value="'+esc(S.cats[k].label)+'"/></div>',function(){var n=document.getElementById('rnN').value.trim();if(!n){toast('Escribe un nombre');return;}S.cats[k].label=n;closeM();save();toast('Actualizado ✓');render();});}
function resetPrefs(){
  openM('Restablecer preferencias',
    '<div style="text-align:center;padding:8px 0;">'+
    '<div style="font-size:28px;margin-bottom:10px;">⚙️</div>'+
    '<div style="font-size:13px;font-weight:600;margin-bottom:6px;">¿Restablecer preferencias?</div>'+
    '<div style="font-size:12px;color:var(--text2);line-height:1.5;">Se restablece el tema, quién usa el dispositivo y el día de pago.<br><strong>Los meses y gastos no se tocan.</strong></div></div>',
    function(){
      S.lightMode=false; S.whoAmI='Erick'; S.remDay=25;
      applyTheme(); closeM(); save(); toast('Preferencias restablecidas'); render();
    }
  );
}
function confirmDeleteAllData(){
  openM('⚠️ Borrar todo el historial',
    '<div style="text-align:center;padding:8px 0;">'+
    '<div style="font-size:28px;margin-bottom:10px;">🗑️</div>'+
    '<div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:8px;">Esta acción no se puede deshacer</div>'+
    '<div style="font-size:12px;color:var(--text2);line-height:1.5;margin-bottom:12px;">Se borrarán TODOS los meses, gastos, pagos y comentarios registrados en Firebase y en este dispositivo.</div>'+
    '<div class="flabel" style="margin-bottom:4px;">Escribe BORRAR para confirmar</div>'+
    '<input id="deleteConfirmInput" placeholder="BORRAR" style="text-align:center;font-weight:700;"/>'+
    '</div>',
    function(){
      var val=document.getElementById('deleteConfirmInput').value.trim();
      if(val!=='BORRAR'){toast('Escribe BORRAR para confirmar');return;}
      try{localStorage.removeItem('casaEF_v5');localStorage.removeItem('casaEF_v5_ts');}catch(e){}
      S={data:[],cats:JSON.parse(JSON.stringify(DC)),cuentas:[],vars:{},paid:{},comments:{},clientNums:Object.assign({},DEFAULT_CLIENT_NUMS),history:[],remDay:25,whoAmI:S.whoAmI,lightMode:S.lightMode};
      closeM(); save(); toast('Datos borrados'); openAddMonth();
    }
  );
}

// Safety net: si init() falla, ocultar la pantalla de carga igual
window.addEventListener('error', function() {
  var ls = document.getElementById('loadingScreen');
  if (ls) ls.classList.add('hide');
});

console.log('Casa EF v5.0 loaded');
try { init(); } catch(e) {
  console.error('init failed:', e);
  var ls = document.getElementById('loadingScreen');
  if (ls) ls.classList.add('hide');
}
