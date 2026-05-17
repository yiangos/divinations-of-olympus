<template>
  <div :class="['word-card completed', { 'is-optimal': isUsed }]">
    <div class="word-info">
      <h3>{{ word.name }} <span v-if="isUsed" class="used-badge">(ΕΝΕΡΓΟ)</span></h3>
      <p class="glyph-names-text">{{ word.glyphs.join(', ') }}</p>
    </div>
    <div class="word-glyphs">
      <GlyphCard 
        v-for="gName in wordObjects" 
        :key="gName.sign" 
        :glyph="gName" 
        mode="list" 
      />
    </div>
  </div>
</template>
<style lang="scss" src="@/assets/scss/WordCard.scss" scoped />

<script setup>
import { computed } from 'vue';
import GlyphCard from './GlyphCard.vue';
import { glyphs } from '@/utils/glyphs.js';

const props = defineProps({
  word: Object,
  isUsed: Boolean
});

const wordObjects = computed(() => {
  return props.word.glyphs.map(wg => glyphs.find(g => g.name === wg)).filter(Boolean);
});
</script>