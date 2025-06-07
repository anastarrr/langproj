<script>
export default {
  data() {
    return {
      readyDictionaries: [],
      selectedDictionary: null,
      learningDictionary: null,
      currentIndex: 0,
      isQuestion: true
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
    splitDictionaries() {
      // Разделяем словари на две части для двух колонок
      const half = Math.ceil(this.readyDictionaries.length / 2);
      return [
        this.readyDictionaries.slice(0, half),
        this.readyDictionaries.slice(half)
      ];
    }
  },
  methods: {
    async fetchReadyDictionaries() {
      try {
        const response = await fetch('/api/dictionaries/ready-dictionaries');
        if (!response.ok) throw new Error('Ошибка загрузки словарей');
        this.readyDictionaries = await response.json();
      } catch (error) {
        console.error('Ошибка при получении словарей:', error);
      }
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
    }
  },
  mounted() {
    this.fetchReadyDictionaries();
  }
};
</script>

<template>
  <div class="dictionaries-container">
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
      <div class="dictionaries-wrapper">
        <h3>Готовые словари</h3>
        <div class="columns-container">
          <div class="dictionary-column" v-for="(column, index) in splitDictionaries" :key="index">
            <ul>
              <li v-for="dictionary in column" :key="dictionary.id" @click="viewDictionary(dictionary)">
                <span class="dict-name">{{ dictionary.name }}</span>
                <div class="actions">
                  <button @click.stop="startLearning(dictionary)">Учить</button>
                </div>
              </li>
            </ul>
          </div>
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
.dictionaries-container {
  display: flex;
  gap: 20px;
  color: #fbe3d9;
}

.dictionaries-wrapper {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  background: #2c2d8a;
}

.columns-container {
  display: flex;
  gap: 20px;
}

.dictionary-column {
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 10px;
}

.dictionary-column::-webkit-scrollbar {
  width: 8px;
}

.dictionary-column::-webkit-scrollbar-track {
  background: #1a1b5d;
  border-radius: 4px;
}

.dictionary-column::-webkit-scrollbar-thumb {
  background: #fbe3d9;
  border-radius: 4px;
}

h3 {
  margin-bottom: 10px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
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
.dictionary-column li:hover {
  background: rgba(91, 103, 189, 0.6);
}
.dict-name {
  flex-grow: 1;
}

.actions {
  display: flex;
  gap: 10px;
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

.modal-content button {
  margin-top: 10px;
  width: 100%;
  background: #fbe3d9;
  color: #1A1B5D;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #fbe3d9;
  border-radius: 4px;
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
  cursor: not-allowed;
  color: #777;
}
@media (max-width: 600px) {
  .columns-container {
    flex-direction: column;
  }
}
</style>