<template>
  <div class="card">
    <div class="flex align-items-center justify-content-between mb-4">
      <h2 class="text-primary font-bold text-2xl">Processos Cadastrados</h2>
      
      <div class="flex align-items-center gap-3">
        <div class="custom-search-container">
          <i class="pi pi-search custom-search-icon"></i>
          <PrimeInputText 
            v-model="globalFilterValue" 
            placeholder="Pesquisar..." 
            class="custom-search-input p-inputtext-sm"
          />
          <i v-if="globalFilterValue" class="pi pi-times custom-clear-icon cursor-pointer" @click="clearFilter"></i>
        </div>
        
        <PrimeButton 
          label="Novo Processo" 
          icon="pi pi-plus" 
          class="p-button-success" 
          @click="navigateToCreate" 
        />
      </div>
    </div>

    <PrimeDataTable 
      :value="processos.items" 
      v-model:filters="filters"
      :globalFilterFields="['npu', 'nomeProcesso', 'uf', 'municipio']"
      stripedRows
      rowHover
      :paginator="false"
      :rows="10"
      dataKey="id"
      :loading="loading"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <template #empty>
        <div class="text-center p-4">
          <i class="pi pi-folder-open text-500" style="font-size: 2rem"></i>
          <p class="mt-2">Nenhum processo encontrado</p>
        </div>
      </template>
      
      <template #loading>
        <div class="text-center p-4">
          <i class="pi pi-spin pi-spinner text-primary" style="font-size: 2rem"></i>
          <p class="mt-2">Carregando processos...</p>
        </div>
      </template>

      <PrimeColumn field="npu" header="NPU" sortable></PrimeColumn>
      <PrimeColumn field="nomeProcesso" header="Nome do Processo" sortable></PrimeColumn>
      
      <PrimeColumn field="dataVisualizacao" header="Data de Visualização" sortable>
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.dataVisualizacao) }}</span>
        </template>
      </PrimeColumn>
      
      <PrimeColumn field="uf" header="UF" sortable>
        <template #body="slotProps">
          <span>{{ slotProps.data.uf || 'N/A' }}</span>
        </template>
      </PrimeColumn>
      
      <PrimeColumn field="municipio" header="Município" sortable></PrimeColumn>
      
      <PrimeColumn header="Ações" :exportable="false" style="width: 120px; text-align: center">
        <template #body="slotProps">
          <div class="flex justify-content-around">
            <PrimeButton 
              icon="pi pi-search" 
              class="p-button-text p-button-sm p-button-info" 
              @click="viewProcessoDetails(slotProps.data)" 
              v-tooltip.top="'Visualizar'"
            />
            <PrimeButton 
              icon="pi pi-file-edit" 
              class="p-button-text p-button-sm p-button-warning" 
              @click="editProcesso(slotProps.data)" 
              v-tooltip.top="'Editar'"
            />
            <PrimeButton 
              icon="pi pi-trash" 
              class="p-button-text p-button-sm p-button-danger" 
              @click="confirmDelete(slotProps.data)" 
              v-tooltip.top="'Excluir'"
            />
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>

    <div class="flex justify-content-between align-items-center mt-3">
      <p class="text-sm text-500 m-0">
        Total: {{ processos.totalItems }} processo(s)
      </p>
      
      <PrimePaginator 
        :rows="10"
        :totalRecords="processos.totalItems"
        v-model:first="first"
        :rowsPerPageOptions="[10, 20, 50]"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        @page="onPageChange($event)"
      />
    </div>

    <PrimeDialog 
      v-model:visible="deleteDialogVisible"
      :modal="true"
      :closable="false"
      :dismissableMask="true"
      :style="{ width: '450px', borderRadius: '12px' }"
      position="top"
      class="delete-confirmation-dialog"
    >
      <template #header>
        <div class="flex align-items-center">
          <i class="pi pi-exclamation-triangle text-yellow-500 mr-2" style="font-size: 1.5rem"></i>
          <h3 class="m-0 font-medium">Confirmar Exclusão</h3>
        </div>
      </template>
      
      <div class="p-2">
        <p class="mb-3 text-lg">Tem certeza que deseja excluir este processo?</p>
        
        <div class="surface-50 p-3 border-round">
          <div class="process-info-item mb-2">
            <span class="font-bold">NPU:</span>
            <span>{{ selectedProcesso?.npu || 'N/A' }}</span>
          </div>
          <div class="process-info-item">
            <span class="font-bold">Nome:</span>
            <span>{{ selectedProcesso?.nomeProcesso || 'Sem nome' }}</span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <PrimeButton 
            label="Não" 
            icon="pi pi-times"
            class="p-button-text confirm-button" 
            @click="closeDeleteDialog"
            autofocus
          />
          <PrimeButton 
            label="Sim"
            icon="pi pi-check" 
            class="p-button-danger confirm-button" 
            @click="deleteProcesso"
            :loading="deleteLoading"
          />
        </div>
      </template>
    </PrimeDialog>

    <PrimeToast position="top-right" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import apiService from '@/services/api.service';
import authService from '@/services/auth.service';

export default {
  name: 'ProcessosList',
  
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    const processos = ref({
      items: [],
      totalItems: 0,
      pageNumber: 1,
      totalPages: 0
    });
    
    const loading = ref(false);
    const deleteLoading = ref(false);
    const deleteDialogVisible = ref(false);
    const selectedProcesso = ref(null);
    const globalFilterValue = ref('');
    const first = ref(0); 
    const lazyParams = ref({
      page: 1,
      rows: 10,
      sortField: null,
      sortOrder: null
    });
    
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      npu: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nomeProcesso: { value: null, matchMode: FilterMatchMode.CONTAINS },
      uf: { value: null, matchMode: FilterMatchMode.EQUALS },
      municipio: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    
    watch(globalFilterValue, (newValue) => {
      filters.value.global.value = newValue;
    });

    const fetchProcessos = async () => {
      loading.value = true;
      try {
        // Verifica se o usuário está autenticado
        if (!authService.isAuthenticated()) {
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        // Constrói a string de consulta da mesma forma que estava antes
        const page = lazyParams.value.page;
        const pageSize = lazyParams.value.rows;
        const sortField = lazyParams.value.sortField || '';
        const sortOrder = lazyParams.value.sortOrder || 1;
        
        // URL com querystring no formato exato que a API espera
        const queryParams = `page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`;
        
        // Usa o apiService.get diretamente para preservar a compatibilidade exata com a API
        const data = await apiService.processos.getAll({ params: queryParams });
        processos.value = data;
        
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
        
        // Verifica se é um erro de autenticação
        if (error.message && error.message.includes('401')) {
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
          detail: 'Ocorreu um erro ao carregar os processos',
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };
    
    const onPage = (event) => {
      lazyParams.value = {
        ...lazyParams.value,
        page: event.page + 1,
        rows: event.rows
      };
      fetchProcessos();
    };
    
    const onPageChange = (event) => {
      lazyParams.value = {
        ...lazyParams.value,
        page: event.page + 1,
        rows: event.rows
      };
      fetchProcessos();
    };
    
    const onSort = (event) => {
      lazyParams.value = {
        ...lazyParams.value,
        sortField: event.sortField,
        sortOrder: event.sortOrder
      };
      fetchProcessos();
    };

    const clearFilter = () => {
      globalFilterValue.value = '';
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (e) {
        return 'Data inválida';
      }
    };
    
    const navigateToCreate = () => {
      router.push('/processos/criar');
    };
    
    const viewProcessoDetails = (processo) => {
      router.push(`/processos/${processo.id}`);
    };
    
    const editProcesso = (processo) => {
      router.push(`/processos/editar/${processo.id}`);
    };
    
    const confirmDelete = (processo) => {
      selectedProcesso.value = processo;
      deleteDialogVisible.value = true;
    };
    
    const closeDeleteDialog = () => {
      deleteDialogVisible.value = false;
      selectedProcesso.value = null;
    };
    
    const deleteProcesso = async () => {
      deleteLoading.value = true;
      
      try {
        // Verifica se o usuário está autenticado
        if (!authService.isAuthenticated()) {
          toast.add({
            severity: 'error',
            summary: 'Não autorizado',
            detail: 'Token de autenticação não encontrado',
            life: 3000
          });
          router.push('/login');
          return;
        }
        
        // Usa o apiService para excluir o processo
        await apiService.processos.delete(selectedProcesso.value.id);
        
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Processo excluído com sucesso',
          life: 3000
        });
        
        fetchProcessos();
        closeDeleteDialog();
      } catch (error) {
        console.error('Erro ao excluir processo:', error);
        
        // Verifica se é um erro de autenticação
        if (error.message && error.message.includes('401')) {
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
          detail: 'Ocorreu um erro ao excluir o processo',
          life: 3000
        });
      } finally {
        deleteLoading.value = false;
      }
    };
    
    onMounted(() => {
      fetchProcessos();
    });
    
    return {
      processos,
      loading,
      deleteLoading,
      filters,
      globalFilterValue,
      deleteDialogVisible,
      selectedProcesso,
      first, 
      formatDate,
      navigateToCreate,
      viewProcessoDetails,
      editProcesso,
      confirmDelete,
      closeDeleteDialog,
      deleteProcesso,
      clearFilter,
      onPage,
      onPageChange, 
      onSort
    };
  }
};
</script>
  
<style scoped>
.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

:deep(.p-datatable) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.p-datatable-header) {
  background: #f8f9fa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

:deep(.p-datatable-rounded) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.p-datatable .p-sortable-column:not(.p-highlight):hover) {
  background: rgba(var(--primary-color-rgb), 0.04);
}

:deep(.p-datatable .p-sortable-column.p-highlight) {
  background: rgba(var(--primary-color-rgb), 0.08);
  color: var(--primary-color);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(var(--primary-color-rgb), 0.02);
}

:deep(.p-button.p-button-rounded) {
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.p-button.p-button-outlined:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

:deep(.delete-confirmation-dialog .p-dialog-header) {
  padding: 1.25rem 1.5rem 0.5rem;
  border-bottom: none;
}

:deep(.delete-confirmation-dialog .p-dialog-content) {
  padding: 0 1.5rem 1rem;
  border-bottom: none;
}

:deep(.delete-confirmation-dialog .p-dialog-footer) {
  padding: 0 1.5rem 1.5rem;
  border-top: none;
}

:deep(.delete-confirmation-dialog) {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.process-info-list {
  padding-left: 0;
}

.process-info-item {
  display: flex;
  align-items: center;
  padding-left: 0; 
}

.process-info-item .font-bold {
  width: 70px; 
  display: inline-block;
}

.confirm-button {
  height: 2.5rem !important;
  min-width: 6rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-search-container {
  position: relative;
  display: inline-block;
}

.custom-search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 1;
}

.custom-search-input {
  padding-left: 40px !important;
  width: 250px;
}

.custom-clear-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

:root {
  --primary-color-rgb: 25, 118, 210;
}
</style>