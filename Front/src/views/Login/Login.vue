<template>
  <div class="login-page flex align-items-center justify-content-center">
    <PrimeToast position="top-right" />
    
    <div class="surface-card p-5 shadow-4 border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="mb-4">
          <i class="pi pi-users text-primary" style="font-size: 3.5rem"></i>
        </div>
        <div class="text-900 text-3xl font-medium mb-3">Sistema de Cadastro de Processos</div>
        <span class="text-600 font-medium">Faça login para acessar o sistema</span>
      </div>

      <div>
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <div class="p-input-icon-left w-full mb-4">
          <i class="pi pi-envelope"></i>
          <PrimeInputText 
            id="email" 
            v-model="email" 
            type="text" 
            class="w-full p-3" 
            placeholder="Digite seu email"
            :class="{'p-invalid': submitted && !email}" 
          />
          <small v-if="submitted && !email" class="p-error block mt-2">Email é obrigatório.</small>
        </div>

        <label for="password" class="block text-900 font-medium mb-2">Senha</label>
        <div class="p-input-icon-left w-full mb-4">
          <i class="pi pi-lock"></i>
          <PrimePassword 
            id="password" 
            v-model="password" 
            class="w-full" 
            :feedback="false" 
            inputClass="w-full p-3"
            toggleMask 
            placeholder="Digite sua senha"
            :class="{'p-invalid': submitted && !password}" 
          />
          <small v-if="submitted && !password" class="p-error block mt-2">Senha é obrigatória.</small>
        </div>

        <div class="flex align-items-center justify-content-between mb-5">
          <div class="flex align-items-center">
            <PrimeCheckbox id="rememberme" v-model="rememberMe" :binary="true" class="mr-2" />
            <label for="rememberme" class="text-900 cursor-pointer">Lembrar-me</label>
          </div>
        </div>

        <PrimeButton 
          label="Entrar" 
          icon="pi pi-sign-in" 
          iconPos="right"
          class="w-full p-3 font-bold" 
          @click="handleLogin" 
          :loading="loading" 
        />
        
        <div class="mt-5 text-center">
          <span class="text-600 mr-2">Novo no sistema?</span>
          <router-link 
            to="/register" 
            style="
              color: #2563EB; 
              font-weight: 500; 
              text-decoration: none;
              cursor: pointer;
            "
          >
            Crie uma conta
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';

export default {
  name: 'LoginView',
  setup() {
    const toast = useToast();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const loading = ref(false);
    const submitted = ref(false);
    
    const showToast = (severity, summary, detail) => {
      const icons = {
        success: 'pi pi-check',
        info: 'pi pi-info',
        warn: 'pi pi-exclamation-triangle',
        error: 'pi pi-times-circle'
      };
      
      toast.add({
        severity,
        summary,
        detail,
        life: severity === 'error' ? 6000 : 3000,
        closable: true,
        icon: icons[severity],
        styleClass: `modern-toast ${severity}-toast`
      });
    };
    
    const handleLogin = async () => {
      submitted.value = true;
      
      if (!email.value || !password.value) {
        showToast('warn', 'Campos obrigatórios', 'Por favor, preencha todos os campos');
        return;
      }
      
      loading.value = true;
      
      try {
        await authService.login(email.value, password.value);
        
        showToast('success', 'Login bem-sucedido');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Erro de login:', error);
        showToast('error', 'Falha no login', error.message || 'Verifique suas credenciais e tente novamente');
      } finally {
        loading.value = false;
      }
    };
    
    return {
      email,
      password,
      rememberMe,
      loading,
      submitted,
      handleLogin
    };
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: var(--surface-ground);
}

@media screen and (min-width: 992px) {
  .w-6 {
    width: 30rem;
  }
}

.surface-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.surface-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175);
}

.p-password {
  width: 100%;
}

.p-password-input {
  width: 100%;
}

:deep(.p-inputtext:enabled:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

:deep(.p-button) {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

a.text-blue-500 {
  transition: color 0.2s;
}

:deep(.p-toast) {
  opacity: 1;
  top: 20px;
  right: 20px;
}

:deep(.p-toast .p-toast-message) {
  margin-bottom: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  border: none;
}

:deep(.p-toast .p-toast-message .p-toast-message-content) {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  border: none;
}

:deep(.p-toast .p-toast-message.p-toast-message-success .p-toast-message-content) {
  background: linear-gradient(145deg, var(--green-50), var(--green-100));
  border-bottom: 3px solid var(--green-500);
  color: var(--green-900);
}

:deep(.p-toast .p-toast-message.p-toast-message-info .p-toast-message-content) {
  background: linear-gradient(145deg, var(--blue-50), var(--blue-100));
  border-bottom: 3px solid var(--blue-500);
  color: var(--blue-900);
}

:deep(.p-toast .p-toast-message.p-toast-message-warn .p-toast-message-content) {
  background: linear-gradient(145deg, var(--yellow-50), var(--yellow-100));
  border-bottom: 3px solid var(--yellow-500);
  color: var(--yellow-900);
}

:deep(.p-toast .p-toast-message.p-toast-message-error .p-toast-message-content) {
  background: linear-gradient(145deg, var(--pink-50), var(--pink-100));
  border-bottom: 3px solid var(--pink-500);
  color: var(--pink-900);
}

:deep(.p-toast .p-toast-message .p-toast-detail) {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

:deep(.p-toast .p-toast-message .p-toast-icon) {
  font-size: 1.75rem;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
}

:deep(.p-toast .p-toast-message.p-toast-message-success .p-toast-icon) {
  background-color: var(--green-500);
  color: white;
}

:deep(.p-toast .p-toast-message.p-toast-message-info .p-toast-icon) {
  background-color: var(--blue-500);
  color: white;
}

:deep(.p-toast .p-toast-message.p-toast-message-warn .p-toast-icon) {
  background-color: var(--yellow-500);
  color: white;
}

:deep(.p-toast .p-toast-message.p-toast-message-error .p-toast-icon) {
  background-color: var(--pink-500);
  color: white;
}

:deep(.p-toast .p-toast-message .p-toast-summary) {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

:deep(.p-toast-top-right .p-toast-message) {
  transform-origin: top right;
  animation: toastSlideDown 0.3s;
}

@keyframes toastSlideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-toast .p-toast-message .p-toast-icon-close) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  color: var(--text-color-secondary);
  top: 0.75rem;
  right: 0.75rem;
}

:deep(.p-toast .p-toast-message .p-toast-icon-close:hover) {
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-color);
}
</style>