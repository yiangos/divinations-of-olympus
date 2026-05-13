<template>
  <Transition name="fade-blur" mode="out-in">
    <component 
      :is="currentView" 
      v-bind="viewProps"
      @ready="model = $event"
      @enter="handleEnter"
      @action="handleMenuAction"
      @back="viewState = 'menu'"
    />
  </Transition>  
</template>
<style lang="scss" src="@/assets/scss/App.scss"></style>
<script setup>
import { ref, shallowRef, computed } from 'vue';
import SplashView from './views/SplashView.vue';
import MenuView from './views/MenuView.vue';
import OptionsView from './views/OptionsView.vue';
import InfoView from './views/InfoView.vue';
import { playMusic } from '@/utils/AudioManager';
import { staticPages } from '@/utils/content';

const viewState = ref('splash');
const model = shallowRef(null);

const views = {
  splash: SplashView,
  menu: MenuView,
  options: OptionsView,
  about: InfoView,
  help: InfoView,
  rules: InfoView,
};

const currentView = computed(() => views[viewState.value]);

const viewProps = computed(() => {
  const page = staticPages[viewState.value];
  return page ? { title: page.title, content: page.html } : {};
});

const handleEnter = () => { playMusic(); viewState.value = 'menu'; };
const handleMenuAction = (actionId) => { viewState.value = actionId; };
</script>
