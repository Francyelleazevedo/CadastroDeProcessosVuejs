<template>
  <div class="card p-4">
    <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-4">
      <h1 class="text-2xl font-bold m-0 text-primary">Editar Processo</h1>
      <div class="mt-3 md:mt-0">
        <span class="text-500 text-sm" v-if="processo.dataCadastro">
          <i class="pi pi-calendar mr-1"></i> Cadastrado em: {{ formatarData(processo.dataCadastro) }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-content-center my-5">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <ProcessoForm 
      v-else
      v-model="processo"
      :loading="salvando"
      :isEdit="true"
      :botaoSubmit="{ label: 'Atualizar', icon: 'pi pi-check' }"
      @submit="atualizarProcesso"
      @voltar="voltar"
    />

    <PrimeToast position="top-right" />
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProcessoForm from '@/components/ProcessoForm.vue';
import apiService from '@/services/api.service';
import authService from '@/services/auth.service';

export default {
  name: 'EditarProcesso',
  components: {
    ProcessoForm
  },
  props: {
    id: {
      type: [Number, String],
      required: false
    }
  },
  setup(props) {
    const toast = useToast();
    const router = useRouter();
    const route = useRoute();
    
    const processo = reactive({
      id: null,
      nomeProcesso: "",
      npu: "",
      dataCadastro: null,
      dataVisualizacao: null,
      uf: "",
      municipio: "",
      codigoMunicipio: ""
    });
    
    const loading = ref(false);
    const salvando = ref(false);
    
    const carregarProcesso = async (processoId) => {
      try {
        loading.value = true;
        
        if (!authService.isAuthenticated()) {
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado. Faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        const dadosRecebidos = await apiService.processos.getById(processoId);
        
        console.log('Processo carregado do banco:', dadosRecebidos);
        
        Object.assign(processo, dadosRecebidos);
        
      } catch (error) {
        console.error('Erro ao carregar processo:', error);

        if (error.message && error.message.includes('401')) {
          toast.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
            life: 3000
          });
          
          authService.logout();
          router.push('/login');
          return;
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os detalhes do processo.',
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };
    
    const atualizarProcesso = async (dadosProcesso) => {
      try {
        salvando.value = true;
        
        // Verifica se o usuário está autenticado
        if (!authService.isAuthenticated()) {
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado. Faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        console.log('Enviando dados para atualização:', dadosProcesso);
        
        dadosProcesso.id = processo.id;
        
        const resultado = await apiService.processos.update(processo.id, dadosProcesso);
        
        if (resultado) {
          toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Processo atualizado com sucesso!',
            life: 3000
          });
          
          setTimeout(() => {
            router.push('/processos');
          }, 3000);
        } else {
          console.warn('Atualização realizada, mas sem retorno de dados');
          
          toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Processo parece ter sido atualizado com sucesso!',
            life: 3000
          });
          
          setTimeout(() => {
            router.push('/processos');
          }, 3000);
        }
      } catch (error) {
        console.error('Erro ao salvar processo:', error);
        
        if (error.message && error.message.includes('401')) {
          toast.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
            life: 3000
          });
          
          authService.logout();
          router.push('/login');
          return;
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar as alterações do processo.',
          life: 3000
        });
      } finally {
        salvando.value = false;
      }
    };
    
    const voltar = () => {
      router.push('/processos');
    };
    
    const formatarData = (dataIso) => {
      if (!dataIso) return 'N/A';
      
      try {
        const data = new Date(dataIso);
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(data);
      } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dataIso;
      }
    };
    
    onMounted(() => {
      const processoId = props.id || (route.params && route.params.id);
      if (processoId) {
        carregarProcesso(processoId);
      } else {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do processo não encontrado.',
          life: 3000
        });
        router.push('/processos');
      }
    });
    
    return {
      processo,
      loading,
      salvando,
      atualizarProcesso,
      voltar,
      formatarData
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