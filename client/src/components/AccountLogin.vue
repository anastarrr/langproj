<script>
import ButtonGeneral from "@/components/ButtonGeneral.vue";
import InputForm from "@/components/InputForm.vue";
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from "@/api.js";

export default {
  components: { InputForm, ButtonGeneral },
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const login = async () => {
      try {
        const response = await api.post('/auth/', {
          email: email.value,
          password: password.value
        });

        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userId', response.data.userId);
        router.push('/profile');
      } catch (error) {
        alert(error.response?.data?.message || 'Ошибка входа');
      }
    };

    return { email, password, login };
  }
}
</script>

<template>
  <div class="form-login">
    <div><h1>Вход в аккаунт</h1></div>
    <input-form variant="color" v-model="email" :title="'Введите почту'" type="email" autocomplete="email"/>
    <input-form variant="color" v-model="password" :title="'Введите пароль'" type="password"/>
    <div class="login-button">
      <button-general @click="login">
        <span>Войти</span>
      </button-general>
    </div>
    <div class="reg">Еще нет аккаунта?
      <router-link class="link" to="/registration"><u>Регистрация</u></router-link>
    </div>
  </div>
</template>

<style scoped>
div{
  color: #fbe3d9;
  padding: 20px 40px;
}
span{
  padding: 20px;
  font-size: 22px;
  line-height: 27px;
  color: #fbe3d9;
}
div h1{
  font-size: 35px;
  font-weight: 300;
}
div h3{
  font-weight: 100;
  font-size: 18px;
}
.login-button{
  padding: 8px 35px 8px 35px;
  font-size: 22px;
}
.form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:  30px 50px;
  font-family: Inter, sans-serif;
  background-color: #232371;
  border-color: transparent;
  border-radius: 8px;
}
.link{
  color: #fff !important;
}
.link:hover{
  color: rgba(154,153,152)!important;
}
@media (max-width: 500px) {
  div {
    padding: 12px 25px;
  }
  span {
    padding: 12px;
    font-size: 16px;
  }
  div h1 {
    font-size: 26px;
  }
  .form-login {
    padding: 20px 30px;
    width: 95%;
  }
  .reg {
    font-size: 14px;
  }
}
</style>