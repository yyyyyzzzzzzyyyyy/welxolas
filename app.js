const list = document.getElementById('music-list');

/* NORMALIZADOR */
function norm(str){
  return String(str || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,'')
    .trim();
}

/* COLOR POR TEXTO */
function colorClass(value){
  const v = norm(value);
  if (v.includes('seguro')) return 'green';
  if (v.includes('tal vez')) return 'blue';
  if (v.includes('relleno')) return 'yellow';
  if (v.includes('ya')) return 'red';

  if (v.includes('cancion completa')) return 'green';
  if (v.includes('punto medio')) return 'blue';
  if (v.includes('tu decides')) return 'yellow';
  if (v.includes('salteada')) return 'red';

  if (v.includes('filtrada pero rara')) return 'yellow';
  if (v.includes('filtrada')) return 'red';
  if (v.includes('exclusiva')) return 'blue';
  if (v.includes('full')) return 'green';

  return 'blue';
}

/* DATA */
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
          <div class="track-title">${track.TÍTULO || track.TITULO}</div>

          <div class="badges">
            <span class="badge ${colorClass(track['TIPO DE INTERÉS'])}">${track['TIPO DE INTERÉS']}</span>
            <span class="badge ${colorClass(track['FORMA RECOMENDADA DE ESCUCHAR'])}">${track['FORMA RECOMENDADA DE ESCUCHAR']}</span>
            <span class="badge ${colorClass(track.ESTADO)}">${track.ESTADO}</span>
          </div>

          <div class="track-meta">
            <div><strong>ARTISTAS:</strong> ${track.ARTISTAS}</div>
            <div><strong>ÁLBUM:</strong> ${track.ALBUM} · <strong>AÑO:</strong> ${track.AÑO} · <strong>DURACIÓN:</strong> ${track.DURACION}</div>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${track.CONTEXTO}
          </div>

          <div class="track-meta">
            <strong>NOTA:</strong> ${track.NOTA || '—'}
          </div>
        </div>
      `;

      list.appendChild(row);
    });
  });

/* MODAL */
const guide = document.getElementById('guide-modal');
document.getElementById('open-guide').onclick = e => {
  e.preventDefault();
  guide.classList.remove('hidden');
};
document.getElementById('close-guide').onclick = () => guide.classList.add('hidden');
