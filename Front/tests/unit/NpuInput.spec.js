import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import NPUInput from '../../src/components/NpuInput.vue';
import { nextTick } from 'vue';

describe('NPUInput', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(NPUInput, {
      global: {
        stubs: {
          PrimeInputText: {
            template: '<input type="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue'],
            emits: ['update:modelValue']
          }
        }
      },
      props: {
        modelValue: '',
        id: 'npu',
        label: 'NPU',
        placeholder: 'Exemplo: 1234567-89.0123.4.56.6677',
        helpText: 'Formato padrão: NNNNNNN-NN.NNNN.N.NN.NNNN',
        error: ''
      }
    });
  });
  
  afterEach(() => {
    wrapper.unmount();
  });
  
  it('renderiza corretamente com props personalizadas', async () => {
    await wrapper.setProps({
      id: 'codigo-npu',
      label: 'Código NPU',
      placeholder: 'Digite o NPU',
      helpText: 'Número do processo unificado'
    });
    
    expect(wrapper.find('label').text()).toContain('Código NPU');
    expect(wrapper.find('input').attributes('placeholder')).toBe('Digite o NPU');
    expect(wrapper.find('.text-gray-500').text()).toBe('Número do processo unificado');
  });
  
  
  it('atualiza v-model quando o valor muda', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('1234567-89.0123.4.56.7890');
    await nextTick();
    
    // Verificar se o evento update:modelValue foi emitido
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['1234567-89.0123.4.56.7890']);
  });
  
  it('atualiza o valor do input quando modelValue muda', async () => {
    await wrapper.setProps({ modelValue: '9876543-21.0987.6.54.3210' });
    await nextTick();
    
    expect(wrapper.vm.npuValue).toBe('9876543-21.0987.6.54.3210');
  });
  
  it('emite evento change quando o valor muda', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('1234567-89.0123.4.56.7890');
    await nextTick();
    
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')[0]).toEqual(['1234567-89.0123.4.56.7890']);
  });
  
  it('adiciona classe p-invalid quando há erro', async () => {
    expect(wrapper.find('input').classes()).not.toContain('p-invalid');
    
    await wrapper.setProps({ error: 'NPU inválido' });
    await nextTick();
    
    expect(wrapper.find('input').classes()).toContain('p-invalid');
  });
  
  it('exibe mensagem de erro quando fornecida', async () => {
    // Verificar que inicialmente não há mensagem de erro
    expect(wrapper.find('.p-error').exists()).toBe(false);
    
    await wrapper.setProps({ error: 'NPU inválido' });
    await nextTick();
    
    // Verificar se a mensagem de erro é exibida
    const errorMsg = wrapper.find('.p-error');
    expect(errorMsg.exists()).toBe(true);
    expect(errorMsg.text()).toBe('NPU inválido');
  });
  
  it('valida o NPU corretamente', () => {
    // NPU válido
    expect(wrapper.vm.validarNPU('1234567-89.0123.4.56.7890')).toBe(true);
    
    // NPUs inválidos
    expect(wrapper.vm.validarNPU('123456-89.0123.4.56.7890')).toBe(false); // Faltando um dígito no início
    expect(wrapper.vm.validarNPU('1234567890123456789')).toBe(false); // Sem formatação
    expect(wrapper.vm.validarNPU('1234567-89.0123.456.7890')).toBe(false); // Formato incorreto
  });
})