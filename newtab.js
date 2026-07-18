/* ---------- clock ---------- */
function updateClock(){
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
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
const DEFAULT_COORDS = {lat:51.5074, lon:-0.1278, name:'London'}; // fallback if geolocation is unavailable

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
      <div class="temp">${temp}°C</div>
      <div class="desc">${desc}</div>
      ${place ? `<div class="place">${place}</div>` : ''}
    `;
  }catch(e){
    el.innerHTML = `<i class="fa-solid fa-cloud-question"></i><div class="desc">Unavailable</div>`;
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
   group: section title the link is listed under (order = first appearance)
   add/remove/edit links here
*/
const LINKS = [
  {group:'Work',  name:'gmail',       url:'https://mail.google.com',      icon:'fa-solid fa-envelope',        color:'#ea4335'},
  {group:'Work',  name:'whatsapp',    url:'https://web.whatsapp.com',     icon:'fa-brands fa-whatsapp',       color:'#25d366'},
  {group:'Work',  name:'translate',   url:'https://translate.google.com', icon:'fa-solid fa-language',        color:'#4285f4'},

  {group:'AI',    name:'chatgpt',     url:'https://chat.openai.com',      icon:'fa-solid fa-robot',           color:'#10a37f'},
  {group:'AI',    name:'claude',      url:'https://claude.ai',            icon:'fa-solid fa-asterisk',        color:'#d97757'},
  {group:'AI',    name:'gemini',      url:'https://gemini.google.com',    icon:'fa-solid fa-star',            color:'#3b5fe0'},
  {group:'AI',    name:'perplexity',  url:'https://perplexity.ai',        icon:'fa-solid fa-magnifying-glass',color:'#22b8cf'},

  {group:'Media', name:'youtube',     url:'https://youtube.com',          icon:'fa-brands fa-youtube',        color:'#e0245e'},
  {group:'Media', name:'reddit',      url:'https://reddit.com',           icon:'fa-brands fa-reddit',         color:'#f5821f'},
  {group:'Media', name:'x',           url:'https://x.com',                icon:'fa-brands fa-x-twitter',      color:'#ccc'},
  {group:'Media', name:'lichess',     url:'https://lichess.org',          icon:'fa-solid fa-chess-knight',    color:'#999'},
  {group:'Media', name:'anilib',      url:'https://animelib.org',         icon:'fa-solid fa-tv',              color:'#9b59ff'},
  {group:'Media', name:'rutracker',   url:'https://rutracker.org',        icon:'fa-solid fa-magnet',          color:'#e8a33d'},

  {group:'Info',  name:'github',      url:'https://github.com',           icon:'fa-brands fa-github',         color:'#6e5494'},
  {group:'Info',  name:'yahoo finance', url:'https://finance.yahoo.com',  icon:'fa-brands fa-yahoo',          color:'#6001d2'}
];

const linksEl = document.getElementById('links');
const flatOrder = []; // for 1-9 keyboard shortcuts
let lastGroup = null;

LINKS.forEach(l => {
  if (l.group !== lastGroup){
    const title = document.createElement('div');
    title.className = 'group-title';
    title.textContent = l.group;
    linksEl.appendChild(title);
    lastGroup = l.group;
  }

  const a = document.createElement('a');
  a.className = 'link-item';
  a.href = l.url;
  a.style.setProperty('--accent', l.color);

  const num = flatOrder.length < 9 ? flatOrder.length + 1 : null;
  a.innerHTML = `<span class="kbd">${num ?? ''}</span><i class="${l.icon}"></i><span>${l.name}</span>`;
  flatOrder.push(l.url);

  linksEl.appendChild(a);
});

/* ---------- search via DuckDuckGo ---------- */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(searchInput.value.trim())}`;
  }
});

/* ---------- 1-9 keys open the first 9 links ---------- */
document.addEventListener('keydown', (e) => {
  if (document.activeElement === searchInput) return; // don't hijack typing in search
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9 && flatOrder[n - 1]) {
    window.location.href = flatOrder[n - 1];
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
