<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-bold">
      <i class="pi pi-map-marker mr-2"></i> {{ label }}
    </label>
    <PrimeDropdown
      :id="id"
      v-model="selectedUF"
      :options="ufs"
      optionLabel="nome"
      optionValue="sigla"
      :placeholder="placeholder"
      class="w-full p-inputtext-lg"
      :class="{ 'p-invalid': error }"
      @change="onChange"
    />
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'UFSelector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'uf'
    },
    label: {
      type: String,
      default: 'UF'
    },
    placeholder: {
      type: String,
      default: 'Selecione a UF'
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const selectedUF = ref(props.modelValue);
    
    const ufs = ref([
      { nome: 'Acre', sigla: 'AC' },
      { nome: 'Alagoas', sigla: 'AL' },
      { nome: 'Amapá', sigla: 'AP' },
      { nome: 'Amazonas', sigla: 'AM' },
      { nome: 'Bahia', sigla: 'BA' },
      { nome: 'Ceará', sigla: 'CE' },
      { nome: 'Distrito Federal', sigla: 'DF' },
      { nome: 'Espírito Santo', sigla: 'ES' },
      { nome: 'Goiás', sigla: 'GO' },
      { nome: 'Maranhão', sigla: 'MA' },
      { nome: 'Mato Grosso', sigla: 'MT' },
      { nome: 'Mato Grosso do Sul', sigla: 'MS' },
      { nome: 'Minas Gerais', sigla: 'MG' },
      { nome: 'Pará', sigla: 'PA' },
      { nome: 'Paraíba', sigla: 'PB' },
      { nome: 'Paraná', sigla: 'PR' },
      { nome: 'Pernambuco', sigla: 'PE' },
      { nome: 'Piauí', sigla: 'PI' },
      { nome: 'Rio de Janeiro', sigla: 'RJ' },
      { nome: 'Rio Grande do Norte', sigla: 'RN' },
      { nome: 'Rio Grande do Sul', sigla: 'RS' },
      { nome: 'Rondônia', sigla: 'RO' },
      { nome: 'Roraima', sigla: 'RR' },
      { nome: 'Santa Catarina', sigla: 'SC' },
      { nome: 'São Paulo', sigla: 'SP' },
      { nome: 'Sergipe', sigla: 'SE' },
      { nome: 'Tocantins', sigla: 'TO' }
    ]);
    
    watch(() => props.modelValue, (newValue) => {
      selectedUF.value = newValue;
    });
    
    watch(selectedUF, (newValue) => {
      emit('update:modelValue', newValue);
    });
    
    const onChange = () => {
      emit('change', selectedUF.value);
    };
    
    return {
      selectedUF,
      ufs,
      onChange
    };
  }
};
</script>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
  height: 54px;
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
</style>