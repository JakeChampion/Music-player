let musicContainer = document.getElementById("musicContainer");

let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");

let progress = document.getElementById("runner");
let audio = document.getElementById("audio");
let title = document.getElementById("title");
let time = document.querySelector(".time");

setVisualizer(audio);

let songs = [
  "Bratia Stereo - Ayayay (ft. Tony Tonite)",
  "Isaac Chambers feat. Bluey Moon-Moonlight"
];

let songIndex = 1;

loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
}

function playSong() {
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
  playBtn.classList.add("active");
  audio.play();
}

function pauseSong() {
  playBtn.classList.remove("fa-pause");
  playBtn.classList.remove("active");
  playBtn.classList.add("fa-play");
  audio.pause();
}

function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

function setTimer() {
  let seconds = Math.floor(audio.currentTime % 60);
  let minutes = Math.floor(audio.currentTime / 60);

  time.innerText =
    ("0" + minutes).substr(-2) + ":" + ("0" + seconds).substr(-2);
}

function updateProgress(event) {
  let { duration, currentTime } = event.srcElement;
  let progressPercent = (currentTime / duration) * 100;

  progress.style.width = `${progressPercent}%`;
  setTimer();
}

function setProgress(element) {
  let width = this.clientWidth;
  let clickX = element.offsetX;
  let duration = audio.duration;
  // console.log(clickX);
  audio.currentTime = (clickX / width) * duration;
}

playBtn.addEventListener("click", () => {
  let isPlaying = playBtn.classList.contains("active");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);

progress.parentElement.addEventListener("click", setProgress);
