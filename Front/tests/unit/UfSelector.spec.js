import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import UFSelector from '../../src/components/UfSelector.vue';
import { nextTick } from 'vue';

describe('UFSelector', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallowMount(UFSelector, {
      global: {
        stubs: {
          PrimeDropdown: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" @change="$emit(\'change\')" />',
            props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder'],
            emits: ['update:modelValue', 'change']
          }
        }
      },
      props: {
        modelValue: '',
        id: 'uf',
        label: 'UF',
        placeholder: 'Selecione a UF',
        error: ''
      }
    });
  });
  
  afterEach(() => {
    wrapper.unmount();
  });
  
  it('renderiza corretamente com props personalizadas', async () => {
    await wrapper.setProps({
      id: 'estado',
      label: 'Estado',
      placeholder: 'Escolha o Estado',
      error: 'Campo obrigatório'
    });
    
    expect(wrapper.find('label').text()).toContain('Estado');
    
    expect(wrapper.find('.p-error').exists()).toBe(true);
    expect(wrapper.find('.p-error').text()).toBe('Campo obrigatório');
  });
  
  it('contém a lista de todas as UFs brasileiras', () => {
    expect(wrapper.vm.ufs.length).toBe(27);
    
    const ufSiglas = wrapper.vm.ufs.map(uf => uf.sigla);
    expect(ufSiglas).toContain('SP');
    expect(ufSiglas).toContain('RJ');
    expect(ufSiglas).toContain('MG');
    expect(ufSiglas).toContain('AM');
    expect(ufSiglas).toContain('TO');
  });
  
  it('atualiza v-model quando selectedUF muda', async () => {
    
    wrapper.vm.selectedUF = 'SP';
    await nextTick();
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['SP']);
  });
  
  it('atualiza selectedUF quando modelValue muda', async () => {
    // Atualizar a prop modelValue
    await wrapper.setProps({ modelValue: 'MG' });
    
    // Verificar se selectedUF foi atualizado
    expect(wrapper.vm.selectedUF).toBe('MG');
  });
  
  it('emite evento change quando onChange é chamado', async () => {
    // Configurar o estado
    wrapper.vm.selectedUF = 'RJ';
    
    wrapper.vm.onChange();
    await nextTick();
    
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')[0]).toEqual(['RJ']);
  });
});