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

/* ---------- quick links ----------
   icon: любой класс Font Awesome (fa-brands / fa-solid)
   group: колонка, в которую попадёт ссылка (порядок групп = порядок первого появления)
   можешь добавлять/убирать/менять ссылки тут
*/
const LINKS = [
  {group:'Работа',  name:'gmail',       url:'https://mail.google.com',      icon:'fa-solid fa-envelope',        color:'#ea4335'},
  {group:'Работа',  name:'whatsapp',    url:'https://web.whatsapp.com',     icon:'fa-brands fa-whatsapp',       color:'#25d366'},
  {group:'Работа',  name:'translate',   url:'https://translate.google.com', icon:'fa-solid fa-language',        color:'#4285f4'},

  {group:'AI',      name:'chatgpt',     url:'https://chat.openai.com',      icon:'fa-solid fa-robot',           color:'#10a37f'},
  {group:'AI',      name:'claude',      url:'https://claude.ai',            icon:'fa-solid fa-asterisk',        color:'#d97757'},
  {group:'AI',      name:'gemini',      url:'https://gemini.google.com',    icon:'fa-solid fa-star',            color:'#3b5fe0'},
  {group:'AI',      name:'perplexity',  url:'https://perplexity.ai',        icon:'fa-solid fa-magnifying-glass',color:'#22b8cf'},

  {group:'Медиа',   name:'youtube',     url:'https://youtube.com',          icon:'fa-brands fa-youtube',        color:'#e0245e'},
  {group:'Медиа',   name:'reddit',      url:'https://reddit.com',           icon:'fa-brands fa-reddit',         color:'#f5821f'},
  {group:'Медиа',   name:'x',           url:'https://x.com',                icon:'fa-brands fa-x-twitter',      color:'#ccc'},
  {group:'Медиа',   name:'lichess',     url:'https://lichess.org',          icon:'fa-solid fa-chess-knight',    color:'#999'},
  {group:'Медиа',   name:'anilib',      url:'https://animelib.org',         icon:'fa-solid fa-tv',              color:'#9b59ff'},
  {group:'Медиа',   name:'rutracker',   url:'https://rutracker.org',        icon:'fa-solid fa-magnet',          color:'#e8a33d'},

  {group:'Инфо',    name:'github',      url:'https://github.com',           icon:'fa-brands fa-github',         color:'#6e5494'},
  {group:'Инфо',    name:'yahoo finance', url:'https://finance.yahoo.com',  icon:'fa-brands fa-yahoo',          color:'#6001d2'}
];

const linksEl = document.getElementById('links');
const columns = {};
const flatOrder = []; // для keyboard shortcuts 1-9

LINKS.forEach(l => {
  if (!columns[l.group]) {
    const col = document.createElement('div');
    col.className = 'link-col';
    const title = document.createElement('div');
    title.className = 'col-title';
    title.textContent = l.group;
    col.appendChild(title);
    columns[l.group] = col;
    linksEl.appendChild(col);
  }

  const a = document.createElement('a');
  a.className = 'link-item';
  a.href = l.url;
  a.style.setProperty('--accent', l.color);

  const num = flatOrder.length < 9 ? flatOrder.length + 1 : null;
  a.innerHTML = `<span class="kbd">${num ?? ''}</span><i class="${l.icon}"></i><span>${l.name}</span>`;
  flatOrder.push(l.url);

  columns[l.group].appendChild(a);
});

/* ---------- цифры 1-9 открывают первые 9 ссылок (по порядку колонок) ---------- */
document.addEventListener('keydown', (e) => {
  if (document.activeElement === searchInput) return; // не перехватывать ввод в поиске
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9 && flatOrder[n - 1]) {
    window.location.href = flatOrder[n - 1];
  }
});

/* ---------- поиск через DuckDuckGo ---------- */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(searchInput.value.trim())}`;
  }
});

/* ---------- скрытие ссылок и календаря при бездействии ---------- */
let idleTimer = null;
const IDLE_DELAY = 3000; // 3 сек без движения мыши/клавиатуры

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
