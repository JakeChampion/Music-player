let musicContainer = document.getElementById("musicContainer");

let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");

let progress = document.getElementById("progress");
let audio = document.getElementById("audio");
let title = document.getElementById("title");

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

playBtn.addEventListener("click", () => {
    if
});
