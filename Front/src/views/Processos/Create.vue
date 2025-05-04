// Create.vue
<template>
  <div class="card p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="text-2xl font-bold m-0 text-primary">Novo Processo</h1>
    </div>

    <ProcessoForm 
      v-model="processo"
      :loading="salvando"
      :isEdit="false"
      @submit="salvarProcesso"
      @voltar="voltar"
    />

    <PrimeToast position="top-right" />
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ProcessoForm from '@/components/ProcessoForm.vue';

export default {
  name: 'NovoProcesso',
  components: {
    ProcessoForm
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    
    // Estado
    const processo = reactive({
      nomeProcesso: "",
      npu: "",
      uf: "",
      municipio: "",
      codigoMunicipio: ""
    });
    
    const salvando = ref(false);
    
    const salvarProcesso = async (dadosProcesso) => {
      try {
        salvando.value = true;
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado. Faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        console.log('Enviando dados:', dadosProcesso);
        
        await axios.post('https://localhost:7041/api/processo', dadosProcesso, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Processo criado com sucesso!',
          life: 3000
        });
        
        setTimeout(() => {
          router.push('/processos');
        }, 1500);
        
      } catch (error) {
        console.error('Erro ao salvar processo:', error);
        
        if (error.response && error.response.status === 401) {
          toast.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar o processo.',
          life: 3000
        });
      } finally {
        salvando.value = false;
      }
    };
    
    const voltar = () => {
      router.push('/processos');
    };
    
    return {
      processo,
      salvando,
      salvarProcesso,
      voltar
    };
  }
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.text-primary {
  color: var(--primary-color);
}
</style>