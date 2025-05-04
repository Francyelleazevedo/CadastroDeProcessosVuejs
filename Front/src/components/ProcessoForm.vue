// components/ProcessoForm.vue
<template>
  <div class="grid">
    <div class="col-12 md:col-6 mb-3">
      <div class="field">
        <label for="nomeProcesso" class="block mb-2 font-bold">
          <i class="pi pi-file-o mr-2"></i> Nome do Processo
        </label>
        <PrimeInputText 
          id="nomeProcesso" 
          v-model="formData.nomeProcesso" 
          class="w-full p-inputtext-lg"
          :class="{ 'p-invalid': errors.nomeProcesso }"
        />
        <small v-if="errors.nomeProcesso" class="p-error block mt-1">{{ errors.nomeProcesso }}</small>
      </div>
    </div>
    
    <div class="col-12 md:col-6 mb-3">
      <NPUInput
        v-model="formData.npu"
        :error="errors.npu"
      />
    </div>
    
    <div class="col-12 md:col-6 mb-3">
      <UFSelector
        v-model="formData.uf"
        :error="errors.uf"
        @change="onUFChange"
      />
    </div>
    
    <div class="col-12 md:col-6 mb-3">
      <MunicipioSelector
        v-model="formData.municipio"
        :uf="formData.uf"
        :error="errors.municipio"
        :loading="carregandoMunicipios"
        @codigo-municipio="onCodigoMunicipioChange"
      />
    </div>
  </div>

  <div class="flex justify-content-end gap-2 mt-4">
    <PrimeButton
      :icon="botaoVoltar.icon || 'pi pi-arrow-left'"
      :label="botaoVoltar.label || 'Voltar'"
      class="p-button-secondary p-button-lg"
      @click="voltar"
      :disabled="loading"
    />
    <PrimeButton
      :icon="botaoSubmit.icon || 'pi pi-save'"
      :label="botaoSubmit.label || 'Salvar'"
      class="p-button-primary p-button-lg"
      :loading="loading"
      @click="onSubmit"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { reactive, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import NPUInput from './NpuInput.vue';
import UFSelector from './UfSelector.vue';
import MunicipioSelector from './MunicipioSelector.vue';

export default {
  name: 'ProcessoForm',
  components: {
    NPUInput,
    UFSelector,
    MunicipioSelector
  },
  props: {
    // Valor inicial do formulário
    modelValue: {
      type: Object,
      default: () => ({
        id: null,
        nomeProcesso: "",
        npu: "",
        uf: "",
        municipio: "",
        codigoMunicipio: ""
      })
    },
    // Para controlar o estado de carregamento
    loading: {
      type: Boolean,
      default: false
    },
    // Configuração do botão de salvar
    botaoSubmit: {
      type: Object,
      default: () => ({
        label: 'Salvar',
        icon: 'pi pi-save'
      })
    },
    // Configuração do botão de voltar
    botaoVoltar: {
      type: Object,
      default: () => ({
        label: 'Voltar',
        icon: 'pi pi-arrow-left'
      })
    },
    // Determina se é uma edição (true) ou criação (false)
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'update:modelValue', 'voltar'],
  setup(props, { emit }) {
    const toast = useToast();
    const formData = reactive({ ...props.modelValue });
    const carregandoMunicipios = ref(false);
    const errors = reactive({});
    
    // Observar mudanças no modelValue para sincronizar com formData
    watch(() => props.modelValue, (newValue) => {
      Object.assign(formData, newValue);
    }, { deep: true });
    
    // Emitir mudanças no formData para o componente pai
    watch(formData, (newValue) => {
      emit('update:modelValue', { ...newValue });
    }, { deep: true });
    
    // Quando a UF muda
    // eslint-disable-next-line no-unused-vars
    const onUFChange = () => {
      carregandoMunicipios.value = true;
      // O componente MunicipioSelector vai tratar o carregamento dos municípios internamente
      setTimeout(() => {
        carregandoMunicipios.value = false;
      }, 100);
    };
    
    // Quando o código do município é atualizado pelo componente MunicipioSelector
    const onCodigoMunicipioChange = (codigo) => {
      formData.codigoMunicipio = codigo;
    };
    
    // Validar o formulário
    const validarFormulario = () => {
      // Limpar erros anteriores
      Object.keys(errors).forEach(key => delete errors[key]);
      
      // Validar campos obrigatórios
      if (!formData.nomeProcesso) errors.nomeProcesso = 'O nome do processo é obrigatório';
      if (!formData.npu) errors.npu = 'O NPU é obrigatório';
      if (!formData.uf) errors.uf = 'A UF é obrigatória';
      if (!formData.municipio) errors.municipio = 'O município é obrigatório';
      
      // Validar código do município
      if (formData.municipio && !formData.codigoMunicipio) {
        errors.municipio = 'Código do município não encontrado. Selecione o município novamente.';
      }
      
      // Verificar se há erros
      return Object.keys(errors).length === 0;
    };
    
    // Método para submeter o formulário
    const onSubmit = () => {
      // Validar formulário antes de enviar
      if (!validarFormulario()) {
        toast.add({
          severity: 'warn',
          summary: 'Validação',
          detail: 'Por favor, corrija os erros antes de salvar.',
          life: 3000
        });
        return;
      }
      
      // Verificação adicional para o código do município
      if (!formData.codigoMunicipio && formData.municipio) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível obter o código do município. Por favor, selecione o município novamente.',
          life: 3000
        });
        return;
      }
      
      // Criar objeto com dados formatados para envio
      const dadosProcesso = {
        nomeProcesso: formData.nomeProcesso,
        npu: formData.npu,
        uf: formData.uf,
        municipio: formData.municipio,
        codigoMunicipio: formData.codigoMunicipio?.toString() || ''
      };
      
      // Se for edição, incluir ID
      if (props.isEdit && formData.id) {
        dadosProcesso.id = formData.id;
      }
      
      // Emitir evento de submissão com os dados
      emit('submit', dadosProcesso);
    };
    
    const voltar = () => {
      emit('voltar');
    };
    
    // Inicialização - realizamos essa lógica agora no MunicipioSelector
    
    return {
      formData,
      errors,
      carregandoMunicipios,
      onUFChange,
      onCodigoMunicipioChange,
      onSubmit,
      voltar
    };
  }
};
</script>

<style scoped>
:deep(.p-inputtext.p-inputtext-lg) {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  height: 54px; /* Mantém altura consistente para inputs */
}

:deep(.p-button-lg) {
  /* Ajuste dos botões para tamanho menor */
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  height: 44px; /* Altura reduzida */
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

#nomeProcesso {
  height: 54px;
  width: 100%;
}
</style>