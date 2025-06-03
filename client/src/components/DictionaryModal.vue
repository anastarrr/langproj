<script>
export default {
  props: {
    dictionary: Object
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h3>{{ dictionary.name }}</h3>
      <ul>
        <li v-for="(item, index) in dictionary.words" :key="index">
          <strong>{{ item.word }}</strong> — {{ item.translation }}
        </li>
      </ul>
      <button @click="close">Закрыть</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #2c2d8a;
  padding: 20px;
  border-radius: 8px;
  color: #fbe3d9;
  min-width: 300px;
  text-align: center;
}
.modal-content ul {
  margin-top: 10px;
}
.modal-content button {
  margin-top: 10px;
  width: 100%;
  background: #fbe3d9;
  color: #1A1B5D;
}
</style>
