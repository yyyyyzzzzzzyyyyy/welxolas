const list = document.getElementById('music-list');

/* === FUNCIÓN ROBUSTA DE LECTURA === */
function get(track, keys) {
  const normalized = {};
  Object.keys(track).forEach(k => {
    normalized[k.toLowerCase().replace(/\s+/g,' ').trim()] = track[k];
  });

  for (let key of keys) {
    const clean = key.toLowerCase().replace(/\s+/g,' ').trim();
    if (normalized[clean]) return normalized[clean];
  }
  return '—';
}

/* === CARGA DE LISTA === */
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    data.forEach(track => {
      const id = String(track.ID).padStart(2,'0');

      const row = document.createElement('div');
      row.className = 'track';

      row.innerHTML = `
        <img src="images/${id}.jpg">
        <button class="play-btn">▶</button>

        <div class="track-info">
          <div class="track-title">${get(track,['TÍTULO','TITULO'])}</div>

          <div class="badges">
            <span class="badge interest">${get(track,['TIPO DE INTERÉS','TIPO DE INTERES'])}</span>
            <span class="badge listen">${get(track,['FORMA RECOMENDADA DE ESCUCHAR'])}</span>
            <span class="badge status">${get(track,['ESTADO'])}</span>
          </div>

          <div class="track-meta">
            <div><strong>ARTISTAS:</strong> ${get(track,['ARTISTAS'])}</div>
            <div>
              <strong>ÁLBUM:</strong> ${get(track,['ALBUM AL QUE PERTENECE','ALBUM'])}
              · <strong>AÑO:</strong> ${get(track,['AÑO','ANO'])}
              · <strong>DURACIÓN:</strong> ${get(track,['DURACION','DURACIÓN'])}
            </div>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${get(track,['CONTEXTO'])}
          </div>

          <div class="note-box">
            <strong>NOTA:</strong> ${get(track,['NOTA EXTRA','NOTA'])}
          </div>
        </div>
      `;

      row.querySelector('.play-btn').onclick = () => play(track,id);
      list.appendChild(row);
    });
  });

/* === REPRODUCTOR === */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');

const playPause = document.getElementById('play-pause');
const back10 = document.getElementById('back-10');
const forward10 = document.getElementById('forward-10');

const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');

function play(track,id){
  audio.src = `audio/${id}.mp3`;
  audio.play();
  cover.src = `images/${id}.jpg`;
  title.textContent = get(track,['TÍTULO','TITULO']);
  player.classList.remove('hidden');
  playPause.textContent = '⏸';
}

playPause.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = '⏸';
  } else {
    audio.pause();
    playPause.textContent = '▶';
  }
};

back10.onclick = () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
};

forward10.onclick = () => {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
};

volume.oninput = () => {
  audio.volume = volume.value;
};

audio.onloadedmetadata = () => {
  durationEl.textContent = formatTime(audio.duration);
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
