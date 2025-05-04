<template>
    <div class="register-page flex align-items-center justify-content-center">
      <PrimeToast position="top-right" />
      
      <div class="surface-card p-5 shadow-4 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="mb-4">
            <i class="pi pi-user-plus text-primary" style="font-size: 3.5rem"></i>
          </div>
          <div class="text-900 text-3xl font-medium mb-3">Criar Conta</div>
          <span class="text-600 font-medium">Preencha os dados para se registrar</span>
        </div>
  
        <div>
          <label for="name" class="block text-900 font-medium mb-2">Nome do Usuário</label>
          <div class="p-input-icon-left w-full mb-4">
            <i class="pi pi-user"></i>
            <PrimeInputText 
              id="name" 
              v-model="name" 
              type="text" 
              class="w-full p-3" 
              placeholder="Digite seu nome de usuário"
              :class="{'p-invalid': submitted && !name}" 
            />
            <small v-if="submitted && !name" class="p-error block mt-2">Nome de usuário é obrigatório.</small>
          </div>
  
          <label for="email" class="block text-900 font-medium mb-2">Email</label>
          <div class="p-input-icon-left w-full mb-4">
            <i class="pi pi-envelope"></i>
            <PrimeInputText 
              id="email" 
              v-model="email" 
              type="email" 
              class="w-full p-3" 
              placeholder="Digite seu email"
              :class="{'p-invalid': submitted && !isValidEmail}" 
            />
            <small v-if="submitted && !email" class="p-error block mt-2">Email é obrigatório.</small>
            <small v-else-if="submitted && !isValidEmail" class="p-error block mt-2">Email inválido.</small>
          </div>
  
          <label for="password" class="block text-900 font-medium mb-2">Senha</label>
          <div class="p-input-icon-left w-full mb-1">
            <i class="pi pi-lock"></i>
            <PrimePassword 
              id="password" 
              v-model="password" 
              class="w-full" 
              :feedback="false"
              :toggleMask="true"
              inputClass="w-full p-3"
              placeholder="Digite sua senha"
              :class="{'p-invalid': submitted && !isValidPassword}" 
            />
          </div>
          
          <div class="password-requirements mb-4 mt-2">
            <div class="text-sm text-600 mb-2">A senha deve conter:</div>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="p-field-checkbox flex align-items-center mb-2">
                  <i :class="['pi mr-2', minLengthValid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-gray-500']"></i>
                  <span :class="minLengthValid ? 'text-green-500 font-medium' : 'text-600'">No mínimo 6 caracteres</span>
                </div>
                <div class="p-field-checkbox flex align-items-center mb-2">
                  <i :class="['pi mr-2', uppercaseValid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-gray-500']"></i>
                  <span :class="uppercaseValid ? 'text-green-500 font-medium' : 'text-600'">Letra maiúscula</span>
                </div>
                <div class="p-field-checkbox flex align-items-center">
                  <i :class="['pi mr-2', lowercaseValid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-gray-500']"></i>
                  <span :class="lowercaseValid ? 'text-green-500 font-medium' : 'text-600'">Letra minúscula</span>
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div class="p-field-checkbox flex align-items-center mb-2">
                  <i :class="['pi mr-2', numberValid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-gray-500']"></i>
                  <span :class="numberValid ? 'text-green-500 font-medium' : 'text-600'">Um número</span>
                </div>
                <div class="p-field-checkbox flex align-items-center">
                  <i :class="['pi mr-2', specialCharValid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-gray-500']"></i>
                  <span :class="specialCharValid ? 'text-green-500 font-medium' : 'text-600'">Caractere especial</span>
                </div>
                <div class="progress-container mt-2 mb-1">
                  <div class="progress-bar" :style="{ width: passwordStrength + '%', backgroundColor: passwordStrengthColor }"></div>
                </div>
                <div class="text-right text-xs" :style="{ color: passwordStrengthColor }">
                  {{ passwordStrengthLabel }}
                </div>
              </div>
            </div>
          </div>
  
          <PrimeButton 
            label="Criar Conta" 
            icon="pi pi-user-plus" 
            iconPos="right"
            class="w-full p-3 font-bold mt-4" 
            @click="handleRegister" 
            :loading="loading" 
            :disabled="!isFormValid"
          />
          
          <div class="mt-5 text-center">
            <span class="text-600 mr-2">Já possui uma conta?</span>
            <router-link to="/" class="font-medium no-underline text-blue-500 cursor-pointer hover:text-blue-700 transition-duration-150">
              Faça login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'RegisterView',
    setup() {
      const toast = useToast();
      const router = useRouter();
      
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const loading = ref(false);
      const submitted = ref(false);
  
      const isValidEmail = computed(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.value && emailRegex.test(email.value);
      });
  
      const minLengthValid = computed(() => password.value.length >= 6);
      const uppercaseValid = computed(() => /[A-Z]/.test(password.value));
      const lowercaseValid = computed(() => /[a-z]/.test(password.value));
      const numberValid = computed(() => /[0-9]/.test(password.value));
      const specialCharValid = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value));
      
      const isValidPassword = computed(() => 
        minLengthValid.value && 
        uppercaseValid.value && 
        lowercaseValid.value && 
        numberValid.value && 
        specialCharValid.value
      );
  
      const isFormValid = computed(() => 
        name.value && 
        isValidEmail.value && 
        isValidPassword.value
      );
      
      const passwordStrength = computed(() => {
        let strength = 0;
        if (password.value.length > 0) {
          strength = 20;
          
          if (minLengthValid.value) strength += 15;
          if (uppercaseValid.value) strength += 15;
          if (lowercaseValid.value) strength += 15;
          if (numberValid.value) strength += 15;
          if (specialCharValid.value) strength += 20;
        }
        return strength;
      });
      
      const passwordStrengthColor = computed(() => {
        if (passwordStrength.value < 30) return '#dc3545'; 
        if (passwordStrength.value < 60) return '#ffc107'; 
        if (passwordStrength.value < 80) return '#20c997'; 
        return '#198754'; // verde
      });
      
      const passwordStrengthLabel = computed(() => {
        if (passwordStrength.value < 30) return 'Fraca';
        if (passwordStrength.value < 60) return 'Média';
        if (passwordStrength.value < 80) return 'Boa';
        return 'Forte';
      });
      
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
      
      const handleRegister = async () => {
        submitted.value = true;
        
        if (!isFormValid.value) {
          showToast('warn', 'Formulário inválido', 'Por favor, corrija os erros antes de prosseguir.');
          return;
        }
        
        loading.value = true;
        
        try {
          const response = await fetch('https://localhost:7041/api/auth/registrar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nomeUsuario: name.value,
              email: email.value,
              senha: password.value
            })
          });
          
          const responseText = await response.text();
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.log('Resposta não é um JSON válido');
          }
          
          if (!response.ok) {
            throw new Error(data?.message || 'Falha no registro');
          }
          
          showToast('success', 'Conta criada', 'Redirecionando para o login...');
          
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } catch (error) {
          console.error('Erro no registro:', error);
          showToast('error', 'Falha no registro', error.message || 'Não foi possível criar sua conta');
        } finally {
          loading.value = false;
        }
      };
      
      return {
        name,
        email,
        password,
        loading,
        submitted,
        isValidEmail,
        minLengthValid,
        uppercaseValid,
        lowercaseValid,
        numberValid,
        specialCharValid,
        isValidPassword,
        isFormValid,
        passwordStrength,
        passwordStrengthColor,
        passwordStrengthLabel,
        handleRegister
      };
    }
  }
  </script>
  
  <style scoped>
  .register-page {
    min-height: 100vh;
    background-color: var(--surface-ground);
  }
  
  @media screen and (min-width: 992px) {
    .w-6 {
      width: 36rem;
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
  
  .password-requirements {
    background-color: var(--surface-50);
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid var(--primary-color);
  }
  
  .progress-container {
    width: 100%;
    height: 6px;
    background-color: var(--surface-200);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s, background-color 0.3s;
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