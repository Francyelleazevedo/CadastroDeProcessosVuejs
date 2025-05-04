<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-bold">
      <i class="pi pi-hashtag mr-2"></i> {{ label }}
    </label>
    <PrimeInputText 
      :id="id" 
      v-model="npuValue" 
      class="w-full p-inputtext-lg"
      :class="{ 'p-invalid': error }"
      :placeholder="placeholder"
      v-mask="'9999999-99.9999.9.99.9999'"
    />
    <small class="text-gray-500 mt-1 block">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'NPUInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'npu'
    },
    label: {
      type: String,
      default: 'NPU'
    },
    placeholder: {
      type: String,
      default: 'Exemplo: 1234567-89.0123.4.56.6677'
    },
    helpText: {
      type: String,
      default: 'Formato padrão: NNNNNNN-NN.NNNN.N.NN.NNNN'
    },
    error: {
      type: String,
      default: ''
    }
  },
  directives: {
    mask: {
      mounted(el, binding) {
        el.addEventListener('input', function(e) {
          const x = binding.value;
          const regex = /[^0-9]/g;
          let value = e.target.value.replace(regex, '');
          
          const digitCount = (binding.value.match(/9/g) || []).length;
          value = value.slice(0, digitCount);
          
          let masked = '';
          let j = 0;
          
          for (let i = 0; i < x.length; i++) {
            if (x[i] === '9' && value[j]) {
              masked += value[j++];
            } else if (x[i] !== '9') {
              masked += x[i];
            }
          }
          
          e.target.value = masked;
          
          el.dispatchEvent(new Event('input'));
        });
      }
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const npuValue = ref(props.modelValue);
    
    watch(() => props.modelValue, (newValue) => {
      npuValue.value = newValue;
    });
    
    watch(npuValue, (newValue) => {
      emit('update:modelValue', newValue);
      emit('change', newValue);
    });
    
    const validarNPU = (npu) => {
      const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
      return regex.test(npu);
    };
    
    return {
      npuValue,
      validarNPU
    };
  }
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
  height: 54px; 
}

:deep(.p-inputtext.p-inputtext-lg) {
  padding: 0.75rem 1rem;
  font-size: 1rem;
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

.text-gray-500 {
  color: #6b7280;
}
</style>