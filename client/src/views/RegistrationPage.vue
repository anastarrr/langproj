<script>
import { BContainer, BRow, BCol, BFormGroup, BFormInput } from "bootstrap-vue-3"
import ButtonLogIn from "@/components/ButtonGeneral.vue";
import axios from 'axios'
export default {
  components: {
    ButtonLogIn,
    BContainer, BRow, BCol, BFormGroup, BFormInput
  },
  data() {
    return {
      lastname: '',
      name: '',
      email: '',
      age: null,
      gender: null,
      password: '',
      confirmPassword: '',
      genders: [
        { value: 1, text: 'Мужской' },
        { value: 2, text: 'Женский' },
        { value: 3, text: 'Другой' }
      ],
    }
  },
  methods: {
    async registerUser() {
      if (!this.lastname || !this.name || !this.email || !this.password) {
        alert('Пожалуйста, заполните все обязательные поля')
        return
      }

      if (this.password !== this.confirmPassword) {
        alert('Пароли не совпадают!')
        return
      }

      try {
        const response = await axios.post('/api/auth/registration', {
          lastname: this.lastname,
          name: this.name,
          email: this.email,
          age: this.age,
          gender: this.gender,
          password: this.password
        })

        console.log('Успешная регистрация:', response.data)
        this.$router.push('/')
      } catch (error) {
        console.error('Ошибка регистрации:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Ошибка регистрации')
      }
    }
  }
}
</script>

<template>
  <div class="reg-page">
    <div class="top-menu">
      <button class="back-btn" @click="$router.go(-1)">
        &lt; Назад
      </button>
    </div>
    <div class="reg-form">
      <b-container>
        <b-row>
          <b-col class="reg-col">
            <b-form-group
                class="reg-group"
                label-for="input-lastname"
            >
              <template #label>
                <div class="custom-label">
                  Фамилия
                  <span class="need-circle"></span>
                </div>
              </template>
              <b-form-input class="reg-input" id="input-lastname" v-model="lastname"/>
            </b-form-group>
            <b-form-group
                class="reg-group"
                label-for="input-name"
            >
              <template #label>
                <div class="custom-label">
                  Имя
                  <span class="need-circle"></span>
                </div>
              </template>
              <b-form-input class="reg-input" id="input-name" v-model="name"/>
            </b-form-group>
            <b-form-group
                class="reg-group"
                label-for="input-email"
            >
              <template #label>
                <div class="custom-label">
                  Почта
                  <span class="need-circle"></span>
                </div>
              </template>
              <b-form-input class="reg-input" id="input-email" v-model="email"/>
            </b-form-group>

          </b-col>
          <b-col class="reg-col">

            <b-form-group
                class="reg-group"
                label="Возраст"
                label-for="input-age"
            >
              <b-form-input class="reg-input" id="input-age" v-model="age" type="number"/>
            </b-form-group>
            <b-form-group
                class="reg-group"
                label="Пол"
                label-for="input-gender"
            >
              <b-form-input class="reg-input" v-model="gender" :options="genders" id="input-gender"/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col class="reg-col">
            <b-form-group
                class="reg-group"
                label-for="input-password"
            >
              <template #label>
                <div class="custom-label">
                  Пароль
                  <span class="need-circle"></span>
                </div>
              </template>
              <b-form-input class="reg-input" id="input-password" v-model="password" type="password"/>
            </b-form-group>
            <b-form-group
                class="reg-group mb-0"
                label-for="input-confirm-password"
            >
              <template #label>
                <div class="custom-label">
                  Подтвердите пароль
                  <span class="need-circle"></span>
                </div>
              </template>
              <b-form-input class="reg-input" id="input-confirm-password" v-model="confirmPassword" type="password"/>
            </b-form-group>
          </b-col>
          <b-col class="reg-col to-right-bottom">
            <button-log-in class="reg-button" @click.native="registerUser">
              <span>Зарегистрироваться</span>
            </button-log-in>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<style scoped>
.reg-page {
  font-family: Inter, sans-serif;
  background-color: #171d40;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  padding: 60px 100px;
}
.reg-form {
  background-color: #232371;
  border-radius: 8px;
  padding: 35px 0;
}
.reg-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.reg-group:deep(label) {
  color: #fbe3d9;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 500;
}
.reg-input {
  background: none !important;
  border-radius: 6px;
  color: #fff !important;
  font-size: 14px;
  width: 200px;
  margin-left: 20px;
}
.reg-col {
  padding: 0 50px;
}
.reg-button {
  color: #fff;
  border: 0;
  border-radius: 6px;
  padding: 12px 22px;
  font-size: 18px;
  font-weight: 500;
}
.to-right-bottom {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.need-circle {
  height: 20px;
  width: 20px;
  background-color: #1A1B5D;
  display: inline-block;
  border-radius: 20px;
}
.back-btn {
  background: none;
  border: none;
  padding: 0;
  color: #fbe3d9;
  font-weight: 500;
}
.custom-label {
  display: inline-flex;
  align-items: center;
  column-gap: 10px;
}
</style>