<template>
  <div class="dashboard-container">
    <PrimeToast position="top-right" />
    
    <div class="grid">
      <div class="col-12">
        <div class="page-header">
          <h1><i class="pi pi-chart-bar"></i> Dashboard</h1>
          <div class="period-selector">
            <span class="period-label">Período:</span>
            <PrimeDropdown v-model="periodoSelecionado" :options="periodos" 
                      optionLabel="nome" class="period-dropdown" 
                      @change="buscarDados" />
          </div>
        </div>
      </div>

      <div class="col-12 md:col-4">
        <div class="stat-card">
          <div class="stat-icon total-bg">
            <i class="pi pi-inbox"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">Total de Processos</div>
            <div class="stat-value">{{ totalProcessos }}</div>
            <div class="stat-progress">
              <div class="progress-bar" :style="{width: '100%'}"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-4">
        <div class="stat-card">
          <div class="stat-icon pending-bg">
            <i class="pi pi-eye-slash"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">Não Visualizados</div>
            <div class="stat-value">{{ processosSemVisualizacao }}</div>
            <div class="stat-progress">
              <div class="progress-bar pending-bar" 
                   :style="{width: calcProgressWidth(processosSemVisualizacao, totalProcessos)}"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-4">
        <div class="stat-card">
          <div class="stat-icon recent-bg">
            <i class="pi pi-calendar"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">Últimos 30 dias</div>
            <div class="stat-value">{{ processosUltimos30Dias }}</div>
            <div class="stat-progress">
              <div class="progress-bar recent-bar" 
                   :style="{width: calcProgressWidth(processosUltimos30Dias, totalProcessos)}"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-8">
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Processos por UF</h2>
            <div class="card-actions">
              <PrimeButton icon="pi pi-refresh" class="p-button-rounded p-button-text" 
                     @click="buscarDados" v-tooltip="'Atualizar'" />
            </div>
          </div>
          <div class="card-body">
            <div v-if="carregando" class="loader-container">
              <PrimeProgressSpinner />
              <div class="loading-text">Carregando dados...</div>
            </div>
            <div v-else-if="erro" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ erro }}</span>
            </div>
            <div v-else>
              <div class="chart-container">
                <PrimeChart type="bar" :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-4">
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Processos Recentes</h2>
            <div class="card-actions">
              <PrimeButton icon="pi pi-arrow-right" class="p-button-rounded p-button-text" 
                     @click="verTodosProcessos" v-tooltip="'Ver todos'" />
            </div>
          </div>
          <div class="card-body p-0">
            <div v-if="carregando" class="loader-container">
              <PrimeProgressSpinner />
              <div class="loading-text">Carregando dados...</div>
            </div>
            <div v-else-if="erro" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ erro }}</span>
            </div>
            <div v-else class="recent-processes">
              <div v-for="processo in processosRecentes" :key="processo.id" class="recent-item">
                <div class="recent-item-icon">
                  <PrimeAvatar icon="pi pi-file" size="large" shape="circle" />
                </div>
                <div class="recent-item-content">
                  <div class="recent-item-title">{{ processo.nomeProcesso }}</div>
                  <div class="recent-item-subtitle">{{ processo.npu }}</div>
                  <div class="recent-item-details">
                    <PrimeTag :value="processo.uf" severity="info" class="mr-2" />
                    <span class="recent-date">{{ formatarData(processo.dataCadastro) }}</span>
                  </div>
                </div>
              </div>
              <div v-if="processosRecentes.length === 0" class="no-data">
                Nenhum processo recente encontrado
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Distribuição Regional de Processos</h2>
          </div>
          <div class="card-body">
            <div v-if="carregando" class="loader-container">
              <PrimeProgressSpinner />
              <div class="loading-text">Carregando dados...</div>
            </div>
            <div v-else-if="erro" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ erro }}</span>
            </div>
            <div v-else>
              <div class="chart-container">
                <PrimeChart type="doughnut" :data="pieChartData" :options="pieChartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiService from '@/services/api.service';
import authService from '@/services/auth.service';

export default {
  name: 'DashboardView',
  setup() {
    const toast = useToast();
    const router = useRouter();
    const totalProcessos = ref(0);
    const processosSemVisualizacao = ref(0);
    const processosUltimos30Dias = ref(0);
    const processosPorUF = ref({});
    const processosRecentes = ref([]);
    const carregando = ref(true);
    const erro = ref(null);

    const periodos = [
      { id: 1, nome: 'Mês atual' },
      { id: 2, nome: 'Mês anterior' },
      { id: 3, nome: 'Trimestre atual' },
      { id: 4, nome: 'Ano atual' }
    ];
    const periodoSelecionado = ref(periodos[0]);

    const calcProgressWidth = (value, total) => {
      if (!total) return '0%';
      const percentage = (value / total) * 100;
      return `${Math.min(percentage, 100)}%`;
    };

    const chartData = computed(() => {
      const labels = Object.keys(processosPorUF.value).map(uf => uf.toUpperCase());
      const dados = Object.values(processosPorUF.value);
      
      return {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade de Processos',
            backgroundColor: '#6366F1',
            hoverBackgroundColor: '#4F46E5',
            borderColor: '#6366F1',
            data: dados,
            borderRadius: 8
          }
        ]
      };
    });

    const chartOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 14
          },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: {
              size: 12
            }
          },
          grid: {
            display: true,
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    const pieChartData = computed(() => {
      const labels = Object.keys(processosPorUF.value).map(uf => uf.toUpperCase());
      const dados = Object.values(processosPorUF.value);
      const total = dados.reduce((acc, curr) => acc + curr, 0);
      
      const porcentagens = dados.map(valor => 
        total > 0 ? ((valor / total) * 100) : 0
      );
      
      return {
        labels: labels,
        datasets: [
          {
            data: porcentagens,
            backgroundColor: [
              '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316',
              '#FBBF24', '#84CC16', '#10B981', '#06B6D4', '#3B82F6'
            ],
            hoverBackgroundColor: [
              '#4F46E5', '#7C3AED', '#DB2777', '#E11D48', '#EA580C',
              '#D97706', '#65A30D', '#059669', '#0891B2', '#2563EB'
            ],
            borderWidth: 0
          }
        ]
      };
    });

    const pieChartOptions = {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            font: {
              size: 12
            },
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              const labels = chart.data.labels;
              
              return labels.map((label, i) => {
                const value = datasets[0].data[i];
                return {
                  text: `${label}: ${value.toFixed(1)}%`,
                  fillStyle: datasets[0].backgroundColor[i],
                  hidden: isNaN(datasets[0].data[i]) || datasets[0].data[i] === 0,
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 14
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false
    };

    const formatarData = (dataString) => {
      if (!dataString) return '';
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    };

    const buscarDados = async () => {
      carregando.value = true;
      erro.value = null;
      
      const dataAtual = new Date();
      let mes = dataAtual.getMonth() + 1;
      let ano = dataAtual.getFullYear();
      
      if (periodoSelecionado.value.id === 2) {
        // Mês anterior
        mes = mes - 1;
        if (mes === 0) {
          mes = 12;
          ano = ano - 1;
        }
      } else if (periodoSelecionado.value.id === 3) {
        // Implementação futura para trimestre atual
      } else if (periodoSelecionado.value.id === 4) {
        // Implementação futura para ano atual
      }
      
      try {
        if (!authService.isAuthenticated()) {
          throw new Error('Token não encontrado. Faça login novamente.');
        }
        
        const data = await apiService.relatorios.getMensal(mes, ano);
        
        totalProcessos.value = data.totalProcessos || 0;
        processosSemVisualizacao.value = data.processosSemVisualizacao || 0;
        processosUltimos30Dias.value = data.processosUltimos30Dias || 0;
        processosPorUF.value = data.processosPorUF || {};
        processosRecentes.value = data.processosRecentes || [];
        
        toast.add({
          severity: 'success',
          summary: 'Dados carregados',
          detail: 'Dados do dashboard atualizados com sucesso',
          life: 3000
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        
        if (error.toString().includes('Token não encontrado')) {
          erro.value = 'Erro de autenticação. Faça login novamente.';
          router.push('/login');
        } else {
          erro.value = 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.';
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro.value,
          life: 5000
        });
      } finally {
        carregando.value = false;
      }
    };

    const verTodosProcessos = () => {
      router.push('/processos');
    };

    const verDetalhesProcesso = (processo) => {
      router.push(`/processos/${processo.id}`);
    };

    onMounted(() => {
      buscarDados();
    });

    return {
      totalProcessos,
      processosSemVisualizacao,
      processosUltimos30Dias,
      processosPorUF,
      processosRecentes,
      carregando,
      erro,
      periodos,
      periodoSelecionado,
      chartData,
      chartOptions,
      pieChartData,
      pieChartOptions,
      formatarData,
      calcProgressWidth,
      buscarDados,
      verTodosProcessos,
      verDetalhesProcesso
    };
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin: 0;
}

.page-header h1 i {
  margin-right: 0.75rem;
  color: #6366f1;
}

.period-selector {
  display: flex;
  align-items: center;
}

.period-label {
  font-weight: 500;
  color: #64748b;
  margin-right: 0.75rem;
}

.period-dropdown {
  min-width: 180px;
}

.stat-card {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  color: white;
  font-size: 1.5rem;
}

.total-bg {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
}

.pending-bg {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
}

.recent-bg {
  background: linear-gradient(135deg, #10b981, #06b6d4);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.stat-progress {
  width: 100%;
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #6366f1, #3b82f6);
  border-radius: 3px;
}

.pending-bar {
  background: linear-gradient(to right, #ec4899, #f43f5e);
}

.recent-bar {
  background: linear-gradient(to right, #10b981, #06b6d4);
}

.dashboard-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.card-body.p-0 {
  padding: 0;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-text {
  margin-top: 1rem;
  color: #64748b;
  font-weight: 500;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #f43f5e;
  text-align: center;
}

.error-message i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.recent-processes {
  padding: 0.5rem 0;
}

.recent-item {
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background-color: #f8fafc;
}

.recent-item-icon {
  margin-right: 1rem;
}

.recent-item-content {
  flex: 1;
  min-width: 0;
}

.recent-item-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-item-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.recent-item-details {
  display: flex;
  align-items: center;
}

.recent-date {
  font-size: 0.875rem;
  color: #94a3b8;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #94a3b8;
  font-style: italic;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .period-selector {
    margin-top: 1rem;
    width: 100%;
  }
  
  .period-dropdown {
    width: 100%;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>