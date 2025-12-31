const list = document.getElementById('music-list');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {
      const row = document.createElement('div');
      row.className = 'track';

      const img = document.createElement('img');
      img.src = track["ENLACE IMAGEN"] || '';
      row.appendChild(img);

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn';
      playBtn.textContent = '▶';
      row.appendChild(playBtn);

      const info = document.createElement('div');
      info.className = 'track-info';

      const meta = document.createElement('div');
      meta.className = 'track-meta';
      meta.innerHTML = `
        <div><strong>TÍTULO:</strong> ${track["TÍTULO"] || ''}</div>
        <div><strong>TIPO DE INTERÉS:</strong> ${track["TIPO DE INTERÉS"] || ''}</div>
        <div><strong>FORMA RECOMENDADA DE ESCUCHAR:</strong> ${track["FORMA RECOMENDADA DE ESCUCHAR"] || ''}</div>
        <div><strong>ESTADO:</strong> ${track["ESTADO"] || ''}</div>
        <div><strong>ÁLBUM AL QUE PERTENECE:</strong> ${track["ALBUM AL QUE PERTENECE"] || ''}</div>
        <div><strong>AÑO:</strong> ${track["AÑO"] || ''}</div>
        <div><strong>DURACIÓN:</strong> ${track["DURACION"] || ''}</div>
        <div><strong>NOTA EXTRA:</strong> ${track["NOTA EXTRA"] || ''}</div>
      `;

      info.appendChild(meta);
      row.appendChild(info);
      list.appendChild(row);

      playBtn.onclick = () => playTrack(track);
    });
  });

const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');
const artist = document.getElementById('player-artist');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function playTrack(track) {
  audio.src = track["ENLACE CANCIÓN"];
  audio.play();

  cover.src = track["ENLACE IMAGEN"] || '';
  title.textContent = track["TÍTULO"] || '';
  artist.textContent = track["ARTISTAS"] || '';

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

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  const m = Math.floor(audio.currentTime / 60);
  const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  time.textContent = `${m}:${s}`;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};
