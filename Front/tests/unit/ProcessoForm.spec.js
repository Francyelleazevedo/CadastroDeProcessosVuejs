import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ProcessoForm from '../../src/components/ProcessoForm.vue';
import { nextTick } from 'vue';

// Mock do useToast
const mockToast = {
  add: vi.fn()
};
vi.mock('primevue/usetoast', () => ({
  useToast: () => mockToast
}));

describe('ProcessoForm', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallowMount(ProcessoForm, {
      props: {
        modelValue: {
          id: null,
          nomeProcesso: "",
          npu: "",
          uf: "",
          municipio: "",
          codigoMunicipio: ""
        },
        loading: false
      }
    });
  });
  
  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });
  
  it('renderiza o formulário corretamente', () => {
    expect(wrapper.find('.grid').exists()).toBe(true);
    
    expect(wrapper.findComponent({ name: 'NPUInput' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'UFSelector' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'MunicipioSelector' }).exists()).toBe(true);
  });
  
  it('atualiza o modelValue quando os dados do formulário mudam', async () => {

    wrapper.vm.formData.nomeProcesso = "Novo Processo";
    await nextTick();
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    
    const lastEvent = wrapper.emitted('update:modelValue').slice(-1)[0][0];
    expect(lastEvent.nomeProcesso).toBe("Novo Processo");
  });
  
  it('atualiza formulário quando props mudam', async () => {
    await wrapper.setProps({
      modelValue: {
        id: 1,
        nomeProcesso: "Processo Teste",
        npu: "1234567-89.2023.8.26.0000",
        uf: "SP",
        municipio: "São Paulo",
        codigoMunicipio: "3550308"
      }
    });
    await nextTick();
    
    expect(wrapper.vm.formData.nomeProcesso).toBe("Processo Teste");
    expect(wrapper.vm.formData.npu).toBe("1234567-89.2023.8.26.0000");
  });
  
  it('emite o evento voltar quando o método voltar é chamado', async () => {

    wrapper.vm.voltar();
    await nextTick();
    
    expect(wrapper.emitted('voltar')).toBeTruthy();
  });
  
  it('atualiza o codigoMunicipio quando o método correspondente é chamado', async () => {
    wrapper.vm.onCodigoMunicipioChange('3550308');
    await nextTick();
    
    expect(wrapper.vm.formData.codigoMunicipio).toBe('3550308');
  });
  
  it('chama onSubmit e mostra toast quando formulário é inválido', async () => {
   
    const toastSpy = vi.spyOn(mockToast, 'add');
    
    await wrapper.vm.onSubmit();
    await nextTick();
    
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'warn',
      summary: 'Validação'
    }));
  });
});