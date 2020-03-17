let musicContainer = document.getElementById("musicContainer");

//Buttons
let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let repeatBtn = document.getElementById("repeat");
let randomBtn = document.getElementById("random");
let addBtn = document.getElementById("addBtn");
let removeBtn = document.getElementById("removeBtn");
let musicFiles = document.getElementById("files");

let progress = document.getElementById("runner");
let audio = document.getElementById("audio");
let title = document.getElementById("title");
let time = document.querySelector(".time");
let playList = document.getElementById("playList");

// let songs = [
//   "Bratia Stereo - Ayayay (ft. Tony Tonite)",
//   "Isaac Chambers feat. Bluey Moon-Moonlight"
// ];

let songs;
let parsedTags = [];

let playListSongs = [];

let songIndex = 0;
let randomOrderCount = 0;

function getFiles() {
  console.log("!");
  songs = musicFiles.files;
  console.log(songs);

  loadSong(songs[songIndex]);
  if (!audioCtx) {
    setVisualizer(audio);
  }

  createPlayList();
  parseTags();
  console.log(parsedTags);

  addBtn.classList.toggle("active");
  removeBtn.classList.toggle("active");
  playBtn.classList.add("ready");
}

function createPlayList() {
  for (let i = 0; i < songs.length; i++) {
    let item = document.createElement("li");

    item.innerText = songs[i].name;
    playList.appendChild(item);
  }
}

function parseTags() {
  for (let i = 0; i < songs.length; i++) {
    let url = songs[i].urn || songs[i].name;

    ID3.loadTags(
      url,
      function() {
        let item = createObjectWithTags(url);
        parsedTags.push(item);
        // showTags(url);
      },
      {
        tags: ["title", "artist", "album", "picture"],
        dataReader: ID3.FileAPIReader(songs[i])
      }
    );
  }
}

function createObjectWithTags(url) {
  let tags = ID3.getAllTags(url);
  let newItem = {
    title: tags.title || url,
    artist: tags.artist || "Uknown artist",
    album: tags.album || "Uknown album"
  };

  return newItem;
  // console.log(newItem);
  // document.getElementById('title').textContent = tags.title || "";
  // document.getElementById('artist').textContent = tags.artist || "";
  // document.getElementById('album').textContent = tags.album || "";
  // var image = tags.picture;
  // if (image) {
  //   var base64String = "";
  //   for (var i = 0; i < image.data.length; i++) {
  //     base64String += String.fromCharCode(image.data[i]);
  //   }
  //   var base64 =
  //     "data:" + image.format + ";base64," + window.btoa(base64String);
  //   document.getElementById("picture").setAttribute("src", base64);
  // } else {
  //   document.getElementById("picture").style.display = "none";
  // }
}

function loadFile(song) {
  let url = song.urn || song.name;

  ID3.loadTags(
    url,
    function() {
      // showTags(url);
    },
    {
      tags: ["title", "artist", "album", "picture"],
      dataReader: ID3.FileAPIReader(song)
    }
  );
}

function loadSong(song) {
  // title.innerText = song;
  // audio.src = `music/${song}.mp3`;

  title.innerText = song.name;
  audio.src = URL.createObjectURL(song);
}

function playSong() {
  playBtn.classList.remove("fa-play");
  playBtn.classList.remove("ready");
  playBtn.classList.add("fa-pause");
  playBtn.classList.add("active");

  if (songs) {
    audio.play();
  }
}

function pauseSong() {
  playBtn.classList.remove("fa-pause");
  playBtn.classList.remove("active");
  playBtn.classList.add("fa-play");

  // console.log(songs.length);

  if (songs) {
    playBtn.classList.add("ready");
  } else {
    playBtn.classList.remove("ready");
  }

  audio.pause();
}

function prevSong() {
  if (songs) {
    songIndex--;

    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);
    playSong();
  }
}

function nextSong() {
  if (songs) {
    songIndex++;

    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }

    loadSong(songs[songIndex]);
    playSong();
  }
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

function randomOrderNextSong() {
  // randomOrderCount++;
  songIndex = Math.floor(Math.random() * songs.length - 1 + 1);
  console.log(songIndex);
  loadSong(songs[songIndex]);
  playSong();
}

function repeatSongs() {
  if (
    randomBtn.className === "fa fa-random active" &&
    repeatBtn.className === "fas fa-redo-alt"
  ) {
    randomOrderCount++;
    if (randomOrderCount >= songs.length) {
      pauseSong();
      randomOrderCount = 0;
    } else {
      randomOrderNextSong();
    }
  } else if (
    randomBtn.className === "fa fa-random active" &&
    repeatBtn.className === "fas fa-redo-alt active"
  ) {
    console.log("random infinite");
    randomOrderNextSong();
  } else if (
    repeatBtn.className === "fas fa-redo-alt" &&
    songIndex === songs.length - 1
  ) {
    pauseSong();
  } else {
    nextSong();
  }
}

function cleanPlayList() {
  songs = null;
  pauseSong();
  title.innerText = "";
  audio.src = "";
  progress.style.width = "0%";

  addBtn.classList.toggle("active");
  removeBtn.classList.toggle("active");
  musicFiles.value = "";
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
repeatBtn.addEventListener("click", () => repeatBtn.classList.toggle("active"));
randomBtn.addEventListener("click", () => randomBtn.classList.toggle("active"));
// repeatBtn.addEventListener("click");

audio.addEventListener("timeupdate", updateProgress);
// audio.addEventListener("ended", nextSong);
audio.addEventListener("ended", repeatSongs);

progress.parentElement.addEventListener("click", setProgress);

addBtn.addEventListener("click", () => musicFiles.click());
musicFiles.addEventListener("change", getFiles);
removeBtn.addEventListener("click", cleanPlayList);
