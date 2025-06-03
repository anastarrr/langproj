<script>
export default {
  props: {
    userDictionaries: { type: Array, default: () => [] },
    readyDictionaries: { type: Array, default: () => [] },
  },
  data() {
    return {
      currentTab: 'user',
      selectedDictionaryId: '',
      selectedTestType: '',
    };
  },
  computed: {
    dictionaries() {
      return this.currentTab === 'user' ? this.userDictionaries : this.readyDictionaries;
    }
  },
  methods: {
    startTest() {
      const dictIdParsed = parseInt(this.selectedDictionaryId);
      const dictionary = this.dictionaries.find(d => d.id === dictIdParsed);

      this.$emit('start-test', {
        dictionary,
        type: this.selectedTestType
      });
    }
  }
};
</script>

<template>
  <div class="test-selector">
    <h2>Выберите словарь и тип теста</h2>

    <div class="tabs">
      <button
          :class="{ active: currentTab === 'user' }"
          @click="currentTab = 'user'; selectedDictionaryId = ''"
      >
        Мои словари
      </button>
      <button
          :class="{ active: currentTab === 'ready' }"
          @click="currentTab = 'ready'; selectedDictionaryId = ''"
      >
        Готовые словари
      </button>
    </div>

    <div class="form-section">
      <label>Словарь:</label>
      <select v-model="selectedDictionaryId">
        <option disabled value="">Выберите словарь</option>
        <option
            v-for="dict in dictionaries"
            :key="dict.id"
            :value="dict.id"
        >
          {{ dict.name }}
        </option>
      </select>
    </div>

    <div class="form-section">
      <label>Тип теста:</label>
      <select v-model="selectedTestType">
        <option disabled value="">Выберите тип</option>
        <option value="word-to-translation">Слово → Перевод</option>
        <option value="translation-to-word">Перевод → Слово</option>
        <option value="matching">Сопоставление</option>
        <option value="multiple-choice">Несколько ответов</option>
      </select>
    </div>

    <button
        :disabled="!selectedDictionaryId || !selectedTestType"
        @click="startTest"
    >
      Начать тест
    </button>

    <p v-if="!selectedDictionaryId || !selectedTestType" class="hint">
      Пожалуйста, выберите словарь и тип теста, чтобы начать.
    </p>
  </div>
</template>

<style scoped>
.test-selector {
  padding: 20px;
  background: #232371;
  color: #fbe3d9;
  border-radius: 8px;
  max-width: 500px;
  margin: auto;
}
.tabs {
  display: flex;
  margin-bottom: 15px;
}
.tabs button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  background: #1a1b5d;
  color: #fbe3d9;
  border: none;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: background-color 0.3s ease;
  margin-right: 2px;
}
.tabs button:last-child {
  margin-right: 0;
}
.tabs button.active {
  background: #fbe3d9;
  color: #1a1b5d;
}
.form-section {
  margin-bottom: 15px;
}
select,
button {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
}
select {
  background-color: #1A1B5D;
  color: rgba(251, 227, 217, 0.8);
}
select:focus {
  outline: none;
}
button {
  background: #fbe3d9;
  color: #1A1B5D;
  cursor: pointer;
}
.hint {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  font-size: 14px;
  color: #fbe3d9;
  opacity: 0.8;
}
</style>
