const list = document.getElementById('music-list');

/* NORMALIZADOR */
function norm(t){
  return String(t||'')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

/* GET ROBUSTO */
function get(track, keys){
  const map = {};
  Object.keys(track).forEach(k => map[norm(k)] = track[k]);
  for (let k of keys) {
    const v = map[norm(k)];
    if (v) return v;
  }
  return '—';
}

/* COLOR */
function color(v){
  v = norm(v);
  if (v.includes('seguro') || v.includes('cancion completa') || v.includes('full')) return 'green';
  if (v.includes('tal vez') || v.includes('punto medio') || v.includes('exclusiva')) return 'blue';
  if (v.includes('relleno') || v.includes('tu decides') || v.includes('rara')) return 'yellow';
  if (v.includes('ya') || v.includes('salteada') || v.includes('filtrada')) return 'red';
  return 'blue';
}

/* CARGA */
fetch('data.json')
.then(r => r.json())
.then(data => {
  data.forEach(track => {

    const id = String(get(track,['id','ID'])).padStart(2,'0');

    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.id = id;

    const titulo = get(track,['titulo','título']);
    const interes = get(track,['tipo de interes','tipo de interés']);
    const forma = get(track,['forma recomendada de escuchar']);
    const estado = get(track,['estado']);

    row.innerHTML = `
      <img src="images/${id}.jpg">
      <button class="play-btn">▶</button>

      <div class="track-info">
        <div class="track-title">${titulo}</div>

        <div class="badges">
          <span class="badge ${color(interes)}">${interes}</span>
          <span class="badge ${color(forma)}">${forma}</span>
          <span class="badge ${color(estado)}">${estado}</span>
        </div>

        <div class="track-meta">
          <div><strong>ARTISTAS:</strong> ${get(track,['artistas'])}</div>
          <div><strong>ÁLBUM:</strong> ${get(track,['album al que pertenece','album'])}
          · <strong>AÑO:</strong> ${get(track,['año','ano'])}
          · <strong>DURACIÓN:</strong> ${get(track,['duracion','duración'])}</div>
        </div>

        <div class="context-box">${get(track,['contexto'])}</div>

        <div class="track-meta">
          <strong>NOTA:</strong> ${get(track,['nota extra','nota'])}
        </div>
      </div>
    `;
    list.appendChild(row);
  });
});

/* PLAYER */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

document.addEventListener('click', e => {
  if (!e.target.classList.contains('play-btn')) return;
  const track = e.target.closest('.track');
  const id = track.dataset.id;

  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = track.querySelector('.track-title').textContent;

  audio.play();
  playPause.textContent = '⏸';
  player.classList.remove('hidden');
});

playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => audio.volume = volume.value;

/* FILTROS */
const fInteres = document.getElementById('filter-interes');
const fForma = document.getElementById('filter-forma');
const fEstado = document.getElementById('filter-estado');

function applyFilters(){
  const i = norm(fInteres.value);
  const f = norm(fForma.value);
  const e = norm(fEstado.value);

  document.querySelectorAll('.track').forEach(t => {
    const badges = t.querySelectorAll('.badge');
    const ok =
      (!i || norm(badges[0].textContent).includes(i)) &&
      (!f || norm(badges[1].textContent).includes(f)) &&
      (!e || norm(badges[2].textContent).includes(e));
    t.style.display = ok ? '' : 'none';
  });
}

fInteres.onchange = applyFilters;
fForma.onchange = applyFilters;
fEstado.onchange = applyFilters;

/* GUÍA */
const guide = document.getElementById('guide-modal');
document.getElementById('open-guide').onclick = e => { e.preventDefault(); guide.classList.remove('hidden'); };
document.getElementById('close-guide').onclick = () => guide.classList.add('hidden');
