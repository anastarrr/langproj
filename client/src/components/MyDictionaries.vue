<script>
import axios from 'axios';

export default {
  data() {
    return {
      dictionaries: [],
      currentDictionary: { name: "", words: [] },
      newWord: "",
      newTranslation: "",
      selectedDictionary: null,
      learningDictionary: null,
      currentIndex: 0,
      isQuestion: true,
      saveError: "",
      sortAlphabetically: false
    };
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  computed: {
    currentCard() {
      return this.learningDictionary.words[this.currentIndex];
    },
    sortedDictionaries() {
      if (!this.sortAlphabetically) return this.dictionaries;

      return [...this.dictionaries].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
  },
  mounted() {
    this.loadDictionaries();
  },
  methods: {
    toggleSort() {
      this.sortAlphabetically = !this.sortAlphabetically;
    },
    addWord() {
      if (this.newWord && this.newTranslation) {
        this.currentDictionary.words.push({ word: this.newWord, translation: this.newTranslation });
        this.newWord = "";
        this.newTranslation = "";
      }
    },
    removeWord(index) {
      this.currentDictionary.words.splice(index, 1);
    },
    async saveDictionary() {
      this.saveError = "";
      if (!this.currentDictionary.name.trim()) {
        this.saveError = "Введите название словаря";
        return;
      }
      if (this.currentDictionary.words.length === 0) {
        this.saveError = "Добавьте хотя бы одно слово и перевод";
        return;
      }

      const plainWords = this.currentDictionary.words.map(w => ({
        word: w.word,
        translation: w.translation
      }));

      try {
        if (this.currentDictionary.id) {
          await axios.put(`http://localhost:3001/api/dictionaries/${this.currentDictionary.id}`, {
            name: this.currentDictionary.name,
            words: plainWords,
            userId: this.userId
          });
        } else {
          await axios.post('http://localhost:3001/api/dictionaries', {
            userId: this.userId,
            name: this.currentDictionary.name,
            words: plainWords
          });
        }
        await this.loadDictionaries();
        this.currentDictionary = { name: "", words: [] };
      } catch (error) {
        console.error('Ошибка при сохранении словаря:', error);
      }
    },
    async loadDictionaries() {
      try {
        const response = await axios.get(`http://localhost:3001/api/dictionaries?userId=${this.userId}`);
        this.dictionaries = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке словарей:', error);
      }
    },
    async deleteDictionary(dictionaryId) {
      if (!confirm("Вы уверены, что хотите удалить словарь?")) return;
      try {
        await axios.delete(`http://localhost:3001/api/dictionaries/${dictionaryId}?userId=${this.userId}`);
        this.loadDictionaries();
      } catch (error) {
        console.error('Ошибка при удалении словаря:', error);
      }
    },
    editDictionary(dictionary) {
      this.currentDictionary = {
        id: dictionary.id,
        name: dictionary.name,
        words: dictionary.words.map(w => ({ word: w.word, translation: w.translation }))
      };
    },
    viewDictionary(dictionary) {
      this.selectedDictionary = dictionary;
    },
    closeModal() {
      this.selectedDictionary = null;
    },
    startLearning(dictionary) {
      this.learningDictionary = dictionary;
      this.currentIndex = 0;
      this.isQuestion = true;
    },
    flipCard() {
      this.isQuestion = !this.isQuestion;
    },
    nextCard() {
      if (this.currentIndex < this.learningDictionary.words.length - 1) {
        this.currentIndex++;
        this.isQuestion = true;
      }
    },
    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.isQuestion = true;
      }
    },
    stopLearning() {
      this.learningDictionary = null;
    },
    clearForm() {
      this.currentDictionary = { name: "", words: [] };
      this.newWord = "";
      this.newTranslation = "";
      this.saveError = "";
    }
  }
};
</script>

<template>
  <div class="my-dictionaries">
    <div v-if="learningDictionary" class="flashcards">
      <h4>Словарь: {{ learningDictionary.name }}</h4>
      <div class="card-container" @click="flipCard">
        <div class="card" :class="{ flipped: !isQuestion }">
          <div class="front">{{ currentCard.word }}</div>
          <div class="back">{{ currentCard.translation }}</div>
        </div>
      </div>
      <div class="controls">
        <p>Слово {{ currentIndex + 1 }} из {{ learningDictionary.words.length }}</p>
        <div class="nav-buttons">
          <button @click="prevCard" :disabled="currentIndex === 0">Предыдущее</button>
          <button @click="nextCard" :disabled="currentIndex === learningDictionary.words.length - 1">Следующее</button>
        </div>
        <button @click="stopLearning">Назад</button>
      </div>
    </div>

    <template v-else>
      <div class="left-panel">
        <div class="panel-header">
          <h3>Мои словари</h3>
          <button @click="toggleSort" class="sort-btn">
            {{ sortAlphabetically ? 'Сортировка по времени' : 'Сортировка по алфавиту' }}
          </button>
        </div>
        <ul>
          <li v-for="(dict, index) in sortedDictionaries" :key="index" @click="viewDictionary(dict)">
            <span class="dict-name">{{ dict.name }}</span>
            <div class="actions">
              <button @click.stop="startLearning(dict)">Учить</button>
              <button @click.stop="editDictionary(dict)" class="edit-btn">Изменить</button>
              <button class="remove-btn" @click.stop="deleteDictionary(dict.id)">Удалить</button>
            </div>
          </li>
        </ul>
      </div>

      <div class="right-panel">
        <h3>Создать новый словарь</h3>
        <input type="text" v-model="currentDictionary.name" placeholder="Название словаря" />
        <div class="add-word">
          <input type="text" v-model="newWord" placeholder="Слово" />
          <input type="text" v-model="newTranslation" placeholder="Перевод" />
          <button class="add-btn" @click="addWord">Добавить</button>
        </div>
        <ul class="words-list">
          <li v-for="(item, index) in currentDictionary.words" :key="index">
            <span>{{ item.word }} - {{ item.translation }}</span>
            <button class="remove-btn" @click="removeWord(index)">Удалить</button>
          </li>
        </ul>
        <div class="form-actions">
          <button class="save-btn" @click="saveDictionary">Сохранить словарь</button>
          <button class="clear-btn" @click="clearForm">Очистить</button>
        </div>
        <div v-if="saveError" class="error-message">
          {{ saveError }}
        </div>
      </div>
    </template>

    <div v-if="selectedDictionary" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ selectedDictionary.name }}</h3>
        <ul>
          <li v-for="(item, index) in selectedDictionary.words" :key="index">
            <strong>{{ item.word }}</strong> — {{ item.translation }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-dictionaries {
  display: flex;
  gap: 20px;
  color: #fbe3d9;
}
.error-message {
  color: rgba(250, 225, 215, 0.6);
  text-align: center;
  font-size: 10pt;
}
.edit-btn,
.edit-btn:hover {
  background: #4da180;
  color: #fbe3d9;
}
.left-panel, .right-panel {
  width: 50%;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto;
  height: 70vh;
}
.left-panel {
  background: #2c2d8a;
}
.right-panel {
  background: #1a1b5d;
}
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar {
  width: 8px;
}
.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track {
  background: #1a1b5d;
  border-radius: 4px;
}
.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb {
  background: #fbe3d9;
  border-radius: 4px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.sort-btn {
  background: #1A1B5D;
  color: #fbe3d9;
  padding: 5px 10px;
  font-size: 12px;
}
.sort-btn:hover {
  background: #181883;
}
h3 {
  margin-bottom: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  padding: 8px;
  background: rgba(91, 103, 189, 0.3);
  border-radius: 5px;
  cursor: pointer;
}
.left-panel li:hover {
  background: rgba(91, 103, 189, 0.6);
}
.dict-name {
  flex-grow: 1;
}
input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  background-color: #2c2d8a;
  color: #fbe3d9;
  border: 1px solid #fbe3d9;
  border-radius: 5px;
}
.add-word {
  display: flex;
  gap: 10px;
}
.add-btn {
  height: 35px;
}
button {
  background: #fbe3d9;
  color: #1A1B5D;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #fbe3d9;
}
.save-btn {
  width: 100%;
}
.clear-btn {
  background: #ff6b6b;
  color: #fbe3d9;
}
.clear-btn:hover {
  background: #ff5252;
}
.words-list li {
  background: rgba(91, 103, 189, 0.3);
  border-radius: 4px;
}
.remove-btn {
  background: #ff6b6b;
  color: #fbe3d9;
}
.remove-btn:hover {
  background: #ff5252;
}
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
  width: 50%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-content ul {
  margin-top: 10px;
}
.modal-content::-webkit-scrollbar {
  width: 8px;
}
.modal-content::-webkit-scrollbar-thumb {
  background: #fbe3d9;
  border-radius: 4px;
}
.actions {
  display: flex;
  gap: 10px;
}
.flashcards {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.card-container {
  perspective: 1000px;
  width: 300px;
  height: 200px;
  margin: 0 auto 20px;
  cursor: pointer;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card .front,
.card .back {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fbe3d9;
  color: #1A1B5D;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  backface-visibility: hidden;
  padding: 20px;
}
.card .back {
  transform: rotateY(180deg);
}
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.controls button {
  background: #fbe3d9;
  color: #1A1B5D;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}
.nav-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.nav-buttons button:disabled {
  background: #ccc;
  color: #777;
}
@media (max-width: 1024px) {
  .left-panel, .right-panel {
    width: 100%;
    margin-bottom: 20px;
  }
  input {
    width: 90%;
  }
}
@media (max-width: 600px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .sort-btn {
    margin-top: 5px;
    align-self: flex-end;
  }
  input {
    font-size: 14px;
    padding: 6px;
  }
  button {
    width: 100%;
    font-size: 16px;
  }
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>