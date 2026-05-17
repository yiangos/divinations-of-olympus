<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-x" @click="emit('close')">✕</button>
      
      <div class="camera-section">
        <div class="video-container">
          <video id="v" ref="videoRef" playsinline autoplay muted></video>
          <div class="viewfinder">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>
        
        <button v-if="!isReady" class="btn-primary" @click="initCamera">
          ΕΝΕΡΓΟΠΟΙΗΣΗ ΚΑΜΕΡΑΣ
        </button>
        <button v-else class="btn-primary" @click="detectedGlyph ? handleRepeat() : handleScan()">
          {{ detectedGlyph ? 'ΕΠΑΝΑΛΗΨΗ' : 'ΣΑΡΩΣΗ' }}
        </button>      
      </div>

      <div v-if="detectedGlyph" class="glyph-preview-row">
        <GlyphCard :glyph="detectedGlyph" mode="scan" />
        <button class="btn-accept" @click="handleAccept">ΑΠΟΔΟΧΗ</button>
      </div>

      <canvas id="c" ref="canvasRef" width="224" height="224" style="display: none;"></canvas>
      
      <button class="btn-secondary back-btn" @click="emit('close')">ΕΠΙΣΤΡΟΦΗ</button>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/ScanPopup.scss" scoped />

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as tf from '@tensorflow/tfjs';
import { glyphs } from '@/utils/glyphs.js';
import GlyphCard from '@/components/GlyphCard.vue';

const emit = defineEmits(['close', 'accepted']);

const videoRef = ref(null);
const canvasRef = ref(null);
const isReady = ref(false);
const detectedGlyph = ref(null);

let model = null;
let stream = null;
let ctx = null;

onMounted(async () => {
  try {
    await tf.ready();
    try {
      // Some Android devices struggle with the "packed" layout
      tf.env().set('WEBGL_PACK', false);
      // Force WebGL 2
      tf.env().set('WEBGL_VERSION', 2);
    } catch (flagError) {
      alert(`Could not set precision flags: ${flagError}`);
    }
    model = await tf.loadGraphModel('./model/rune_model_v102.json');
  } catch (err) {
    console.error(err);
  }
});

onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});

const initCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } } 
    });
    const v = document.getElementById('v');
    v.srcObject = stream;
    v.onloadedmetadata = () => { isReady.value = true; };
  } catch (err) {
    console.error(err);
  }
};

const handleScan = async () => {
  const v = document.getElementById('v');
  const c = document.getElementById('c');
  
  if (!model || !v || !c) return;
  try {
    const zoom = 0.4; // 0.5 = 2x zoom. Lower is more zoomed in.
    
    const minDim = Math.min(v.videoWidth, v.videoHeight);
    const size = minDim * zoom;
    const sx = (v.videoWidth - size) / 2;
    const sy = (v.videoHeight - size) / 2;
    ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(v, sx, sy, size, size, 0, 0, 224, 224); 

    const tensor = tf.tidy(() => tf.browser.fromPixels(c, 3).toFloat().div(255).expandDims(0));
    const pred = await model.predict(tensor).data();
    const maxConf = Math.max(...pred);
    const index = pred.indexOf(maxConf);
    const glyph = glyphs[index];

    if (glyph && maxConf > 0.5) {
      detectedGlyph.value = glyph;
    }
  } catch (err) {
    console.error(err);
  }
};

const handleRepeat = () => {
  detectedGlyph.value = null;
};

const handleAccept = () => {
  if (detectedGlyph.value) {
    const data = localStorage.getItem('oracle_session_data');
    const sessionData = data ? JSON.parse(data) : [];
    const exists = sessionData.some(g => g.sign === detectedGlyph.value.sign);
    if (!exists) {
      sessionData.push(detectedGlyph.value);
      localStorage.setItem('oracle_session_data', JSON.stringify(sessionData));
    }
    emit('accepted');
  }
};
</script>