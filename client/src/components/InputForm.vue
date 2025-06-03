<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    variant: {
      type: String,
      default: "white"
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    }
  },
  name: "InputForm",
  emits: ['update:modelValue'],
  methods: {
    handleInput(e) {
      this.$emit('update:modelValue', e.target.value);
    }
  }
}
</script>

<template>
  <input
      class="input"
      :type="type"
      :class="variant"
      :placeholder="title"
      :value="modelValue"
      @input="handleInput"
  >
</template>

<style scoped>
.input {
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid transparent;
  margin-bottom: 7px;
  color: white;
  font-size: 18px;
  width: 288px;
}
.input.color {
  background-color: transparent;
  border: 1px solid white !important;
}
.input:focus {
  border: 2px solid white !important;
  outline: none;
}
</style>