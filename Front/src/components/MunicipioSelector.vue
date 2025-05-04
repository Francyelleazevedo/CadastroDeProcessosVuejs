// components/MunicipioSelector.vue
<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-bold">
      <i class="pi pi-building mr-2"></i> {{ label }}
    </label>
    <PrimeDropdown
      :id="id"
      v-model="selectedMunicipio"
      :options="municipios"
      optionLabel="nome"
      optionValue="nome"
      :disabled="!uf || isLoading"
      :placeholder="placeholder"
      class="w-full p-inputtext-lg"
      :class="{ 'p-invalid': error }"
      @change="onChange"
      :loading="isLoading"
    />
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
    <small class="text-orange-500 block mt-1" v-else-if="selectedMunicipio && !codigoMunicipio">
      Atenção: Código do município não disponível
    </small>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'MunicipioSelector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    uf: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'municipio'
    },
    label: {
      type: String,
      default: 'Município'
    },
    placeholder: {
      type: String,
      default: 'Selecione o Município'
    },
    error: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change', 'codigo-municipio'],
  setup(props, { emit }) {
    const toast = useToast();
    const selectedMunicipio = ref(props.modelValue);
    const municipios = ref([]);
    const isLoading = ref(props.loading);
    const codigoMunicipio = ref('');
    
    // Observar mudanças no valor do modelo
    watch(() => props.modelValue, (newValue) => {
      selectedMunicipio.value = newValue;
    });
    
    // Observar mudanças no loading
    watch(() => props.loading, (newValue) => {
      isLoading.value = newValue;
    });
    
    // Emitir mudanças para o componente pai
    watch(selectedMunicipio, (newValue) => {
      emit('update:modelValue', newValue);
    });
    
    // Observar mudanças na UF para carregar municípios
    watch(() => props.uf, async (newUF) => {
      if (newUF) {
        await carregarMunicipios(newUF);
      } else {
        municipios.value = [];
        selectedMunicipio.value = '';
        codigoMunicipio.value = '';
        emit('codigo-municipio', '');
      }
    });
    
    // Carregar municípios com base na UF selecionada
    const carregarMunicipios = async (uf) => {
      if (!uf) return;
      
      try {
        isLoading.value = true;
        
        // Limpar lista de municípios enquanto carrega
        municipios.value = [];
        
        // Usar API do IBGE
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar municípios para UF ${uf}`);
        }
        
        const data = await response.json();
        
        // Mapear dados para o formato esperado
        municipios.value = data.map(municipio => ({
          nome: municipio.nome,
          codigo: municipio.id.toString()
        }));
        
        console.log(`${municipios.value.length} municípios carregados para UF ${uf}`);
        
        // Se tinha um município selecionado anteriormente, verificar se ainda está disponível
        if (selectedMunicipio.value) {
          const municipioAindaExiste = municipios.value.find(m => m.nome === selectedMunicipio.value);
          
          if (municipioAindaExiste) {
            // O município ainda existe na nova lista, manter selecionado e atualizar código
            codigoMunicipio.value = municipioAindaExiste.codigo;
            emit('codigo-municipio', codigoMunicipio.value);
            console.log(`Município mantido após troca de UF: ${selectedMunicipio.value} (${codigoMunicipio.value})`);
          } else {
            // O município não existe mais na nova lista, limpar seleção
            console.warn(`Município anterior '${selectedMunicipio.value}' não está disponível para a UF ${uf}`);
            selectedMunicipio.value = '';
            codigoMunicipio.value = '';
            emit('codigo-municipio', '');
            
            // Exibir alerta
            toast.add({
              severity: 'info',
              summary: 'Município alterado',
              detail: `O município selecionado não está disponível para a UF selecionada. Por favor, selecione outro município.`,
              life: 3000
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de municípios.',
          life: 3000
        });
      } finally {
        isLoading.value = false;
      }
    };
    
    // Quando o usuário seleciona um município
    const onChange = () => {
      atualizarCodigoMunicipio();
      emit('change', selectedMunicipio.value);
    };
    
    // Atualizar o código do município quando um é selecionado
    const atualizarCodigoMunicipio = () => {
      // Limpar o código do município se não houver município selecionado
      if (!selectedMunicipio.value) {
        codigoMunicipio.value = '';
        emit('codigo-municipio', '');
        return;
      }
      
      // Buscar o município na lista de municípios carregados
      const municipioSelecionado = municipios.value.find(m => m.nome === selectedMunicipio.value);
      
      if (municipioSelecionado) {
        // Atualizar o código do município com o valor da lista
        codigoMunicipio.value = municipioSelecionado.codigo;
        emit('codigo-municipio', codigoMunicipio.value);
        console.log(`Código do município atualizado: ${selectedMunicipio.value} -> ${codigoMunicipio.value}`);
      } else {
        console.error(`Município selecionado não encontrado na lista: ${selectedMunicipio.value}`);
        codigoMunicipio.value = '';
        emit('codigo-municipio', '');
        
        // Alertar usuário
        toast.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível encontrar o código para o município selecionado. Por favor, selecione novamente.',
          life: 3000
        });
      }
    };
    
    // Inicialização
    onMounted(() => {
      // Se já houver uma UF definida, carregar os municípios
      if (props.uf) {
        carregarMunicipios(props.uf);
      }
    });
    
    return {
      selectedMunicipio,
      municipios,
      isLoading,
      codigoMunicipio,
      onChange
    };
  }
};
</script>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
  height: 54px; /* Garante altura consistente */
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 3rem;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--primary-color), 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

:deep(.p-inputtext.p-invalid) {
  border-color: var(--red-500);
}

.p-error {
  color: var(--red-500);
}

.text-orange-500 {
  color: #f97316;
}
</style>