<script setup lang="ts">
const useEmailPasswordSignIn = () => {
  const signinLoading = ref(false);
  const signupLoading = ref(false);

  const email = ref('');
  const password = ref('');

  const signupFinished = ref(false);
  const signinError = ref('');
  const signupError = ref('');

  const signup = async () => {
    if (!email.value || !password.value) {
      signupError.value = 'Please enter both email and password';
      return;
    }

    signupLoading.value = true;

    try {
      await $fetch('/auth/signup', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
          provider: 'builtin::local_emailpassword',
        },
      });
    } catch (error) {
      const castedError = error as { data: { message: string } };
      signupError.value = castedError.data.message;
      return;
    } finally {
      signupLoading.value = false;
    }

    signupFinished.value = true;
  };

  const signin = async () => {
    if (!email.value || !password.value) {
      signupError.value = 'Please enter both email and password';
      return;
    }

    signinLoading.value = true;

    try {
      const { redirect } = await $fetch('/auth/signin', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
          provider: 'builtin::local_emailpassword',
        },
      });
      await navigateTo(redirect, { external: true });
    } catch (error) {
      signinLoading.value = false;

      const castedError = error as { data: { message: string } };
      signinError.value = castedError.data.message;
    }
  };

  return {
    email,
    password,
    signinLoading,
    signupLoading,
    signupFinished,
    signinError,
    signupError,
    signup,
    signin,
  };
};
const { email, password, signinLoading, signinError, signupError, signupLoading, signupFinished, signin, signup } =
  useEmailPasswordSignIn();

const useGoogleSignIn = () => {
  const loading = ref(false);

  const signin = async () => {
    loading.value = true;
    const { redirect } = await $fetch('/auth/signin', {
      method: 'POST',
      body: {
        provider: 'builtin::oauth_google',
      },
    });
    await navigateTo(redirect, { external: true });
  };

  return {
    signin,
    loading,
  };
};
const { loading: googleLoading, signin: googleSignIn } = useGoogleSignIn();
</script>

<template>
  <div v-if="signupFinished">
    <span>Check your email and verify your account before logging in.</span>
  </div>

  <div v-else class="flex flex-col gap-4">
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

      <span v-if="signinError || signupError" class="text-red-400">{{ signinError || signupError }}</span>

      <button
        class="rounded-xl bg-emerald-400 px-4 py-2 text-emerald-50 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:border-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:border-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:shadow-none"
        type="submit"
        :disabled="signinLoading"
        @click="signin()"
      >
        <Icon v-if="signinLoading" name="ph:spinner" class="animate-spin" />
        <span v-else>Sign in</span>
      </button>
      <button
        class="rounded-xl border-2 border-emerald-400 px-4 py-2 text-emerald-400 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:border-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:border-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:shadow-none"
        type="submit"
        :disabled="signupLoading"
        @click="signup()"
      >
        <Icon v-if="signupLoading" name="ph:spinner" class="animate-spin" />
        <span v-else>Sign up</span>
      </button>
    </form>
    <hr />
    <button
      class="flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-500 px-4 py-2 text-neutral-500 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:border-neutral-600 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:border-neutral-600 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:shadow-none"
      type="submit"
      :disabled="googleLoading"
      @click="googleSignIn()"
    >
      <Icon :name="googleLoading ? 'ph:spinner' : 'logos:google-icon'" :class="googleLoading && 'animate-spin'" />
      <span>Sign in with Google</span>
    </button>
  </div>
</template>
