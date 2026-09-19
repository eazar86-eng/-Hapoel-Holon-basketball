import './style.css';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';
import { LocalNotifications } from '@capacitor/local-notifications';
import { createClient } from '@supabase/supabase-js';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);

const SITE='https://eazar86-eng.github.io/-Hapoel-Holon-basketball/';
const state={tab:'home',schedule:null,league:null,team:null,updates:[],error:null};
const SUPABASE_URL='https://yistkmkezrhuggvipqnh.supabase.co';
const SUPABASE_KEY='sb_publishable_AmKSJPWaCc9ZFhk4OAR8Zw_yWng1qLc';
const app=document.getElementById('app');

async function json(name){
  const r=await fetch(SITE+name,{cache:'no-store'});
  if(!r.ok) throw new Error(name);
  return r.json();
}
function dateHe(d){return new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'numeric'}).format(new Date(d+'T12:00:00+03:00'))}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function nextEvent(){
  if(!state.schedule) return null;
  const now=new Date();
  return state.schedule.events.map(e=>({...e,dt:new Date(e.date+'T'+e.start+':00+03:00')})).find(e=>e.dt>=now) || null;
}
function ourLeague(){
  if(!state.league) return {};
  return state.league.table.find(x=>x.team===state.league.teamName)||{};
}
function nav(){
  return `<nav class="tabbar">
    ${[['home','⌂','בית'],['schedule','▦','לו״ז'],['games','🏀','משחקים'],['team','👥','קבוצה'],['more','•••','עוד']].map(([id,ico,label])=>`<button class="tab ${state.tab===id?'active':''}" data-tab="${id}"><b>${ico}</b>${label}</button>`).join('')}
  </nav>`;
}
function top(){
  return `<header class="topbar"><div class="brand"><img src="${SITE}youth-logo.svg" alt="סמל הפועל חולון נוער"><div><small>הפועל חולון נוער</small><strong>הפועל ״אבי״ חולון</strong></div></div></header>`;
}
function home(){
  const e=nextEvent(),l=ourLeague();
  return `<main class="container">
    <section class="hero-card"><div class="eyebrow">הפעילות הקרובה</div><h2>${e?e.type:'אין פעילות קרובה'}</h2><p>${e?dateHe(e.date)+' · '+e.start+'–'+e.end+' · '+e.place:'המערכת תתעדכן עם פרסום הלו״ז הבא.'}</p>${e?.note?'<p><strong>'+e.note+'</strong></p>':''}</section>
    <div class="kpis"><div class="kpi"><strong>${state.schedule?.week??'–'}</strong><span>שבוע</span></div><div class="kpi"><strong>${l.gp??0}</strong><span>משחקי ליגה</span></div><div class="kpi"><strong>${l.pts??0}</strong><span>נקודות</span></div></div>
    <div class="section">גישה מהירה</div><div class="grid">
      <button class="action" data-tab="schedule">📅 השבוע שלי<small>מערכת הקבוצה המעודכנת</small></button>
      <button class="action" data-tab="games">🏆 משחקים וטבלה<small>מידע רשמי מהאיגוד</small></button>
      <button class="action" data-open="avi-cohen.html">🕯️ אבי כהן ז״ל<small>האדם שעל שמו נקראת הקבוצה</small></button>
      <button class="action" data-open="dress-code.html">👕 קוד לבוש<small>נהלי הגעה וייצוג הקבוצה</small></button>
    </div>
    <div class="section">עדכונים חיים</div><div class="card"><strong>${state.updates[0]?.title||'אין עדכון חדש'}</strong><div class="muted">${state.updates[0]?.body||'המערכת מסונכרנת למקורות הרשמיים.'}</div></div><div class="section">מקורות חיים</div><div class="notice">הלו״ז נבדק מול אתר מחלקת הנוער, והליגה והתוצאות מול איגוד הכדורסל. האפליקציה אינה מציגה תמונות או פרטים אישיים רגישים של שחקנים.</div>
    <div class="source">לו״ז: סנכרון ${state.schedule?.syncedAt||'–'} · ליגה: סנכרון ${state.league?.syncedAt||'–'}</div>
  </main>`;
}
function schedule(){
  const ev=state.schedule?.events||[];
  return `<main class="container"><div class="section">שבוע ${state.schedule?.week??''}</div>
  ${ev.length?ev.map(e=>`<div class="card event"><div class="time">${e.start}</div><div class="event-main"><strong>${e.type}</strong><span class="muted">${dateHe(e.date)} · ${e.end} · ${e.place}</span>${e.note?'<span class="muted"><b>'+e.note+'</b></span>':''}</div></div>`).join(''):'<div class="empty">אין כרגע מערכת זמינה</div>'}
  <div class="buttons"><button class="primary-btn" id="weekReminder">🔔 תזכורת לפעילות הבאה</button><button class="ghost-btn" data-open="week-06.html">פתח לו״ז מלא</button></div>
  <div class="source">מקור: ${state.schedule?.sourceName||'מחלקת הנוער'}</div></main>`;
}
function games(){
  const l=ourLeague(),fixtures=state.league?.officialFixtures||[],results=state.league?.results||[];
  return `<main class="container"><div class="kpis"><div class="kpi"><strong>${l.gp??0}</strong><span>משחקים</span></div><div class="kpi"><strong>${l.w??0}</strong><span>ניצחונות</span></div><div class="kpi"><strong>${l.pts??0}</strong><span>נקודות</span></div></div>
  <div class="section">משחקים רשמיים</div>${fixtures.length?fixtures.map(g=>`<div class="card"><strong>${g.home} · ${g.away}</strong><div class="muted">${g.date} · ${g.time||''}</div></div>`).join(''):'<div class="empty">איגוד הכדורסל עדיין לא פרסם משחקים רשמיים.</div>'}
  <div class="section">תוצאות</div>${results.length?results.map(g=>`<div class="card"><strong>${g.home} ${g.homeScore} : ${g.awayScore} ${g.away}</strong><div class="muted">${g.date}</div></div>`).join(''):'<div class="empty">עדיין אין תוצאות רשמיות.</div>'}
  <div class="buttons"><button class="primary-btn" data-open="league.html">טבלת הליגה המלאה</button><button class="ghost-btn" data-external="https://ibasketball.co.il/league/2026-153/">איגוד הכדורסל</button></div></main>`;
}
function team(){
  const roster=state.team?.roster||[];
  return `<main class="container"><div class="section">סגל הקבוצה</div>${roster.map(p=>`<div class="card"><span class="badge">#${p.number}</span> <strong>${p.name}</strong></div>`).join('')}
  <div class="section">צוות מקצועי</div>${(state.team?.staff||[]).map(s=>`<div class="card"><strong>${s.name}</strong><div class="muted">${s.role}</div></div>`).join('')}
  <div class="notice">הסגל הציבורי מוצג ללא תמונות, מספרי טלפון, מיילים או פרטים אישיים רגישים.</div></main>`;
}
function more(){
  return `<main class="container"><div class="section">עוד</div><div class="grid">
    <button class="action" data-open="season.html">📈 העונה שלנו<small>ציר זמן ומבט עונתי</small></button>
    <button class="action" data-open="messages.html">📢 הודעות<small>עדכוני הקבוצה</small></button>
    <button class="action" data-open="birthdays.html">🎂 ימי הולדת<small>יום וחודש בלבד</small></button>
    <button class="action" data-open="avi-cohen.html">🕯️ אבי כהן ז״ל<small>עמוד ההנצחה</small></button>
  </div><div class="section">פרטיות ותמיכה</div><div class="grid">
    <button class="action" data-open="app-privacy.html">🔒 פרטיות<small>מדיניות האפליקציה</small></button>
    <button class="action" data-open="app-support.html">❓ תמיכה<small>מידע ויצירת קשר</small></button>
  </div></main>`;
}
function render(){
  const body=state.error?'<main class="container"><div class="empty">לא ניתן לטעון כרגע את נתוני הקבוצה. נסה שוב בעוד מספר דקות.</div></main>':
    state.tab==='home'?home():state.tab==='schedule'?schedule():state.tab==='games'?games():state.tab==='team'?team():more();
  app.innerHTML=top()+body+nav();
  bind();
}
function tap(){if(Capacitor.isNativePlatform())Haptics.impact({style:ImpactStyle.Light}).catch(()=>{})}
function bind(){
  document.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tap();state.tab=el.dataset.tab;render();window.scrollTo(0,0)});
  document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>{tap();Browser.open({url:SITE+el.dataset.open})});
  document.querySelectorAll('[data-external]').forEach(el=>el.onclick=()=>{tap();Browser.open({url:el.dataset.external})});
  const rem=document.getElementById('weekReminder');if(rem)rem.onclick=async()=>{const e=nextEvent();if(!e)return;const p=await LocalNotifications.requestPermissions();if(p.display!=='granted')return;const when=new Date(e.date+'T'+e.start+':00+03:00');when.setHours(when.getHours()-2);if(when<=new Date())return;await LocalNotifications.schedule({notifications:[{id:6001,title:'הפועל ״אבי״ חולון',body:'בעוד שעתיים: '+e.type+' · '+e.start+' · '+e.place,schedule:{at:when},sound:'default'}]});rem.textContent='✓ תזכורת נקבעה';};
}
async function loadUpdates(){
  const {data,error}=await supabase.from('team_updates').select('id,title,body,update_type,related_date,created_at').eq('audience','public').eq('is_published',true).order('created_at',{ascending:false}).limit(10);
  if(!error&&data)state.updates=data;
}
async function boot(){
  app.innerHTML=top()+'<div class="loading">טוען את נתוני הקבוצה…</div>'+nav();
  try{[state.schedule,state.league,state.team]=await Promise.all([json('schedule-data.json'),json('league-data.json'),json('team-data.json')]);await loadUpdates();}catch(e){state.error=e}
  render();
}
boot();
