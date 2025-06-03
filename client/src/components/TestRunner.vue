<script>
export default {
  props: ['dictionary', 'type'],
  data() {
    return {
      currentIndex: 0,
      userAnswer: '',
      answerChecked: false,
      isCorrect: false,
      correctAnswer: '',
      results: [],
      testFinished: false,

      shuffledWords: [],
      shuffledTranslations: [],
      selectedWord: null,
      selectedTranslation: null,
      matchedPairs: []
    };
  },
  computed: {
    currentWord() {
      return this.dictionary.words[this.currentIndex];
    },
    currentPrompt() {
      return this.type === 'word-to-translation'
          ? this.currentWord.word
          : this.currentWord.translation;
    },
    correctCount() {
      return this.results.filter(r => r.correct).length;
    },
    percentCorrect() {
      return Math.round((this.correctCount / this.dictionary.words.length) * 100);
    },
    multipleChoices() {
      if (this.type !== 'multiple-choice') return [];

      const correct = this.type === 'word-to-translation'
          ? this.currentWord.translation
          : this.currentWord.word;

      const allVariants = this.dictionary.words.map(w =>
          this.type === 'word-to-translation' ? w.translation : w.word
      ).filter(v => v !== correct);

      const shuffled = this.shuffleArray(allVariants).slice(0, 2);
      const choices = this.shuffleArray([correct, ...shuffled]);
      return choices;
    }
  },
  mounted() {
    this.setupTest();
    if (this.type === 'matching') {
      this.setupMatchingTest();
    }
  },
  methods: {
    handleChoiceSelection(choice) {
      const correct = this.type === 'word-to-translation'
          ? this.currentWord.translation
          : this.currentWord.word;

      this.results.push({
        prompt: this.currentPrompt,
        answer: choice,
        correctAnswer: correct,
        correct: choice === correct
      });

      if (this.currentIndex + 1 < this.dictionary.words.length) {
        this.currentIndex++;
      } else {
        this.testFinished = true;
        this.saveResultsToServer();
      }
    },
    chooseOption(option) {
      const correct = this.type === 'word-to-translation'
          ? this.currentWord.translation
          : this.currentWord.word;

      this.userAnswer = option;
      this.correctAnswer = correct;
      this.isCorrect = option === correct;
      this.answerChecked = true;
      this.results.push({
        prompt: this.currentPrompt,
        answer: option,
        correctAnswer: correct,
        correct: this.isCorrect
      });
    },
    checkAnswer() {
      this.correctAnswer =
          this.type === 'word-to-translation'
              ? this.currentWord.translation
              : this.currentWord.word;
      this.isCorrect =
          this.userAnswer.trim().toLowerCase() === this.correctAnswer.toLowerCase();
      this.answerChecked = true;
      this.results.push({
        prompt: this.currentPrompt,
        answer: this.userAnswer,
        correctAnswer: this.correctAnswer,
        correct: this.isCorrect
      });
    },
    nextQuestion() {
      this.answerChecked = false;
      this.userAnswer = '';
      this.isCorrect = false;
      this.correctAnswer = '';

      if (this.currentIndex + 1 < this.dictionary.words.length) {
        this.currentIndex++;
      } else {
        this.testFinished = true;
        this.saveResultsToServer();
      }
    },
    saveResultsToServer() {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const formattedResults = this.results.map(r => ({
        question: r.prompt,
        answer: r.answer,
        correct_answer: r.correctAnswer,
        is_correct: r.correct
      }));

      fetch('http://localhost:3001/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          dictionaryId: this.dictionary.id,
          results: formattedResults
        })
      })
          .then(res => res.json())
          .then(data => {
            console.log('Результаты теста сохранены', data);
          })
          .catch(err => {
            console.error('Ошибка при сохранении результатов', err);
          });
    },
    finishTest() {
      if (!confirm("Вы уверены, что хотите завершить тест?")) return;
      if (this.type === 'matching') {
        const usedWords = this.results.map(r => r.prompt);
        const unusedWords = this.dictionary.words.filter(w => !usedWords.includes(w.word));

        for (const word of unusedWords) {
          this.results.push({
            prompt: word.word,
            answer: '(пропущено)',
            correctAnswer: word.translation,
            correct: false
          });
        }

        this.testFinished = true;
        this.saveResultsToServer();
        return;
      }

      if (!this.answerChecked && this.userAnswer.trim() !== '') {
        this.checkAnswer();
      } else if (!this.answerChecked) {
        this.results.push({
          prompt: this.currentPrompt,
          answer: '(пропущено)',
          correctAnswer: this.type === 'word-to-translation'
              ? this.currentWord.translation
              : this.currentWord.word,
          correct: false
        });
      }

      for (let i = this.currentIndex + 1; i < this.dictionary.words.length; i++) {
        const word = this.dictionary.words[i];
        this.results.push({
          prompt: this.type === 'word-to-translation' ? word.word : word.translation,
          answer: '(пропущено)',
          correctAnswer: this.type === 'word-to-translation' ? word.translation : word.word,
          correct: false
        });
      }
      this.saveResultsToServer();
      this.testFinished = true;
    },
    shuffleArray(array) {
      return [...array].sort(() => Math.random() - 0.5);
    },
    setupTest() {
      this.dictionary.words = this.shuffleArray(this.dictionary.words);
    },
    setupMatchingTest() {
      this.shuffledWords = [...this.dictionary.words].sort(() => Math.random() - 0.5);
      this.shuffledTranslations = [...this.dictionary.words].sort(() => Math.random() - 0.5);
    },
    selectWord(word) {
      this.selectedWord = word;
      this.tryMatch();
    },
    selectTranslation(translation) {
      this.selectedTranslation = translation;
      this.tryMatch();
    },
    tryMatch() {
      if (this.selectedWord && this.selectedTranslation) {
        const isCorrect = this.selectedWord.translation === this.selectedTranslation.translation;

        this.matchedPairs.push({
          word: this.selectedWord.word,
          translation: this.selectedTranslation.translation,
          correct: isCorrect
        });

        this.results.push({
          prompt: this.selectedWord.word,
          answer: this.selectedTranslation.translation,
          correctAnswer: this.selectedWord.translation,
          correct: isCorrect
        });

        this.shuffledWords = this.shuffledWords.filter(w => w !== this.selectedWord);
        this.shuffledTranslations = this.shuffledTranslations.filter(t => t !== this.selectedTranslation);

        this.selectedWord = null;
        this.selectedTranslation = null;

        if (this.shuffledWords.length === 0) {
          this.testFinished = true;
        }
      }
    }
  }
};
</script>

<template>
  <div class="test-runner">
    <h2>Тест: {{
        type === 'word-to-translation' ? 'Слово → Перевод' :
            type === 'translation-to-word' ? 'Перевод → Слово' :
                type === 'matching' ? 'Сопоставление слов и переводов' :
                    'Несколько ответов'
      }}</h2>

    <p v-if="['word-to-translation', 'translation-to-word', 'multiple-choice'].includes(type) && !testFinished">
      Вопрос {{ currentIndex + 1 }} из {{ dictionary.words.length }}
    </p>

    <div v-if="!testFinished && type !== 'matching' && type !== 'multiple-choice'">
      <p><strong>{{ currentPrompt }}</strong></p>
      <input
          v-model="userAnswer"
          :disabled="answerChecked"
          placeholder="Ваш ответ"
          class="inp-ans"
      />

      <div class="buttons">
        <button v-if="!answerChecked" @click="checkAnswer" :disabled="userAnswer.trim() === ''">Проверить</button>
        <button v-else @click="nextQuestion">Дальше</button>
        <button @click="finishTest" class="secondary-button">Завершить тест</button>
      </div>

      <div v-if="answerChecked">
        <p :style="{ color: isCorrect ? '#6ee7b7' : '#f87171' }">
          {{ isCorrect ? 'Правильно!' : `Неправильно. Правильный ответ: ${correctAnswer}` }}
        </p>
      </div>
    </div>

    <div v-if="!testFinished && type === 'multiple-choice'">
      <p><strong>{{ currentPrompt }}</strong></p>
      <div class="buttons">
        <button
            v-for="choice in multipleChoices"
            :key="choice"
            @click="handleChoiceSelection(choice)"
        >
          {{ choice }}
        </button>
      </div>

      <div class="buttons">
        <button @click="finishTest" class="secondary-button">Завершить тест</button>
      </div>
    </div>

    <p v-if="type === 'matching' && !testFinished">
      Сопоставлено: {{ matchedPairs.length }} из {{ dictionary.words.length }}
    </p>

    <div v-if="!testFinished && type === 'matching'" class="matching-grid">
      <div class="column">
        <h3>Слова</h3>
        <button
            class="btn-word"
            v-for="word in shuffledWords"
            :key="word.word"
            :class="{ selected: selectedWord && selectedWord.word === word.word }"
            @click="selectWord(word)"
        >
          {{ word.word }}
        </button>
      </div>

      <div class="column">
        <h3>Переводы</h3>
        <button
            class="btn-word"
            v-for="trans in shuffledTranslations"
            :key="trans.translation"
            :class="{ selected: selectedTranslation && selectedTranslation.translation === trans.translation }"
            @click="selectTranslation(trans)"
        >
          {{ trans.translation }}
        </button>
      </div>

      <div class="buttons">
        <button @click="finishTest" class="secondary-button">Завершить тест</button>
      </div>
    </div>

    <div v-if="testFinished" class="results">
      <h3>Результаты теста</h3>
      <p class="score">
        Правильных ответов: <strong>{{ correctCount }}</strong> из <strong>{{ results.length }}</strong>
        ({{ percentCorrect }}%)
      </p>

      <ul class="results-list">
        <li
            v-for="(result, index) in results"
            :key="index"
            :class="{ correct: result.correct, incorrect: !result.correct }"
        >
          <span class="prompt">{{ index + 1 }}. {{ result.prompt }}</span>
          <span class="arrow">→</span>
          <span class="user-answer">{{ result.answer }}</span>
          <span v-if="!result.correct" class="correct-answer">(Правильно: {{ result.correctAnswer }})</span>
        </li>
      </ul>

      <button class="secondary-button" @click="$emit('test-complete')">Завершить</button>
    </div>

  </div>
</template>

<style scoped>
.test-runner {
  padding: 20px;
  background-color: #232371;
  color: #fbe3d9;
  border-radius: 10px;
  max-width: 800px;
  margin: 60px auto auto;
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
}
.btn-word {
  background-color: #fbe3d9;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
button {
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  background-color: #4da180;
  color: #1A1B5D;
  cursor: pointer;
}
.secondary-button {
  background-color: #af3636;
  color: #1A1B5D;
  max-height: 40px;
}
.results ul {
  padding-left: 0;
  list-style: none;
}
.results li {
  margin-bottom: 8px;
}
.matching-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.column {
  flex: 1;
}
.column button {
  display: block;
  width: 100%;
  margin-bottom: 8px;
}
.selected {
  background-color: #93c5fd;
}
.inp-ans {
  background-color: #d0c3f2;
  outline: none;
  color: #171d40;
}
input:disabled {
  background-color: rgba(208, 195, 242, 0.5);
  -webkit-text-fill-color: #2c2d8a;
  opacity: 0.5;
}
.results {
  background-color: #1a1b5d;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
  color: #fbe3d9;
}
.score {
  font-size: 18px;
  margin-bottom: 16px;
  color: #fbe3d9;
}
.results-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.results-list li {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.results-list li.correct {
  background-color: #14532d;
  color: #6ee7b7;
}
.results-list li.incorrect {
  background-color: #7f1d1d;
  color: #f87171;
}
.prompt {
  font-weight: bold;
}
.arrow {
  margin: 0 4px;
}
.user-answer {
  font-style: italic;
}
.correct-answer {
  margin-left: auto;
  font-size: 0.9em;
  color: #fbe3d9;
}
</style>
