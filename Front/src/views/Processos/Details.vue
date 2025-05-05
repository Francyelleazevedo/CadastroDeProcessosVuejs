<template>
  <div class="card p-4">
    <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-4">
      <h1 class="text-2xl font-bold m-0">Detalhes do Processo</h1>
      <div class="flex gap-2 mt-3 md:mt-0">
        <PrimeButton
          icon="pi pi-arrow-left"
          label="Voltar"
          class="p-button-secondary"
          @click="voltar"
        />
        <PrimeButton
          v-if="!processo.dataVisualizacao"
          icon="pi pi-check"
          label="Confirmar Visualização"
          class="p-button-success"
          @click="confirmarVisualizacao"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-content-center">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else class="grid">
      <div class="col-12 md:col-6">
        <div class="card h-full">
          <div class="card-header flex align-items-center">
            <i class="pi pi-file-o mr-2 text-xl"></i>
            <span class="text-xl font-semibold">Informações Principais</span>
          </div>
          <div class="card-body">
            <div class="grid">
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">Nome:</span>
                  <span>{{ processo.nomeProcesso }}</span>
                </div>
              </div>
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">NPU:</span>
                  <span>{{ processo.npu }}</span>
                </div>
              </div>
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">ID:</span>
                  <span>{{ processo.id }}</span>
                </div>
              </div>
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">Cadastro:</span>
                  <span>{{ formatarData(processo.dataCadastro) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6">
        <div class="card h-full">
          <div class="card-header flex align-items-center">
            <i class="pi pi-map-marker mr-2 text-xl"></i>
            <span class="text-xl font-semibold">Localização</span>
          </div>
          <div class="card-body">
            <div class="grid">
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">UF:</span>
                  <span>{{ processo.uf }}</span>
                </div>
              </div>
              <div class="col-12 mb-3">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">Município:</span>
                  <span>{{ processo.municipio }}</span>
                </div>
              </div>
              <div class="col-12">
                <div class="flex align-items-center">
                  <span class="font-semibold w-10rem">Código Município:</span>
                  <span>{{ processo.codigoMunicipio }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="card">
          <div class="card-header flex align-items-center">
            <i class="pi pi-info-circle mr-2 text-xl"></i>
            <span class="text-xl font-semibold">Status do Processo</span>
          </div>
          <div class="card-body">
            <div class="flex flex-wrap gap-3 justify-content-between">
              <div class="flex align-items-center">
                <span class="font-semibold mr-2">Status atual:</span>
                <PrimeTag 
                  :severity="getStatusSeverity()" 
                  :value="getStatusText()"
                  :icon="getStatusIcon()"
                />
              </div>
              <div v-if="!processo.dataVisualizacao">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PrimeToast />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import apiService from '@/services/api.service';
import authService from '@/services/auth.service';

export default {
  name: 'ProcessoDetalhes',
  props: {
    id: {
      type: [Number, String],
      required: false
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

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
    const error = ref(null);

    const carregarProcesso = async (processoId) => {
      try {
        loading.value = true;
        
        // Verifica autenticação usando authService
        if (!authService.isAuthenticated()) {
          console.error('Token de autenticação não encontrado');
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado. Faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        const id = processoId || props.id || route.params.id;
        
        if (!id) {
          console.error("ID do processo não disponível para carregar dados");
          return;
        }
        
        console.log('Carregando processo com ID:', id);
        
        // Usa apiService para obter dados do processo
        const data = await apiService.processos.getById(id);
        
        console.log('Dados recebidos da API:', data);
        
        // Atualiza o objeto reativo com os dados recebidos
        Object.assign(processo, data);
      } catch (error) {
        console.error('Erro ao carregar processo:', error);
        
        // Verificar se é um erro de autenticação
        if (error.message && error.message.includes('401')) {
          console.error('Token expirado ou inválido');
          toast.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
            life: 3000
          });
          
          // Faz logout e redireciona para login
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

    const confirmarVisualizacao = async () => {
      try {
        // Verifica autenticação usando authService
        if (!authService.isAuthenticated()) {
          console.error('Token de autenticação não encontrado');
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado. Faça login novamente.',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        const id = processo.id || props.id || route.params.id;
        
        if (!id) {
          console.error("ID do processo não disponível para confirmar visualização");
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'ID do processo não encontrado.',
            life: 3000
          });
          return;
        }
        
        loading.value = true;
        console.log('Confirmando visualização do processo com ID:', id);
        
        // Usa apiService para confirmar visualização
        await apiService.visualizacao.confirmarVisualizacao(id);
        
        processo.dataVisualizacao = new Date().toISOString();
        
        toast.add({
          severity: 'success',
          summary: 'Visualização Confirmada',
          detail: 'O processo foi marcado como visualizado.',
          life: 4000 
        });
        
        setTimeout(() => {
          router.push('/processos'); 
        }, 2000);
        
      } catch (error) {
        console.error('Erro ao confirmar visualização:', error);
        
        if (error.message && error.message.includes('401')) {
          console.error('Token expirado ou inválido');
          toast.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
            life: 3000
          });
          
          // Faz logout e redireciona para login
          authService.logout();
          router.push('/login');
          return;
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível confirmar a visualização do processo.',
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    const voltar = () => {
      router.back();
    };

    const formatarData = (dataIso) => {
      if (!dataIso) return '';
      
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

    const getStatusText = () => {
      return processo.dataVisualizacao 
        ? 'Visualizado' 
        : 'Aguardando Visualização';
    };

    const getStatusSeverity = () => {
      return processo.dataVisualizacao 
        ? 'success' 
        : 'warning';
    };

    const getStatusIcon = () => {
      return processo.dataVisualizacao 
        ? 'pi pi-check-circle' 
        : 'pi pi-clock';
    };

    onMounted(() => {
      const processoId = props.id || route.params.id;
      
      if (!processoId) {
        console.error("ID do processo não encontrado");
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do processo não encontrado.',
          life: 3000
        });
        return;
      }
      
      console.log("ID do processo obtido:", processoId);
      carregarProcesso(processoId);
    });

    return {
      processo,
      loading,
      error,
      carregarProcesso,
      confirmarVisualizacao,
      voltar,
      formatarData,
      getStatusText,
      getStatusSeverity,
      getStatusIcon
    };
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.card-body {
  padding: 1.5rem;
}
</style>