<script>
import DictionaryModal from "@/components/DictionaryModal.vue";

export default {
  components: { DictionaryModal },
  data() {
    return {
      dictionaries: [
        {
          id: 1,
          name: "Животные",
          words: [
            { word: "Кот", translation: "Cat" },
            { word: "Собака", translation: "Dog" },
            { word: "Птица", translation: "Bird" },
            { word: "Змея", translation: "Snake" }
          ]
        },
        {
          id: 2,
          name: "Цвета",
          words: [
            { word: "Красный", translation: "Red" },
            { word: "Зеленый", translation: "Green" },
            { word: "Синий", translation: "Blue" }
          ]
        },
        {
          id: 3,
          name: "Мебель",
          words: [
            { word: "Стул", translation: "Chair" },
            { word: "Стол", translation: "Table" }
          ]
        }
      ],
      selectedDictionary: null
    };
  },
  methods: {
    viewDictionary(dictionary) {
      this.selectedDictionary = dictionary;
    },
    closeModal() {
      this.selectedDictionary = null;
    }
  }
};
</script>

<template>
  <div class="dicts">
    <ul>
      <li v-for="dictionary in dictionaries" :key="dictionary.id">
        {{ dictionary.name }}
        <div class="actions">
          <button @click="viewDictionary(dictionary)">Просмотреть</button>
          <button @click="$emit('selectDictionary', dictionary)">Выбрать</button>
        </div>
      </li>
    </ul>

    <DictionaryModal
        v-if="selectedDictionary"
        :dictionary="selectedDictionary"
        @close="closeModal"
    />
  </div>
</template>

<style scoped>
.dicts {
  margin-top: 20px;
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
  background: #2c2d8a;
  color: #fbe3d9;
  border-radius: 5px;
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
  background: #d4c1b3;
}

@media (max-width: 600px) {
  button {
    width: 100%;
    font-size: 16px;
  }
}
</style>
