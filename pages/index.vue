<script setup lang="ts">
const email = ref('');
const password = ref('');

const signup = () => {
  $fetch('/auth/signup', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      provider: 'builtin::local_emailpassword',
    },
  });
};

const signin = async () => {
  const { redirect } = await $fetch('/auth/signin', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      provider: 'builtin::local_emailpassword',
    },
  });
  await navigateTo(redirect, { external: true });
};

const signinWithGoogle = async () => {
  const { redirect } = await $fetch('/auth/signin', {
    method: 'POST',
    body: {
      provider: 'builtin::oauth_google',
    },
  });
  await navigateTo(redirect, { external: true });
};
</script>

<template>
  <div>
    <form @submit.prevent>
      <input v-model="email" type="email" />
      <input v-model="password" type="password" />

      <button type="submit" @click="signin()">SignIn</button>
      <button type="submit" @click="signup()">SignUp</button>
      <button type="submit" @click="signinWithGoogle()">SignIn with Google</button>
    </form>
  </div>
</template>
