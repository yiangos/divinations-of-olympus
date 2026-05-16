<template>
  <div class="app-wrapper">
    <div v-if="viewState !== 'splash'" 
      class="shared-background" 
      :class="{ 'is-loaded': isBackgroundReady }">
    </div>
    
    <transition name="page-fade" mode="out-in">
      <component 
        :is="views[viewState]" 
        :key="viewState"
        :toast="toastData"
        v-bind="staticPages[viewState] ? { title: staticPages[viewState].title, content: staticPages[viewState].html } : {}"
        @action="handleMenuAction"
        @back="viewState = 'menu'"
        @enter="handleEnter"
      />
    </transition>
  </div>
</template>
<style lang="scss" src="@/assets/scss/Global.scss" />

<script setup>
import { ref, shallowRef, computed, watch } from 'vue';
import SplashView from './views/SplashView.vue';
import MenuView from './views/MenuView.vue';
import OptionsView from './views/OptionsView.vue';
import InfoView from './views/InfoView.vue';
import NewGameView from './views/NewGameView.vue';
import GameView from './views/GameView.vue';
import AddGlyphView from './views/AddGlyphView.vue';
import { playMusic } from '@/utils/AudioManager';
import { staticPages } from '@/utils/content';
const viewState = ref('splash');
const isBackgroundReady = ref(false);
const toastData = ref(null);
const handleMenuAction = (view, payload = null) => {
  viewState.value = view;
  toastData.value = payload; // Captures the { showToast: true, ... } object
};
const views = {
  splash: SplashView,
  menu: MenuView,
  options: OptionsView,
  about: InfoView,
  help: InfoView,
  rules: InfoView,
  newGame: NewGameView,
  game: GameView,
  addGlyph: AddGlyphView  
};

const handleEnter = () => { playMusic(); viewState.value = 'menu'; };

watch(viewState, (newVal) => {
  isBackgroundReady.value = false;
  if (newVal !== 'splash') {
    setTimeout(() => isBackgroundReady.value = true, 50);
  }
}, { immediate: true });

</script>