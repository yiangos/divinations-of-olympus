
<template>
  <div class="menu-container info-page">
    <div class="content-layer fixed-layout">
      <header class="sticky-header">
        <h1>{{ title }}</h1>
      </header>
      
      <div class="scroll-area" v-html="content"></div>
      
      <footer class="sticky-footer">
        <button class="btn-primary" @click="emit('back')">Επιστροφη</button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/InfoView.scss" scoped></style>

<script setup>
defineProps(['title', 'content']);
const emit = defineEmits(['back']);
</script>
