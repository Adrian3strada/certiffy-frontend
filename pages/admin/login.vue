<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="text-h4 text-center q-mb-md">CMS Marketing</h1>
          <p class="text-subtitle1 text-center q-mb-xl">Iniciar Sesión</p>
        </div>
        
        <q-form @submit.prevent="login" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[val => !!val || 'El email es obligatorio']"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-email" />
            </template>
          </q-input>
          
          <q-input
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[val => !!val || 'La contraseña es obligatoria']"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          
          <div class="flex justify-between items-center q-mb-md">
            <q-checkbox v-model="rememberMe" label="Recordarme" />
            <a href="#" class="text-primary">¿Olvidaste tu contraseña?</a>
          </div>
          
          <q-btn
            type="submit"
            color="primary"
            label="Iniciar Sesión"
            class="full-width"
            :loading="loading"
          />
        </q-form>
        
        <div class="login-footer q-mt-lg">
          <p class="text-center text-grey-7">
            Para fines de demostración, puedes usar:<br>
            Email: admin@example.com<br>
            Contraseña: cualquier texto
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useApi } from '~/composables/useApi';

const router = useRouter();
const $q = useQuasar();
const api = useApi();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);

const login = async () => {
  try {
    loading.value = true;
    
    // Aquí se validaría la contraseña
    // Para esta demo, aceptamos cualquier contraseña para el email de demostración
    if (email.value === 'admin@example.com' || email.value === 'marketing@example.com') {
      await api.login(email.value, password.value);
      
      $q.notify({
        color: 'positive',
        message: 'Inicio de sesión exitoso',
        icon: 'mdi-check'
      });
      
      // Redirigir al panel de administración
      router.push('/admin');
    } else {
      throw new Error('Credenciales inválidas');
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al iniciar sesión: ' + error.message,
      icon: 'mdi-alert'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  margin-bottom: 30px;
}

.login-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
