import * as tf from '@tensorflow/tfjs';
import { glyphs } from './data/glyphs.js';

const v = document.getElementById('v');
const c = document.getElementById('c');
const ctx = c.getContext('2d', { willReadFrequently: true });
const res = document.getElementById('res');
const btn = document.getElementById('btn');
let model;

async function setup() {
  try {
    model = await tf.loadGraphModel('./model/rune_model_v102.json');
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } } 
    });
    v.srcObject = stream;
    v.onloadedmetadata = () => { res.innerText = "Ready"; btn.disabled = false; };
  } catch (err) {
    res.innerText = "Error: " + err.message;
  }
}

btn.onclick = async () => {
  try {
    // ADJUST THIS: 0.5 means capture only the central 50% of the screen (2x zoom)
    // If it's still too zoomed out, try 0.4 or 0.3
    const zoom = 0.5; 
    
    const minDim = Math.min(v.videoWidth, v.videoHeight);
    const size = minDim * zoom;
    
    const sx = (v.videoWidth - size) / 2;
    const sy = (v.videoHeight - size) / 2;
    
    // This now crops a small center square and stretches it to 224x224
    ctx.drawImage(v, sx, sy, size, size, 0, 0, 224, 224); 

    const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(c).toFloat().div(255.0).expandDims(0);
    });
    
    const pred = await model.predict(tensor).data();
    const maxConf = Math.max(...pred);
    const index = pred.indexOf(maxConf);
    const glyph = glyphs[index];

    res.innerText = glyph ? 
      `${String.fromCodePoint(glyph.sign)} ${glyph.name} (${(maxConf * 100).toFixed(0)}%)` : 
      "Unknown";

  } catch (err) {
    res.innerText = "Error: " + err.message;
  }
};
setup();