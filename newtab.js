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

/* ---------- quick links ----------
   icon: любой класс Font Awesome (fa-brands / fa-solid)
   можешь добавлять/убирать/менять ссылки тут
*/
const LINKS = [
  {name:'github',     url:'https://github.com',        icon:'fa-brands fa-github',         color:'#6e5494'},
  {name:'youtube',    url:'https://youtube.com',       icon:'fa-brands fa-youtube',        color:'#e0245e'},
  {name:'reddit',     url:'https://reddit.com',        icon:'fa-brands fa-reddit',         color:'#f5821f'},
  {name:'x',          url:'https://x.com',              icon:'fa-brands fa-x-twitter',      color:'#666'},
  {name:'chatgpt',    url:'https://chat.openai.com',   icon:'fa-solid fa-robot',           color:'#10a37f'},
  {name:'gemini',     url:'https://gemini.google.com', icon:'fa-solid fa-star',            color:'#3b5fe0'},
  {name:'claude',     url:'https://claude.ai',         icon:'fa-solid fa-asterisk',        color:'#d97757'},
  {name:'perplexity', url:'https://perplexity.ai',     icon:'fa-solid fa-magnifying-glass',color:'#22b8cf'},
  {name:'lichess',    url:'https://lichess.org',       icon:'fa-solid fa-chess-knight',    color:'#777'},
  {name:'anilib',     url:'https://animelib.org',         icon:'fa-solid fa-tv',              color:'#9b59ff'}
];

const grid = document.getElementById('grid');
LINKS.forEach(l => {
  const a = document.createElement('a');
  a.className = 'tile';
  a.href = l.url;
  a.style.setProperty('--accent', l.color);
  a.innerHTML = `<i class="${l.icon}"></i><span>${l.name}</span>`;
  grid.appendChild(a);
});
