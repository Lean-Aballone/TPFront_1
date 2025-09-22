const songs = {
  "linkin-park": "./resources/songs/linkinpark.webm",
  "ghost-bc": "./resources/songs/ghost.webm",
  "coldplay": "./resources/songs/coldplay.webm"
};

const audioPlayers = {};
const states = {}; 

document.querySelectorAll(".playable-song").forEach(el => {
  const id = el.id;
  const span = el.querySelector("span");

  const audio = new Audio(songs[id]);
  audioPlayers[id] = { audio, span };
  states[id] = false;

  audio.addEventListener("ended", () => {
    states[id] = false;
    span.classList.add("hidden");
    audio.currentTime = 0;
    el.classList.remove("playing");
  });

  el.addEventListener("click", () => {
    const { audio, span } = audioPlayers[id];

    if (!states[id]) {
      Object.keys(audioPlayers).forEach(otherId => {
        if (states[otherId]) {
          const { audio: otherAudio, span: otherSpan } = audioPlayers[otherId];
          otherAudio.pause();
          otherAudio.currentTime = 0;
          states[otherId] = false;
          otherSpan.classList.add("hidden");
        document.getElementById(otherId).classList.remove("playing");
        }
      });

      audio.play();
      states[id] = true;
      span.classList.remove("hidden");
      el.classList.add("playing");

    } else {
      audio.pause();
      audio.currentTime = 0;
      states[id] = false;
      span.classList.add("hidden");
      el.classList.remove("playing"); 
    }
  });
});
