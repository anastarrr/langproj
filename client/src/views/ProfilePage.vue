<script>
import {
  BContainer,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BModal
} from "bootstrap-vue-3";
import axios from 'axios';
import ButtonLogIn from "@/components/ButtonGeneral.vue";

export default {
  components: {
    ButtonLogIn,
    BContainer,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BModal
  },
  data() {
    return {
      user: {
        lastname: '',
        name: '',
        email: '',
        age: null,
        gender: null
      },
      genders: [
        {value: 1, text: 'Мужской'},
        {value: 2, text: 'Женский'},
        {value: 3, text: 'Другой'}
      ],
      testSummary: [],
      loadingResults: false,
      resultsError: null,
      testDetails: [],
      detailsError: null,
      selectedDictionaryId: null,
      selectedDictionaryName: '',
      loadingDetails: false,
      showModal: false,
      showLogoutConfirm: false,
    };
  },
  async mounted() {
    await this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = response.data;
        await this.loadTestSummary();
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        alert('Не удалось загрузить профиль');
      }
    },
    async saveProfile() {
      try {
        const token = localStorage.getItem('token');
        await axios.patch('/api/auth/profile', this.user, {
          headers: {Authorization: `Bearer ${token}`}
        });
        alert('Данные успешно обновлены!');
      } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        alert('Не удалось сохранить изменения');
      }
    },
    async loadTestSummary() {
      this.loadingResults = true;
      this.resultsError = null;
      try {
        const token = localStorage.getItem('token');
        const userId = this.user.id || this.user.userId;
        if (!userId) throw new Error('Не найден userId для загрузки результатов');

        const response = await axios.get(`/api/test-results/summary/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.testSummary = response.data;
      } catch (err) {
        console.error('Ошибка загрузки сводки результатов тестов:', err);
        this.resultsError = 'Не удалось загрузить результаты тестов';
      } finally {
        this.loadingResults = false;
      }
    },
    async confirmLogout() {
      try {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('token');
        this.$router.push('/');
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        alert('Не удалось выйти из аккаунта');
      }
    },
    async loadTestDetails(dictionaryId, dictionaryName) {
      this.selectedDictionaryId = dictionaryId;
      this.selectedDictionaryName = dictionaryName;
      this.loadingDetails = true;
      this.detailsError = null;
      this.showModal = true;
      try {
        const token = localStorage.getItem('token');
        const userId = this.user.id || this.user.userId;
        const response = await axios.get(`/api/test-results/details/${userId}/${dictionaryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.testDetails = response.data;
      } catch (error) {
        this.detailsError = 'Ошибка загрузки подробных результатов';
      } finally {
        this.loadingDetails = false;
      }
    }
  }
};
</script>

<template>
  <div class="profile-page">
    <section class="form-card">
      <div class="section-header">
        <h3 class="section-title">Профиль пользователя</h3>
        <button @click="showLogoutConfirm = true" class="logout-button">Выйти</button>
      </div>
      <b-row class="gy-1">
        <b-col cols="12">
          <b-form-group label="Фамилия">
            <b-form-input v-model="user.lastname" class="profile-input" />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Имя">
            <b-form-input v-model="user.name" class="profile-input" />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Почта">
            <b-form-input
                v-model="user.email"
                class="profile-input"
                disabled
                title="Email нельзя изменить"
            />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="Возраст">
            <b-form-input type="number" v-model="user.age" class="profile-input" />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="Пол">
            <b-form-select :options="genders" v-model="user.gender" class="profile-input" />
          </b-form-group>
        </b-col>
      </b-row>
      <div class="save-btn-container">
        <button-log-in class="save-button" @click="saveProfile">Сохранить изменения</button-log-in>
      </div>
    </section>

    <div class="results-card" v-if="testSummary.length || loadingResults || resultsError">
      <h3>Статистика по тестам</h3>
      <div v-if="loadingResults">Загрузка результатов...</div>
      <div v-else-if="resultsError" class="error">{{ resultsError }}</div>
      <table v-else class="summary-table">
        <thead>
        <tr>
          <th>Словарь</th>
          <th>Всего вопросов</th>
          <th>Правильных</th>
          <th>Процент</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in testSummary"
            :key="item.dictionary_id"
            @click="loadTestDetails(item.dictionary_id, item.dictionary_name)"
            class="clickable-row"
        >
          <td>{{ item.dictionary_name }}</td>
          <td>{{ item.total_questions }}</td>
          <td>{{ item.correct_answers }}</td>
          <td>{{ item.percent_correct }}%</td>
        </tr>
        </tbody>
      </table>
    </div>

    <b-modal v-model="showModal" hide-footer="" hide-header="">
      <template #default>
        <div v-if="loadingDetails">Загрузка...</div>
        <div v-else-if="detailsError" class="error">{{ detailsError }}</div>
        <div v-else>
          <table class="details-table">
            <thead>
            <tr>
              <th>Слово</th>
              <th>Перевод</th>
              <th>Ваш ответ</th>
              <th>Результат</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(detail, index) in testDetails" :key="index">
              <td>{{ detail.question }}</td>
              <td>{{ detail.correct_answer }}</td>
              <td>{{ detail.user_answer }}</td>
              <td :class="{ correct: detail.is_correct, incorrect: !detail.is_correct }">
                {{ detail.is_correct ? '✔️' : '❌' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
    </b-modal>
  </div>
  <b-modal
      id="confirm-logout-modal"
      v-model="showLogoutConfirm"
      title="Подтверждение выхода"
      ok-title="Выйти"
      cancel-title="Отмена"
      @ok="confirmLogout"
  >
    <p>Вы уверены, что хотите выйти из аккаунта?</p>
  </b-modal>

</template>

<style scoped>
.profile-page {
  font-family: Inter, sans-serif;
  background-color: #c3b7b4;
  min-height: 100vh;
  padding: 60px 20px;
  color: #fbe3d9;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
}
.section-title {
  text-align: center;
}
.form-card {
  background-color: #232371;
  border-radius: 16px;
  padding: 30px 20px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}
.profile-input {
  background-color: #1a1b5d;
  border: none;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
}
.profile-input:focus {
  box-shadow: 0 0 0 2px #fbe3d9;
}
.save-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.save-button {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  background-color: #fbe3d9;
  color: #232371;
}
.profile-input:disabled {
  background-color: #2a2b7f;
  color: #c0c0c0;
}
.results-card {
  background-color: #232371;
  border-radius: 16px;
  padding: 30px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}
.summary-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1a1b5d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #fbe3d9;
  font-size: 14px;
}
.summary-table th,
.summary-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #232371;
  text-align: center;
}
.summary-table thead th {
  background-color: #232371;
  font-weight: 600;
}
.summary-table tbody tr:hover {
  background-color: #2a2b7f;
  transition: background-color 0.3s ease;
}
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.details-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1a1b5d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #fbe3d9;
  font-size: 14px;
}
.details-table th,
.details-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #232371;
  text-align: left;
}
.details-table thead th {
  background-color: #232371;
  font-weight: 600;
}
.details-table tbody tr:hover {
  background-color: #2a2b7f;
}
.correct {
  color: #4CAF50;
  font-weight: 600;
}
.incorrect {
  color: #f44336;
  font-weight: 600;
}
.error {
  color: #f44336;
  font-weight: 600;
  text-align: center;
}
.logout-button {
  background-color: #f44336;
  color: #fbe3d9;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.logout-button:hover {
  background-color: #d32f2f;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
@media (max-width: 800px) {
  .profile-page {
    flex-direction: column;
    padding: 60px 10px 10px;
  }

  .form-card,
  .results-card {
    padding: 20px 15px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .section-header {
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
  }

  .logout-button {
    width: auto;
    align-self: flex-end;
    padding: 10px;
    font-size: 15px;
  }

  .save-btn-container {
    justify-content: center;
  }

  .save-button {
    width: 100%;
    padding: 12px;
    font-size: 15px;
  }

  .summary-table,
  .details-table {
    font-size: 13px;
  }

  .summary-table thead,
  .details-table thead {
    display: none;
  }

  .summary-table tr,
  .details-table tr {
    display: block;
    margin-bottom: 15px;
    background-color: #1a1b5d;
    border-radius: 8px;
    padding: 10px;
  }

  .summary-table td,
  .details-table td {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .summary-table td:last-child,
  .details-table td:last-child {
    border-bottom: none;
  }

  .summary-table td::before,
  .details-table td::before {
    content: attr(data-label);
    font-weight: bold;
    flex: 1;
    text-align: left;
  }

  .clickable-row {
    cursor: pointer;
  }
}

</style>

<style>
.modal-content {
  background-color: #232371 !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) !important;
  color: #fbe3d9 !important;
  border: none !important;
}

</style>
