const list = document.getElementById('music-list');
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

let currentIndex = 0;
let tracks = [];

const norm = t => String(t||'').toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g,'');

const color = v => {
  v = norm(v);
  if (v.includes('seguro') || v.includes('completa') || v.includes('full')) return 'green';
  if (v.includes('tal') || v.includes('medio') || v.includes('exclusiva')) return 'blue';
  if (v.includes('relleno') || v.includes('decides') || v.includes('rara')) return 'yellow';
  return 'red';
};

fetch('data.json')
.then(r=>r.json())
.then(data=>{
  tracks=data;
  data.forEach((track,i)=>{
    const id=String(i+1).padStart(2,'0');

    const row=document.createElement('div');
    row.className='track';
    row.innerHTML=`
      <div class="track-number">${id}</div>
      <img src="images/${id}.jpg">
      <button class="play-btn">▶</button>
      <div>
        <div class="track-title">${track.titulo}</div>
        <div class="badges">
          <span class="badge ${color(track["tipo de interés"])}">${track["tipo de interés"]}</span>
          <span class="badge ${color(track["forma recomendada de escuchar"])}">${track["forma recomendada de escuchar"]}</span>
          <span class="badge ${color(track.estado)}">${track.estado}</span>
        </div>
        <div class="context-box">${track.contexto}</div>
      </div>
    `;
    list.appendChild(row);
  });
});

/* PLAY */
function playTrack(i){
  const id=String(i+1).padStart(2,'0');
  audio.src=`audio/${id}.mp3`;
  cover.src=`images/${id}.jpg`;
  titleEl.textContent=document.querySelectorAll('.track-title')[i].textContent;
  audio.play();
  playPause.textContent='⏸';
  player.classList.remove('hidden');
  currentIndex=i;
}

document.addEventListener('click',e=>{
  if(e.target.classList.contains('play-btn')){
    const i=[...document.querySelectorAll('.play-btn')].indexOf(e.target);
    playTrack(i);
  }
});

/* AUTO NEXT */
audio.onended=()=>{
  if(currentIndex<tracks.length-1) playTrack(currentIndex+1);
};

/* IMAGEN */
const imgModal=document.getElementById('image-modal');
const imgFull=document.getElementById('full-image');

document.addEventListener('click',e=>{
  if(e.target.tagName==='IMG' && e.target.closest('.track')){
    imgFull.src=e.target.src;
    imgModal.classList.remove('hidden');
  }
});

document.getElementById('close-image').onclick=()=>{
  imgModal.classList.add('hidden');
};
