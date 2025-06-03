<script>
import MyDictionaries from '@/components/MyDictionaries.vue';
import ReadyDictionaries from '@/components/ReadyDictionaries.vue';

export default {
  components: {
    MyDictionaries,
    ReadyDictionaries
  },
  data() {
    return {
      activeTab: 'myDictionaries',
      userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null
    };
  }
};
</script>

<template>
  <div class="page">
    <div class="buttons">
      <button :class="{ active: activeTab === 'myDictionaries' }" @click="activeTab = 'myDictionaries'">
        Мои словари
      </button>
      <button :class="{ active: activeTab === 'readyDictionaries' }" @click="activeTab = 'readyDictionaries'">
        Готовые словари
      </button>
    </div>

    <MyDictionaries v-if="activeTab === 'myDictionaries'" :userId="userId" />
    <ReadyDictionaries v-if="activeTab === 'readyDictionaries'" :userId="userId" />
  </div>
</template>

<style scoped>
.page {
  font-family: Inter, sans-serif;
  padding: 60px 20px;
  background-color: #171d40;
  color: white;
  min-height: 100vh;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
button {
  background-color: #232371;
  color: #fbe3d9;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}
button.active {
  background-color: #fbe3d9;
  color: #1A1B5D;
}
</style>
