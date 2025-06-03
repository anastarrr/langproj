<script setup>
defineProps({
  variant: {
    type: String,
    default: "basic"
  }
})

defineEmits(['click'])
</script>

<template>
  <button
      class="button-general"
      :class="variant"
      @click="$emit('click', $event)"
  >
    <slot/>
  </button>
</template>

<style scoped>
.button-general {
  font-weight: 400;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--btn-border-color);
  color: var(--btn-text-color);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.25);
  transition: background-color .2s;
  background-color: var(--btn-color);
  cursor: pointer;
}
.button-general:hover {
  background-color: var(--btn-hover-color);
}
.button-general:active {
  background-color: var(--btn-active-color);
}
.button-general.basic {
  --btn-color: rgb(var(--c-button-rgb));
  --btn-hover-color: rgb(var(--c-button-hover-rgb));
  --btn-active-color: rgb(var(--c-button-active-rgb));
  --btn-border-color: rgb(var(--c-button-border-rgb));
  --btn-text-color: #fff;
}
</style>