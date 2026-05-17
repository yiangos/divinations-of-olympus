<template>
  <div class="menu-container">
    <div class="content-layer">
      <div class="menu-list">
        <button 
          v-for="btn in menuButtons" 
          :key="btn.id" 
          class="btn-primary"
          @click="handleMenuClick(btn.id)"
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
        { id: 'rules', label: 'Κανονες Παιχνιδιου' },
        { id: 'help', label: 'Οδηγιες Χρησης' },
        { id: 'about', label: 'Σχετικα' }
    ];
    const handleMenuClick = (id) => {
      if (id === 'loadGame') {
        const data = localStorage.getItem('oracle_session_data');
        const hasData = data && JSON.parse(data).length > 0;
        
        emit('action', 'game', {
          showToast: true,
          message: hasData 
            ? 'Η συνεδρία φορτώθηκε επιτυχώς' 
            : 'Δεν βρέθηκαν δεδομένα συνεδρίας. Ξεκίνησε νέα συνεδρία'
        });
      } else if (id === 'newGame') {
        localStorage.removeItem('oracle_session_data');
        emit('action', 'game');
      } else {
        emit('action', id);
      }
    };
</script>