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

const isRestrictedAudio = 'remote' in bgMusic;

const fadeVolume = (callback) => {
  if (isRestrictedAudio) {
    bgMusic.pause();
    callback(); // Immediate execution for iOS
    return;
  }

  const fadeOut = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      bgMusic.pause();
      bgMusic.volume = 1.0;
      callback();
    }
  }, 25);
};

export const playMusic = () => {
  if ((bgMusic.src === '' || bgMusic.paused) && !isMuted.value) {
    bgMusic.src = currentTrack.value;
    bgMusic.play().catch(() => {});
  }
};

export const changeTrack = (newPath) => {
  const fullPath = `${import.meta.env.BASE_URL}${newPath.replace('./', '')}`;
  currentTrack.value = newPath;
  fadeVolume(() => {
    bgMusic.src = fullPath;
    bgMusic.load();
    if (!isMuted.value) bgMusic.play().catch(() => {});
  });
};

export const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    fadeVolume(() => {});
  } else {
    bgMusic.volume = 1.0;
    bgMusic.play().catch(() => {});
  }
};