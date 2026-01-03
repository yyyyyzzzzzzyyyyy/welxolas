const list = document.getElementById('music-list');

function get(track, keys) {
  for (let k of keys) {
    if (track[k]) return track[k];
  }
  return '—';
}

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
          <div class="track-title">
            ${get(track, ['TÍTULO','TITULO'])}
          </div>

          <div class="badges">
            <span class="badge interest">${get(track,['TIPO DE INTERÉS','TIPO DE INTERES'])}</span>
            <span class="badge listen">${get(track,['FORMA RECOMENDADA DE ESCUCHAR'])}</span>
            <span class="badge status">${get(track,['ESTADO'])}</span>
          </div>

          <div class="track-meta">
            <div><strong>ARTISTAS:</strong> ${get(track,['ARTISTAS'])}</div>
            <div>
              <strong>ÁLBUM:</strong> ${get(track,['ALBUM','ALBUM AL QUE PERTENECE'])} ·
              <strong>AÑO:</strong> ${get(track,['AÑO','ANO'])} ·
              <strong>DURACIÓN:</strong> ${get(track,['DURACION','DURACIÓN'])}
            </div>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${get(track,['CONTEXTO'])}
          </div>

          <div class="note-box">
            <strong>NOTA:</strong> ${get(track,['NOTA EXTRA'])}
          </div>
        </div>
      `;

      list.appendChild(row);

      row.querySelector('.play-btn').onclick = () => play(track,id);
    });
  });

const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function play(track,id){
  audio.src = `audio/${id}.mp3`;
  audio.play();
  cover.src = `images/${id}.jpg`;
  title.textContent = get(track,['TÍTULO','TITULO']);
  player.classList.remove('hidden');
  playPause.textContent='⏸';
}

playPause.onclick=()=>{
  audio.paused?audio.play():audio.pause();
};
