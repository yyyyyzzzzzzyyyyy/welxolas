let songs = [];
let currentIndex = -1;
let shuffle = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const progress = document.getElementById("progress-bar");
const volume = document.getElementById("volume");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs();
  });

function renderSongs() {
  const container = document.getElementById("songs-container");
  container.innerHTML = "";

  songs.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${song["ENLACE IMAGEN"]}" />
      <h3>${song["TÍTULO"]}</h3>
      <p>${song.ARTISTAS}</p>
    `;
    div.onclick = () => playSong(i);
    container.appendChild(div);
  });
}

function playSong(i) {
  currentIndex = i;
  const song = songs[i];

  audio.src = song["ENLACE CANCIÓN"].replace("view?usp=drive_link", "preview");
  audio.play();

  document.getElementById("player-title").textContent = song["TÍTULO"];
  document.getElementById("player-artist").textContent = song.ARTISTAS;
  document.getElementById("player-cover").src = song["ENLACE IMAGEN"];

  playBtn.textContent = "⏸";
}

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
};

nextBtn.onclick = () => {
  if (shuffle) {
    playSong(Math.floor(Math.random() * songs.length));
  } else {
    playSong((currentIndex + 1) % songs.length);
  }
};

prevBtn.onclick = () => {
  playSong((currentIndex - 1 + songs.length) % songs.length);
};

shuffleBtn.onclick = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => {
  audio.volume = volume.value;
};

audio.onended = () => nextBtn.onclick();
