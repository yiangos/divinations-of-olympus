<template>
  <div class="menu-container">
    <div class="background-overlay"></div>
    
    <div class="content-layer">
      <div class="menu-list">
        <button 
          v-for="btn in menuButtons" 
          :key="btn.id" 
          class="btn-primary"
          @click="emit('action', btn.id)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="@/assets/scss/MenuView.scss" scoped></style>
<script setup>
    const emit = defineEmits(['action']);
    const menuButtons = [
        { id: 'newGame', label: 'Νεα Συνεδρια' },
        { id: 'loadGame', label: 'Φορτωση Συνεδριας' },
        { id: 'options', label: 'Επιλογες' },
        { id: 'gameRules', label: 'Κανονες Παιχνιδιου' },
        { id: 'appHelp', label: 'Οδηγιες Χρησης' },
        { id: 'about', label: 'Σχετικα' }
    ];
</script>