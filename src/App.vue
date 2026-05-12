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
import { playMusic } from '@/utils/AudioManager';

const viewState = ref('splash');
const model = shallowRef(null);

const views = {
  splash: SplashView,
  menu: MenuView,
  options: OptionsView,
};

const currentView = computed(() => views[viewState.value]);

const viewProps = computed(() => {
  if (viewState.value === 'about') {
    return { 
      title: 'Σχετικά', 
      content: '<p>Το Μαντείο των Ολύμπιων είναι μια πύλη προς την αρχαία σοφία...</p>' 
    };
  }
  return {};
});

const handleEnter = () => { playMusic(); viewState.value = 'menu'; };
const handleMenuAction = (actionId) => { viewState.value = actionId; };
</script>
