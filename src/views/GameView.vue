

<template>
  <div class="game-container">
    <Transition name="toast-fade">
      <div v-if="activeToast" class="toast-notification">
        {{ activeToast }}
      </div>
    </Transition>
    <div class="content-layer">
      <h1>Χρησμοι</h1>
      
<div class="score-card">
        <div class="final-score-box">
          <span class="score-label">ΒΑΘΜΟΛΟΓΙΑ</span>
          <span class="score-value final">{{ finalScore }}</span>
        </div>
        <div class="base-score-box">
          <span class="score-label">Βασική:</span>
          <span class="score-value base">{{ baseScore }}</span>
        </div>
      </div>
      <div class="accordion-section">
        <button class="accordion-header" @click="toggleTab('symbols')">
          ΣΥΜΒΟΛΑ {{ activeTab === 'symbols' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'symbols'" class="accordion-content">
          <div class="glyphs-grid">
            <GlyphCard 
              v-for="(glyph, index) in sessionGlyphs" 
              :key="index" 
              :glyph="glyph" 
              mode="list" 
            />
          </div>
        </div>
        <button class="accordion-header" @click="toggleTab('completed')">
          ΠΛΗΡΕΙΣ ΛΕΞΕΙΣ {{ activeTab === 'completed' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'completed'" class="accordion-content">
          <CompletedWordCard 
            v-for="word in completedWords" 
            :key="word.name" 
            :word="word" 
            :isUsed="optimalWords.some(ow => ow.name === word.name)"
          />
        </div>

        <button class="accordion-header" @click="toggleTab('partial')">
          ΛΕΞΕΙΣ ΥΠΟ ΔΙΑΜΟΡΦΩΣΗ {{ activeTab === 'partial' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'partial'" class="accordion-content">
          <PartialWordCard 
            v-for="word in partialWords" 
            :key="word.name" 
            :word="word" 
            :sessionGlyphs="sessionGlyphs"
          />
        </div>
      </div>

      <button class="btn-primary" @click="emit('action', 'addGlyph')">
        ΠΡΟΣΘΗΚΗ ΣΥΜΒΟΛΟΥ
      </button>
    </div>

    <footer class="sticky-footer">
      <button class="btn-primary back-btn" @click="emit('back')">
        ΕΠΙΣΤΡΟΦΗ
      </button>
    </footer>
  </div>
</template>

<style lang="scss" src="@/assets/scss/GameView.scss" scoped />

<script setup>
import { ref, onMounted } from 'vue';
import GlyphCard from '@/components/GlyphCard.vue';
import CompletedWordCard from '@/components/CompletedWordCard.vue';
import PartialWordCard from '@/components/PartialWordCard.vue';
import { words } from '@/utils/words.js';
import { calculateBaseScore, calculateFinalScore } from '@/utils/scoreCalculator.js';
const props = defineProps({
  toast: {
    type: Object,
    default: null
  }
});

const activeToast = ref(null);
const emit = defineEmits(['action', 'back']);

const sessionGlyphs = ref([]);
const showCompleted = ref(false);
const showPartial = ref(false);
const showAcquired = ref(false);
const activeTab = ref(null); // Tracks 'symbols', 'completed', or 'partial'
const baseScore = ref(0);
const finalScore = ref(0);
const completedWords = ref([]);
const optimalWords = ref([]);
const partialWords = ref([]);
const toggleTab = (tabName) => {
  activeTab.value = activeTab.value === tabName ? null : tabName;
};
const calculatePartialWords = (allWords, currentGlyphs) => {
  return allWords.filter(w => {
    const missingCount = w.glyphs.filter(wg => !currentGlyphs.some(g => g.name === wg)).length;
    return missingCount >= 1 && missingCount <= Math.floor(w.glyphs.length / 2);
  });
};
onMounted(() => {
  if (props.toast && props.toast.showToast) {
    activeToast.value = props.toast.message;
    setTimeout(() => {
      activeToast.value = null;
    }, 3000);
  }
  const data = localStorage.getItem('oracle_session_data');
  sessionGlyphs.value = data ? JSON.parse(data) : [];
  baseScore.value = calculateBaseScore(sessionGlyphs.value);
  const result = calculateFinalScore(words, sessionGlyphs.value);
  finalScore.value = result.score;
  optimalWords.value = result.selectedWords;
  const allCompleted = words.filter(w => 
    w.glyphs.every(wg => sessionGlyphs.value.some(g => g.name === wg))
  );
  completedWords.value = allCompleted.sort((a, b) => {
    const aOptimal = result.selectedWords.some(ow => ow.name === a.name);
    const bOptimal = result.selectedWords.some(ow => ow.name === b.name);
    return (bOptimal ? 1 : 0) - (aOptimal ? 1 : 0);
  });
  partialWords.value = calculatePartialWords(words, sessionGlyphs.value);
});
</script>