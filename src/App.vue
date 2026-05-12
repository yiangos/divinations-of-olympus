<template>
  <div class="app-root">
    <SplashView 
      v-if="viewState === 'splash'"
      :status="loadingStatus" 
      :isReady="isReady"
      @enter="viewState = 'scanner'"
    />
    
    <div v-else class="scanner-placeholder">
      Scanner View Loaded
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import * as tf from '@tensorflow/tfjs';
import SplashView from './views/SplashView.vue';

const viewState = ref('splash');
const loadingStatus = ref('ΠΡΟΕΤΟΙΜΑΣΙΑ...');
const isReady = ref(false);
const model = shallowRef(null);

onMounted(async () => {
  try {
    loadingStatus.value = 'ΕΙΣΟΔΟΣ ΣΤΑ ΜΟΝΟΠΑΤΙΑ ΤΗΣ ΣΚΕΨΗΣ...';
    model.value = await tf.loadGraphModel('./model/rune_model_v102.json');
    
    loadingStatus.value = 'ΤΟ ΜΑΝΤΕΙΟ ΕΙΝΑΙ ΕΤΟΙΜΟ';
    isReady.value = true;
  } catch (e) {
    loadingStatus.value = 'Ο ΔΙΑΛΟΓΙΣΜΟΣ ΑΠΕΤΥΧΕ';
    console.error(e);
  }
});
</script>

<style lang="scss">
.app-root {
  width: 100vw;
  height: 100vh;
}
.scanner-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #d4af37;
}
</style>