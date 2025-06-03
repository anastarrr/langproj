<script>
import ButtonGeneral from "/src/components/ButtonGeneral.vue";
import AccountLogIn from "/src/components/AccountLogIn.vue";

export default {
  components: {
    ButtonGeneral,
    AccountLogIn,
  },
}
</script>

<template>
  <div class="app">
    <div class="parent">
      <div class="login-form">
        <div><account-log-in/></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  background-color: #171d40;
}
.parent {
  width: 100vw;
  padding-top: 35px;
  font-family: Inter, sans-serif;
  justify-content: space-around;
  align-items: center;
  display: flex;
  height: 100vh;
}
.login-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
@media (max-width: 415px) {
  .login-form {
    height: 55%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
@media (max-width: 1200px) {
  .login-form {
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>