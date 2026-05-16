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
        <label>Ή πληκτρολογήστε το σύμβολο:</label>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Αναζήτηση..."
          class="glyph-input"
        />
      </div>

      <div v-if="searchQuery" class="autocomplete-results">
        <div v-if="filteredGlyphs.length > 0" class="results-list">
          <GlyphCard 
            v-for="glyph in filteredGlyphs" 
            :key="glyph.sign" 
            :glyph="glyph" 
            mode="autocomplete" 
            @click="selectGlyph(glyph)"
          />
        </div>
        <p v-else class="no-results-msg">
          Δεν βρέθηκαν αποτελέσματα
        </p>
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
import { ref, computed } from 'vue';
import ScanPopup from '@/components/ScanPopup.vue';
import { glyphs } from '@/utils/glyphs.js';
import GlyphCard from '@/components/GlyphCard.vue';

const emit = defineEmits(['back', 'action']);

const selectedGlyph = ref(null);
const searchQuery = ref('');
const showScanPopup = ref(false);

const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/[^a-zA-Z23 \-]/g, '')
    .replace(/2/g, '₂')
    .replace(/3/g, '₃')
    .toUpperCase();
};

const filteredGlyphs = computed(() => {
  const cleanQuery = sanitizeText(searchQuery.value);
  if (!cleanQuery) return [];
  
  return glyphs.filter(g => {
    if (!g.name) return false;
    const cleanName = g.name.toUpperCase();
    return cleanName.startsWith(cleanQuery) || cleanName === cleanQuery;
  });
});

const selectGlyph = (glyph) => {
  const data = localStorage.getItem('oracle_session_data');
  const sessionData = data ? JSON.parse(data) : [];
  const exists = sessionData.some(g => g.sign === glyph.sign);
  
  if (!exists) {
    sessionData.push(glyph);
    localStorage.setItem('oracle_session_data', JSON.stringify(sessionData));
  }
  emit('action', 'game', { showToast: true, message: 'Το σύμβολο προστέθηκε επιτυχώς' });
};

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