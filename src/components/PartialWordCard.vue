<template>
  <div class="word-card partial">
    <div class="word-info">
      <h3>{{ word.name }}</h3>
    </div>
    <div class="word-glyphs">
      <span 
        v-for="wg in wordGlyphDetails" 
        :key="wg.name" 
        :class="['glyph-name-text', wg.present ? 'present' : 'missing']"
      >
        {{ wg.name }}
      </span>
    </div>
  </div>
</template>
<style lang="scss" src="@/assets/scss/WordCard.scss" scoped />

<script setup>
import { computed } from 'vue';

const props = defineProps({
  word: Object,
  sessionGlyphs: Array
});

const wordGlyphDetails = computed(() => {
  return props.word.glyphs.map(wg => {
    const present = props.sessionGlyphs.some(sg => sg.name === wg);
    return { name: wg, present };
  });
});
</script>