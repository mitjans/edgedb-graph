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
  <div class="flex flex-col gap-4">
    <form class="flex flex-col gap-4" @submit.prevent>
      <div class="flex flex-col gap-2">
        <label for="email" class="flex flex-col gap-1">
          Email
          <input
            id="email"
            v-model="email"
            class="rounded-md border px-4 py-2"
            type="email"
            placeholder="Your email..."
          />
        </label>

        <label for="password" class="flex flex-col gap-1">
          Password
          <input
            id="password"
            v-model="password"
            class="rounded-md border px-4 py-2"
            type="password"
            placeholder="Your password..."
          />
        </label>
      </div>

      <button
        class="rounded-xl bg-emerald-400 px-4 py-2 text-emerald-50 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:bg-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:bg-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
        type="submit"
        @click="signin()"
      >
        SignIn
      </button>
      <button
        class="rounded-xl border-2 border-emerald-400 px-4 py-2 text-emerald-400 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:border-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:border-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
        type="submit"
        @click="signup()"
      >
        SignUp
      </button>
    </form>
    <hr />
    <button
      class="rounded-xl border-2 border-neutral-500 px-4 py-2 text-neutral-500 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:border-neutral-600 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:border-neutral-600 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
      type="submit"
      @click="signinWithGoogle()"
    >
      SignIn with Google
    </button>
  </div>
</template>
