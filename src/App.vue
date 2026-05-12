<template>
  <SplashView 
    v-if="viewState === 'splash'"
    @ready="model = $event"
    @enter="viewState = 'menu'"
  />
  <MenuView 
    v-if="viewState === 'menu'" 
    @action="handleMenuAction" />
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import SplashView from './views/SplashView.vue';
import MenuView from './views/MenuView.vue';

const viewState = ref('splash');
const model = shallowRef(null);
</script>

<style lang="scss">
.app-root {
  width: 100vw;
  height: 100vh;
}
.scanner-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #d4af37;
}
</style>