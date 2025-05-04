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
  
      <!-- Loading spinner -->
      <div v-if="loading" class="flex justify-content-center">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </div>
  
      <div v-else class="grid">
        <!-- Informações principais -->
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
  
        <!-- Localização -->
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
  
        <!-- Status do processo -->
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
                  <!-- Botão já está no cabeçalho quando o processo não foi visualizado -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Mensagens de erro -->
      <PrimeToast />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ProcessoDetalhes',
    props: {
      id: {
        type: [Number, String],
        required: false
      }
    },
    data() {
      return {
        processo: {
          id: null,
          nomeProcesso: "",
          npu: "",
          dataCadastro: null,
          dataVisualizacao: null,
          uf: "",
          municipio: "",
          codigoMunicipio: ""
        },
        loading: false,
        error: null
      };
    },
    created() {
      // Garantir que temos um ID válido
      const processoId = this.id || (this.$route && this.$route.params && this.$route.params.id);
      
      if (!processoId) {
        console.error("ID do processo não encontrado");
        if (this.$toast) {
          this.$toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'ID do processo não encontrado.',
            life: 3000
          });
        }
        return;
      }
      
      console.log("ID do processo obtido:", processoId);
      this.carregarProcesso(processoId);
    },
    methods: {
        async carregarProcesso(processoId) {
      try {
        this.loading = true;
        
        // Obter o token do localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token de autenticação não encontrado');
          if (this.$toast) {
            this.$toast.add({
              severity: 'error',
              summary: 'Não autorizado',
              detail: 'Token de autenticação não encontrado. Faça login novamente.',
              life: 3000
            });
          }
          if (this.$router) {
            this.$router.push('/login');
          }
          return;
        }
        
        // Usar o ID passado como parâmetro ou obter da rota
        const id = processoId || this.id || (this.$route && this.$route.params && this.$route.params.id);
        
        if (!id) {
          console.error("ID do processo não disponível para carregar dados");
          return;
        }
        
        console.log('Carregando processo com ID:', id);
        
        // Incluir o token na requisição
        const response = await axios.get(`https://localhost:7041/api/processo/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Dados recebidos da API:', response.data);
        this.processo = response.data;
      } catch (error) {
        console.error('Erro ao carregar processo:', error);
        
        // Verificar se é um erro de autenticação
        if (error.response && error.response.status === 401) {
          console.error('Token expirado ou inválido');
          if (this.$toast) {
            this.$toast.add({
              severity: 'error',
              summary: 'Sessão expirada',
              detail: 'Sua sessão expirou. Por favor, faça login novamente.',
              life: 3000
            });
          }
          if (this.$router) {
            this.$router.push('/login');
          }
          return;
        }
        
        if (this.$toast) {
          this.$toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar os detalhes do processo.',
            life: 3000
          });
        }
      } finally {
        this.loading = false;
      }
    },
    async confirmarVisualizacao() {
  try {
    // Obter o token do localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token de autenticação não encontrado');
      if (this.$toast) {
        this.$toast.add({
          severity: 'error',
          summary: 'Não autorizado',
          detail: 'Token de autenticação não encontrado. Faça login novamente.',
          life: 3000
        });
      }
      if (this.$router) {
        this.$router.push('/login');
      }
      return;
    }
    
    // Garantir que temos um ID válido
    const id = this.processo.id || this.id || (this.$route && this.$route.params && this.$route.params.id);
    
    if (!id) {
      console.error("ID do processo não disponível para confirmar visualização");
      if (this.$toast) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do processo não encontrado.',
          life: 3000
        });
      }
      return;
    }
    
    this.loading = true;
    console.log('Confirmando visualização do processo com ID:', id);
    
    // Chamada à API para confirmar visualização com o token
    await axios.post(`https://localhost:7041/api/processo/${id}/confirmar-visualizacao`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Atualiza o status localmente
    this.processo.dataVisualizacao = new Date().toISOString();
    
    // Exibe o toast de sucesso
    if (this.$toast) {
      this.$toast.add({
        severity: 'success',
        summary: 'Visualização Confirmada',
        detail: 'O processo foi marcado como visualizado.',
        life: 4000 
      });
    }
    
    // Aguarda 2 segundos antes de redirecionar (tempo suficiente para o usuário ver o toast)
    setTimeout(() => {
      if (this.$router) {
        this.$router.push('/processos'); // Redireciona para a tela de listagem
      }
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao confirmar visualização:', error);
    
    // Verificar se é um erro de autenticação
    if (error.response && error.response.status === 401) {
      console.error('Token expirado ou inválido');
      if (this.$toast) {
        this.$toast.add({
          severity: 'error',
          summary: 'Sessão expirada',
          detail: 'Sua sessão expirou. Por favor, faça login novamente.',
          life: 3000
        });
      }
      if (this.$router) {
        this.$router.push('/login');
      }
      return;
    }
    
    if (this.$toast) {
      this.$toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível confirmar a visualização do processo.',
        life: 3000
      });
    }
  } finally {
    this.loading = false;
  }
},
      voltar() {
        if (this.$router) {
          this.$router.back();
        } else {
          window.history.back();
        }
      },
      formatarData(dataIso) {
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
          return dataIso; // Retorna a string original em caso de erro
        }
      },
      getStatusText() {
        return this.processo.dataVisualizacao 
          ? 'Visualizado' 
          : 'Aguardando Visualização';
      },
      getStatusSeverity() {
        return this.processo.dataVisualizacao 
          ? 'success' 
          : 'warning';
      },
      getStatusIcon() {
        return this.processo.dataVisualizacao 
          ? 'pi pi-check-circle' 
          : 'pi pi-clock';
      }
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