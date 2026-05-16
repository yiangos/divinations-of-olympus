

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
        <p>ΒΑΘΜΟΙ: 0</p>
      </div>

      <div class="accordion-section">
        <button class="accordion-header" @click="toggleTab('symbols')">
          ΣΥΜΒΟΛΑ {{ activeTab === 'symbols' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'symbols'" class="accordion-content">
          <ul>
            <li v-for="(glyph, index) in sessionGlyphs" :key="index">
              {{ glyph }}
            </li>
          </ul>
        </div>
        <button class="accordion-header" @click="toggleTab('completed')">
          ΠΛΗΡΕΙΣ ΛΕΞΕΙΣ {{ activeTab === 'completed' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'completed'" class="accordion-content">
          </div>

        <button class="accordion-header" @click="toggleTab('partial')">
          ΛΕΞΕΙΣ ΥΠΟ ΔΙΑΜΟΡΦΩΣΗ {{ activeTab === 'partial' ? '▼' : '▶' }}
        </button>
        <div v-if="activeTab === 'partial'" class="accordion-content">
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

const toggleTab = (tabName) => {
  activeTab.value = activeTab.value === tabName ? null : tabName;
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
});
</script>