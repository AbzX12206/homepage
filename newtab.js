/* ---------- clock + greeting ---------- */
function greetingFor(hour){
  if (hour < 5)  return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  if (hour < 22) return 'Good evening';
  return 'Good night';
}
function updateClock(){
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  document.getElementById('greeting').textContent = greetingFor(h);
  h = h % 12; if(h === 0) h = 12;
  document.getElementById('time').textContent =
    `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000*10);

/* ---------- calendar ---------- */
function renderCalendar(){
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const dowNames = ['Mo','Tu','We','Th','Fr','Sa','Su'];

  document.getElementById('cal-header').textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  dowNames.forEach(d => {
    const el = document.createElement('div');
    el.className = 'dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1);
  // convert Sunday=0..Saturday=6 to Monday-first index 0..6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'day';
    if (d === now.getDate()) el.classList.add('today');
    el.textContent = d;
    grid.appendChild(el);
  }
}
renderCalendar();
setInterval(renderCalendar, 1000*60*60);

/* ---------- week progress indicator (Mon-Sun) ---------- */
function renderWeekProgress(){
  const el = document.getElementById('week-progress');
  el.innerHTML = '';
  const now = new Date();
  let todayIdx = now.getDay() - 1; // Monday-first: 0..6
  if (todayIdx < 0) todayIdx = 6;

  for (let i = 0; i < 7; i++){
    const seg = document.createElement('div');
    seg.className = 'seg';
    if (i < todayIdx) seg.classList.add('past');
    if (i === todayIdx) seg.classList.add('today');
    el.appendChild(seg);
  }
}
renderWeekProgress();
setInterval(renderWeekProgress, 1000*60*60);

/* ---------- weather (Open-Meteo, no API key needed) ---------- */
const WMO_ICONS = {
  0:['fa-sun','Clear sky'],
  1:['fa-cloud-sun','Mainly clear'],
  2:['fa-cloud-sun','Partly cloudy'],
  3:['fa-cloud','Overcast'],
  45:['fa-smog','Fog'],
  48:['fa-smog','Fog'],
  51:['fa-cloud-rain','Light drizzle'],
  53:['fa-cloud-rain','Drizzle'],
  55:['fa-cloud-rain','Heavy drizzle'],
  61:['fa-cloud-showers-heavy','Light rain'],
  63:['fa-cloud-showers-heavy','Rain'],
  65:['fa-cloud-showers-heavy','Heavy rain'],
  71:['fa-snowflake','Light snow'],
  73:['fa-snowflake','Snow'],
  75:['fa-snowflake','Heavy snow'],
  80:['fa-cloud-showers-heavy','Rain showers'],
  81:['fa-cloud-showers-heavy','Rain showers'],
  82:['fa-cloud-showers-heavy','Violent showers'],
  95:['fa-bolt','Thunderstorm'],
  96:['fa-bolt','Thunderstorm'],
  99:['fa-bolt','Thunderstorm']
};
const DEFAULT_COORDS = {lat:43.65, lon:51.1667, name:'Aqtau'}; // fallback if geolocation is unavailable

async function renderWeather(lat, lon, placeName){
  const el = document.getElementById('weather');
  try{
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`);
    const data = await res.json();
    const code = data.current.weather_code;
    const temp = Math.round(data.current.temperature_2m);
    const [icon, desc] = WMO_ICONS[code] || ['fa-cloud', 'Unknown'];

    let place = placeName;
    if (!place){
      try{
        const geoRes = await fetch(`https://api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`);
        const geoData = await geoRes.json();
        place = geoData?.results?.[0]?.name || '';
      }catch(e){ place = ''; }
    }

    el.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div class="info">
        <div class="temp">${temp}°C</div>
        <div class="desc">${desc}</div>
        ${place ? `<div class="place">${place}</div>` : ''}
      </div>
    `;
  }catch(e){
    el.innerHTML = `<i class="fa-solid fa-cloud-question"></i><div class="info"><div class="desc">Unavailable</div></div>`;
  }
}

if (navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    pos => renderWeather(pos.coords.latitude, pos.coords.longitude),
    () => renderWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name),
    {timeout:5000}
  );
}else{
  renderWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
}

/* ---------- quick links ----------
   icon: any Font Awesome class (fa-brands / fa-solid)
   order below = display order, top to bottom
*/
const LINKS = [
  {name:'youtube',    url:'https://youtube.com',          icon:'fa-brands fa-youtube',  color:'#e0245e'},
  {name:'reddit',     url:'https://reddit.com',           icon:'fa-brands fa-reddit',   color:'#f5821f'},
  {name:'x',          url:'https://x.com',                icon:'fa-brands fa-x-twitter',color:'#ccc'},
  {name:'anilib',     url:'https://animelib.org',         icon:'fa-solid fa-tv',        color:'#9b59ff'},
  {name:'whatsapp',   url:'https://web.whatsapp.com',     icon:'fa-brands fa-whatsapp', color:'#25d366'},
  {name:'gmail',      url:'https://mail.google.com',      icon:'fa-solid fa-envelope',  color:'#ea4335'},
  {name:'claude',     url:'https://claude.ai',            icon:'fa-solid fa-asterisk',  color:'#d97757'},
  {name:'gemini',     url:'https://gemini.google.com',    icon:'fa-solid fa-star',      color:'#3b5fe0'},
  {name:'chatgpt',    url:'https://chat.openai.com',      icon:'fa-solid fa-robot',     color:'#10a37f'},
  {name:'github',     url:'https://github.com',           icon:'fa-brands fa-github',   color:'#6e5494'},
  {name:'rutracker',  url:'https://rutracker.org',        icon:'fa-solid fa-magnet',    color:'#e8a33d'},
  {name:'translate',  url:'https://translate.google.com', icon:'fa-solid fa-language',  color:'#4285f4'}
];

const linksEl = document.getElementById('links');
LINKS.forEach(l => {
  const a = document.createElement('a');
  a.className = 'link-item';
  a.href = l.url;
  a.style.setProperty('--accent', l.color);
  a.innerHTML = `<i class="${l.icon}"></i><span>${l.name}</span>`;
  linksEl.appendChild(a);
});

/* ---------- quick note (saved locally via chrome.storage) ---------- */
const noteInput = document.getElementById('note-input');
let noteSaveTimer = null;

if (chrome?.storage?.local){
  chrome.storage.local.get(['quickNote'], (result) => {
    noteInput.value = result.quickNote || '';
  });
  noteInput.addEventListener('input', () => {
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(() => {
      chrome.storage.local.set({quickNote: noteInput.value});
    }, 400); // debounce so we're not writing on every keystroke
  });
}

/* ---------- search via DuckDuckGo ---------- */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(searchInput.value.trim())}`;
  }
});

/* ---------- 1-9 keys open the first 9 links (no on-screen hints, just muscle memory) ---------- */
document.addEventListener('keydown', (e) => {
  if (document.activeElement === searchInput || document.activeElement === noteInput) return; // don't hijack typing
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9 && LINKS[n - 1]) {
    window.location.href = LINKS[n - 1].url;
  }
});

/* ---------- hide links + calendar/weather when idle ---------- */
let idleTimer = null;
const IDLE_DELAY = 3000; // 3s with no mouse/keyboard activity

function goIdle(){
  document.body.classList.add('idle');
}
function resetIdle(){
  document.body.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(goIdle, IDLE_DELAY);
}
['mousemove','mousedown','keydown','wheel','touchstart'].forEach(ev =>
  document.addEventListener(ev, resetIdle, {passive:true})
);
resetIdle();
