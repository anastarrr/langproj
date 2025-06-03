<script>
import TestSelector from '@/components/TestSelector.vue';
import TestRunner from '@/components/TestRunner.vue';
import axios from 'axios';

export default {
  components: {
    TestSelector,
    TestRunner
  },
  data() {
    return {
      userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
      userDictionaries: [],
      readyDictionaries: [],
      selectedDictionary: null,
      selectedTestType: '',
      activeTest: false,
      loading: true,
      error: null
    };
  },
  async created() {
    try {
      const userResponse = await axios.get('api/dictionaries', { params: { userId: this.userId } });
      this.userDictionaries = userResponse.data;
      const readyResponse = await axios.get('api/dictionaries/ready-dictionaries');
      this.readyDictionaries = readyResponse.data;
    } catch (err) {
      console.error('Ошибка загрузки словарей:', err);
      this.error = 'Не удалось загрузить словари';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleStartTest({ dictionary, type }) {
      this.selectedDictionary = dictionary;
      this.selectedTestType = type;
      this.activeTest = true;
    },
    handleTestComplete() {
      this.activeTest = false;
      this.selectedDictionary = null;
      this.selectedTestType = '';
    }
  }
};
</script>

<template>
  <div class="tests-page">
    <div v-if="loading">Загрузка словарей...</div>
    <div v-else>
      <div v-if="error" class="error">{{ error }}</div>
      <test-selector
          v-if="!activeTest"
          :user-dictionaries="userDictionaries"
          :ready-dictionaries="readyDictionaries"
          @start-test="handleStartTest"
      />

      <test-runner
          v-else
          :dictionary="selectedDictionary"
          :type="selectedTestType"
          @test-complete="handleTestComplete"
      />
    </div>
  </div>
</template>

<style>
.tests-page {
  background-color: #171d40;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.error {
  color: red;
  margin-bottom: 1em;
}
</style>
