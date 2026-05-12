import { ref } from 'vue';

export const isMuted = ref(false);
export const currentTrack = ref('./audio/soliloquy.mp3');
export const tracks = [
  { name: 'Ambient Mysticism', path: './audio/soliloquy.mp3' },
  { name: 'At the Slopes of Mt Parnassus', path: './audio/snowland.mp3' },
  { name: 'Mycenae and Tiryns', path: './audio/salt-marsh-birds.mp3' },
  { name: 'Hierophant\'s Dilemma', path: './audio/leap-into-eternity.mp3' },
  { name: 'To Pylos!', path: './audio/painted-dreams.mp3' },
  { name: 'Olympian Echoes', path: './audio/spiritwatcher.mp3' },
  { name: 'Hades\' Whisper', path: './audio/you-were-my-brother.mp3' }
];

const bgMusic = new Audio();
bgMusic.loop = true;

const fadeVolume = (callback) => {
  const fadeOut = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      bgMusic.pause();
      bgMusic.volume = 1.0; // Reset for next play
      if (callback) callback();
    }
  }, 25); // ~500ms total fade duration
};
export const playMusic = () => {
  if ((bgMusic.src === '' || bgMusic.paused) && !isMuted.value) {
    bgMusic.src = currentTrack.value;
    bgMusic.play().catch(() => {});
  }
};
export const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    fadeVolume(() => { bgMusic.muted = true; });
  } else {
    bgMusic.muted = false;
    bgMusic.volume = 1.0;
    bgMusic.play().catch(() => {});
  }
};

export const changeTrack = (newPath) => {
  fadeVolume(() => {
    currentTrack.value = newPath;
    bgMusic.src = newPath;
    if (!isMuted.value) bgMusic.play();
  });
};