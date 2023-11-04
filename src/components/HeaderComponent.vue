<template>
    <div id="main-header" class="active">
      <div class="wrapper-logo">
        <img src="@/assets/logo.svg" alt="logo" />
        <h2>KRAKEN.FM</h2>
      </div>
      <div class="wrapper-profile">
        <div class="section-user">
          <span class="avatar"></span>
          <h3>{{ fullName }}</h3>
        </div>
        <button @click="logout">LOGOUT</button>
      </div>
    </div>
  </template>
  
  <style scoped lang="scss"></style>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    data() {
      return {
        auth: useAuthStore(),
      };
    },
    computed: {
      fullName() {
        const { user } = this.auth;
        return `${user.name} ${user.surname}`;
      },
    },
    methods: {
      logout() {
        this.auth.logout();
      },
    },
  };
  </script>
  