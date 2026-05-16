

<template>
  <div class="menu-container">
    <div class="content-layer" v-if="!isChecking">
      <h1>ΣΥΝΕΔΡΙΑ</h1>
      <div class="options-grid">
        <p class="gold-text">Βρέθηκε αποθηκευμένη συνεδρία.</p>
        <button class="btn-primary" @click="emit('action', 'game')">ΣΥΝΕΧΕΙΑ</button>
        <button class="btn-primary" @click="startNew">ΝΕΑ ΕΝΑΡΞΗ</button>
        <button class="btn-primary back-btn" @click="emit('back')">ΕΠΙΣΤΡΟΦΗ</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/NewGameView.scss" scoped />

<script setup>
import { onMounted, ref } from 'vue';
const emit = defineEmits(['action', 'back']);

const hasSavedGame = ref(false);
const isChecking = ref(true);

onMounted(() => {
  const rawData = localStorage.getItem('oracle_session_data');
  if (!rawData) {
    emit('action', 'game');
  } else {
    hasSavedGame.value = true;
    isChecking.value = false;
  }
});

const startNew = () => {
  localStorage.removeItem('oracle_session_data');
  emit('action', 'game');
};</script>