<script setup lang="ts">
const email = ref('');
const password = ref('');

const signup = () => {
  $fetch('/auth/signup', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      provider: '',
    },
  });
};

const signin = () => {
  $fetch('/auth/signin', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      provider: '',
    },
  });
};
</script>

<template>
  <div>
    <form @submit.prevent>
      <input v-model="email" type="email" />
      <input v-model="password" type="password" />

      <button type="submit" @click="signin()">SignIn</button>
      <button type="submit" @click="signup()">SignUp</button>
    </form>
  </div>
</template>
