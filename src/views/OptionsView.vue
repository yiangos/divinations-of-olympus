<template>
  <div class="menu-container">
    <div class="background-overlay"></div>
    <div class="content-layer">
      <h1>ΕΠΙΛΟΓΕΣ</h1>
      <div class="options-grid">
        <button class="btn-primary" @click="toggleMute">
          Μουσικη: {{ isMuted ? 'Οχι' : 'Ναι' }}
        </button>
        <select class="btn-primary" :value="currentTrack" @change="e => changeTrack(e.target.value)">
          <option v-for="t in tracks" :key="t.path" :value="t.path">{{ t.name }}</option>
        </select>
        <button class="btn-primary back-btn" @click="emit('back')">Επιστροφη</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/MenuView.scss" scoped></style>
<script setup>
import { isMuted, toggleMute, tracks, currentTrack, changeTrack } from '@/utils/AudioManager';
const emit = defineEmits(['back']);
</script>