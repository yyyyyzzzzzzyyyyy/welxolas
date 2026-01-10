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

/* GET */
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

let tracksData = [];

/* LOAD */
fetch('data.json')
.then(r => r.json())
.then(data => {
  tracksData = data;

  data.forEach((track, index) => {
    const id = String(get(track,['id','ID'])).padStart(2,'0');

    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.id = id;
    row.dataset.index = index;

    row.innerHTML = `
      <div class="track-id">${id}</div>
      <img src="images/${id}.jpg">
      <button class="play-btn">▶</button>

      <div class="track-info">
        <div class="track-title">${get(track,['titulo','título'])}</div>

        <div class="badges">
          <span class="badge ${color(get(track,['tipo de interes','tipo de interés']))}">
            ${get(track,['tipo de interes','tipo de interés'])}
          </span>
          <span class="badge ${color(get(track,['forma recomendada de escuchar']))}">
            ${get(track,['forma recomendada de escuchar'])}
          </span>
          <span class="badge ${color(get(track,['estado']))}">
            ${get(track,['estado'])}
          </span>
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

/* IMAGE MODAL */
const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');

document.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.closest('.track')) {
    imageModalImg.src = e.target.src;
    imageModal.classList.remove('hidden');
  }
});

document.getElementById('close-image').onclick = () =>
  imageModal.classList.add('hidden');

imageModal.onclick = e => {
  if (e.target === imageModal) imageModal.classList.add('hidden');
};

/* PLAYER */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const back10 = document.getElementById('back-10');
const forward10 = document.getElementById('forward-10');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

let currentIndex = null;

document.addEventListener('click', e => {
  if (!e.target.classList.contains('play-btn')) return;
  const track = e.target.closest('.track');
  playTrack(parseInt(track.dataset.index));
});

function playTrack(index){
  const track = tracksData[index];
  if (!track) return;

  const id = String(get(track,['id','ID'])).padStart(2,'0');
  currentIndex = index;

  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = get(track,['titulo','título']);

  audio.play();
  playPause.textContent = '⏸';
  player.classList.remove('hidden');
}

playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

back10.onclick = () => audio.currentTime = Math.max(0, audio.currentTime - 10);
forward10.onclick = () => audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => audio.currentTime = (progress.value / 100) * audio.duration;
volume.oninput = () => audio.volume = volume.value;

/* AUTO NEXT */
audio.onended = () => {
  if (currentIndex !== null) playTrack(currentIndex + 1);
};

/* FILTERS */
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

/* GUIDE */
const guide = document.getElementById('guide-modal');
document.getElementById('open-guide').onclick = e => { e.preventDefault(); guide.classList.remove('hidden'); };
document.getElementById('close-guide').onclick = () => guide.classList.add('hidden');
