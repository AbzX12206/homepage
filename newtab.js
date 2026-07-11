/* ---------- clock ---------- */
function updateClock(){
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  document.getElementById('day').textContent = days[now.getDay()];
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
   можешь добавлять/убирать/менять ссылки тут
*/
const LINKS = [
  {name:'gmail',       url:'https://mail.google.com',   icon:'fa-solid fa-envelope',        color:'#ea4335'},
  {name:'whatsapp',    url:'https://web.whatsapp.com',  icon:'fa-brands fa-whatsapp',       color:'#25d366'},
  {name:'github',      url:'https://github.com',        icon:'fa-brands fa-github',         color:'#6e5494'},
  {name:'youtube',     url:'https://youtube.com',       icon:'fa-brands fa-youtube',        color:'#e0245e'},
  {name:'reddit',      url:'https://reddit.com',        icon:'fa-brands fa-reddit',         color:'#f5821f'},
  {name:'x',           url:'https://x.com',              icon:'fa-brands fa-x-twitter',      color:'#ccc'},
  {name:'chatgpt',     url:'https://chat.openai.com',   icon:'fa-solid fa-robot',           color:'#10a37f'},
  {name:'gemini',      url:'https://gemini.google.com', icon:'fa-solid fa-star',            color:'#3b5fe0'},
  {name:'claude',      url:'https://claude.ai',         icon:'fa-solid fa-asterisk',        color:'#d97757'},
  {name:'perplexity',  url:'https://perplexity.ai',     icon:'fa-solid fa-magnifying-glass',color:'#22b8cf'},
  {name:'lichess',     url:'https://lichess.org',       icon:'fa-solid fa-chess-knight',    color:'#999'},
  {name:'anilib',      url:'https://animelib.org',      icon:'fa-solid fa-tv',              color:'#9b59ff'},
  {name:'yahoo finance', url:'https://finance.yahoo.com', icon:'fa-brands fa-yahoo',        color:'#6001d2'},
  {name:'translate',   url:'https://translate.google.com', icon:'fa-solid fa-language',     color:'#4285f4'}
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
