<template>
  <div class="add-glyph-container">
    <div class="content-layer">
      <h1>ΠΡΟΣΘΗΚΗ</h1>

      <div class="action-buttons-section">
        <button class="btn-primary" @click="showScanPopup = true">
          ΣΑΡΩΣΤΕ
        </button>
      </div>

      <div class="search-section">
        <label>Ή πληκτρολογήστε:</label>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Αναζήτηση..."
          class="glyph-input"
        />
      </div>

      <div v-if="selectedGlyph" class="selection-preview">
        <span class="glyph-name">{{ String.fromCodePoint(selectedGlyph.sign) }}</span>
        <button class="clear-btn" @click="clearSelection">✕</button>
      </div>
    </div>

    <footer class="sticky-footer">
      <button class="btn-primary" @click="handleFinalize">
        {{ selectedGlyph ? 'ΕΠΙΒΕΒΑΙΩΣΗ' : 'ΕΠΙΣΤΡΟΦΗ' }}
      </button>
    </footer>

    <ScanPopup 
      v-if="showScanPopup" 
      @close="showScanPopup = false" 
      @accepted="handlePopupAcceptance"
    />
  </div>
</template>
<style lang="scss" src="@/assets/scss/AddGlyphView.scss" scoped />

<script setup>
import { ref } from 'vue';
import ScanPopup from '@/components/ScanPopup.vue';

const emit = defineEmits(['back', 'action']);

const selectedGlyph = ref(null);
const searchQuery = ref('');
const showScanPopup = ref(false);

const clearSelection = () => {
  selectedGlyph.value = null;
  searchQuery.value = '';
};

const handlePopupAcceptance = () => {
  showScanPopup.value = false;
  // Route to game screen passing the metadata payload for the notification banner
  emit('action', 'game',  { showToast: true, message: 'Το σύμβολο προστέθηκε επιτυχώς' });
};

const handleFinalize = () => {
  if (selectedGlyph.value) {
    const data = localStorage.getItem('oracle_session_data');
    const sessionData = data ? JSON.parse(data) : [];
    const exists = sessionData.some(g => g.sign === selectedGlyph.value.sign);
    if (!exists) {
      sessionData.push(selectedGlyph.value);
      localStorage.setItem('oracle_session_data', JSON.stringify(sessionData));
    }
    emit('action', 'game',  { showToast: true, message: 'Το σύμβολο προστέθηκε επιτυχώς' });
  }
  else {
      emit('action', 'game');
  }
};
</script>