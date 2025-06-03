<script>
export default {
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  }
};
</script>

<template>
  <div class="global-header">
    <img alt="alang" class="logo" src="/src/assets/logo.svg"/>

    <router-link
        class="link"
        to="/dictionary"
        :class="{ active: currentRoute === '/dictionary' }"
    >Словарь</router-link>

    <router-link
        class="link"
        to="/tests"
        :class="{ active: currentRoute === '/tests' }"
    >Тесты</router-link>

    <router-link
        class="link"
        to="/profile"
        :class="{ active: currentRoute === '/profile' }"
    >Профиль</router-link>
  </div>
</template>

<style scoped>
.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 150px;
  background-color: #2c2d8a;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.logo {
  width: 35px;
  height: 35px;
}
.link {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  color: #fbe3d9;
  padding: 5px 10px;
}
.link.active {
  background-color: #CAB5AE;
  color: #1A1B5D;
  border-radius: 5px;
}
@media (max-width: 1024px) {
  .global-header {
    padding: 10px 50px;
  }
  .link {
    font-size: 16px;
    padding: 4px 8px;
  }
  .logo {
    width: 30px;
    height: 30px;
  }
}
</style>
