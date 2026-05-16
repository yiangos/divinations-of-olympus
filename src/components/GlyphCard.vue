<template>
  <div :class="['glyph-card', `mode-${mode}`, glyph.score ? `score-${glyph.score}` : 'score-default']">
    <div class="glyph-square">
      <span class="glyph-symbol">{{ String.fromCodePoint(glyph.sign) }}</span>
    </div>
    <div v-if="mode !== 'list' && glyph.name" class="glyph-label">
      {{ glyph.name }}
    </div>
  </div>
</template>
<style lang="scss" src="@/assets/scss/GlyphCard.scss" scoped />
<script setup>
defineProps({
  glyph: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'list' // Accepts: 'scan', 'autocomplete', 'list'
  }
});
</script>

