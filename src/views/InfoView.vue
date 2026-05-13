<script setup>
defineProps(['title', 'content']);
const emit = defineEmits(['back']);
</script>

<template>
  <div class="menu-container">
    <div class="background-overlay"></div>
    <div class="content-layer">
      <h1>{{ title }}</h1>
      <div class="scroll-area" v-html="content"></div>
      <div class="footer-actions">
        <button class="btn-primary" @click="emit('back')">Επιστροφη</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/MenuView.scss" scoped></style>