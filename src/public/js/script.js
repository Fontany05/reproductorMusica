const musicplayer = document.querySelector(".music-player"),
  musicName = musicplayer.querySelector(".song-details .name"),
  musicArtist = musicplayer.querySelector(".song-details .artist"),
  audio = musicplayer.querySelector("#audio"),
  playPauseBtn = musicplayer.querySelector(".play-pause"),
  prevBtn = musicplayer.querySelector("#prev"),
  nextbtn = musicplayer.querySelector("#next"),
  songSlider = musicplayer.querySelector(".song-slider"),
  musicList = musicplayer.querySelector(".music-list"),
  showMorebtn = musicplayer.querySelector("#more-music"),
  hideMusicbtn = musicList.querySelector("#close");

let musicIndex = 2;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playNow();
});

//carga de musica
function loadMusic(indexNumb) {
  musicName.innerText = allmusic[indexNumb - 1].name;
  musicArtist.innerText = allmusic[indexNumb - 1].artist;
  audio.src = `audios/${allmusic[indexNumb - 1].src}.mp3`;
}
//funcion play
function playMusic() {
  musicplayer.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  audio.play();
}

//funcion pause
function pauseMusic() {
  musicplayer.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  audio.pause();
}

//next music (function)
function nextMusic() {
  musicIndex++;
  musicIndex > allmusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

//prev music (function)
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allmusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

//play music/btn musica(evento)
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = musicplayer.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

//next music(btn)
nextbtn.addEventListener("click", () => {
  nextMusic();
});

//previous music(btn)
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//music songslider
audio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration; //durancion de la cancion completa
  let progressWidth = (currentTime / duration) * 100;
  songSlider.style.width = `${progressWidth}%`;

  let musicCurrentTime = musicplayer.querySelector(".current-time"),
    musicDuration = musicplayer.querySelector(".song-duration");
    audio.addEventListener("loadeddata", () => {
    let audioAdDuration = audio.duration;
    let totalMin = Math.floor(audioAdDuration / 60);
    let totalSec = Math.floor(audioAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

songSlider.addEventListener("click", (e) => {
  let progressWidthval = songSlider.clientWidth; //valor (progreso) del song slider
  let clickOffSetX = e.offsetX;
  let songDuration = audio.duration;

  audio.currentTime = (clickOffSetX / progressWidthval) * songDuration;
});

//repeat music

const repeatbtn = musicplayer.querySelector("#repeat-plist");
repeatbtn.addEventListener("click", () => {
  let getText = repeatbtn.innerText;
  switch (getText) {
    case "repeat": //cambia a icono a repetir una vez
      repeatbtn.innerText = "repeat_one";
      repeatbtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatbtn.innerText = "shuffle";
      repeatbtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatbtn.innerText = "repeat";
      repeatbtn.setAttribute("title", "Playlist looped");
      break;
  }

  audio.addEventListener("ended", () => {
    let getText = repeatbtn.innerText;

    switch (getText) {
      case "repeat": //cambia a icono a repetir una vez
        nextMusic();
        break;
      case "repeat_one":
        audio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
      case "shuffle":
        let randIndex = Math.floor(Math.random() * allmusic.length + 1);
        do {
          randIndex == Math.floor(Math.random() * allmusic.length + 1);
        } while ((musicIndex = randIndex));
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        break;
    }
  });
});

showMorebtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicbtn.addEventListener("click", () => {
  showMorebtn.click();
});

const ulTag = musicplayer.querySelector("ul");

for (let i = 0; i < allmusic.length; i++) {
  let liTag = `<li li-index="${i +1}">
  <div class="row">
  <span>${allmusic[i].name}</span>
  <p>${allmusic[i].artist}</p>
  </div>
  <audio class="${allmusic[i].src}" src="/audios/${allmusic[i].src}.mp3"></audio>
  <span id="${allmusic[i].src}" class="audio-duration">3:00</span>
</li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allmusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allmusic[i].src}`);
  
  //duracion audio de la lista de musica completa
  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration =  liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10){
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
  });
}

// reproduccion al hacer click en la cacion en el listado de musica
const allListTags = ulTag.querySelectorAll("li");
function playNow(){
  for (let j = 0; j < allListTags.length; j++) {
    if(allListTags[j].classList.contains("playing")){
      allListTags[j].classList.remove("playing");
    }

    if (allListTags[j].getAttribute("li-index") == musicIndex){
       allListTags[j].classList.add("playing");
     
    } 
    //agregar atributo onclick a todas las etiquetas li
  allListTags[j].setAttribute("onclick", "clicked(this)");  
}
}

//funcion click
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playNow();
}