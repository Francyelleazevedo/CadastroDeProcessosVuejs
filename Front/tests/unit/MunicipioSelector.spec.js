import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import MunicipioSelector from '../../src/components/MunicipioSelector.vue';
import { nextTick } from 'vue';

const mockToastAdd = vi.fn();
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: mockToastAdd
  })
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


global.fetch = vi.fn();

describe('MunicipioSelector', () => {
  let wrapper;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockToastAdd.mockClear();
    
    localStorageMock.getItem.mockReturnValue('fake-token');
    
    wrapper = mount(MunicipioSelector, {
      global: {
        stubs: {
          PrimeDropdown: true 
        }
      },
      props: {
        uf: '',
        modelValue: '',
        label: 'Município',
        placeholder: 'Selecione o Município'
      }
    });
  });
  
  afterEach(() => {
    wrapper.unmount();
  });
  
  it('renderiza corretamente com props padrão', () => {
    expect(wrapper.exists()).toBe(true);
    
    expect(wrapper.find('label').text()).toContain('Município');
    
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).exists()).toBe(true);
  });
  
  it('renderiza corretamente com props personalizadas', async () => {
    await wrapper.setProps({
      id: 'cidade',
      label: 'Cidade',
      placeholder: 'Escolha uma cidade'
    });
    
    expect(wrapper.find('label').text()).toContain('Cidade');
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).attributes('placeholder')).toBe('Escolha uma cidade');
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).attributes('id')).toBe('cidade');
  });
  
  it('emite evento update:modelValue quando o valor é alterado', async () => {
    // Simular a alteração do dropdown
    wrapper.vm.selectedMunicipio = 'São Paulo';
    await nextTick();
    
    // Verificar se o evento foi emitido
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['São Paulo']);
  });
  
  it('atualiza selectedMunicipio quando modelValue muda', async () => {
    await wrapper.setProps({ modelValue: 'Campinas' });
    expect(wrapper.vm.selectedMunicipio).toBe('Campinas');
  });
  
  it('atualiza isLoading quando prop loading muda', async () => {
    expect(wrapper.vm.isLoading).toBe(false);
    await wrapper.setProps({ loading: true });
    expect(wrapper.vm.isLoading).toBe(true);
  });
  
  it('carrega municípios quando UF é alterada', async () => {

    const mockMunicipios = [
      { id: '3550308', nome: 'São Paulo' },
      { id: '3509502', nome: 'Campinas' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMunicipios
    });

    await wrapper.setProps({ uf: 'SP' });
    await nextTick();
    
    // Verificar se fetch foi chamado corretamente
    expect(global.fetch).toHaveBeenCalledWith(
      'https://localhost:7041/api/localidades/municipios/SP',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-token'
        })
      })
    );
    
    // Verificar se os municípios foram carregados
    await nextTick();
    expect(wrapper.vm.municipios.length).toBe(2);
    expect(wrapper.vm.municipios[0].nome).toBe('São Paulo');
    expect(wrapper.vm.municipios[0].codigo).toBe('3550308');
  });
  
  it('emite auth-error quando token não é encontrado', async () => {

    localStorageMock.getItem.mockReturnValueOnce(null);
    
    await wrapper.setProps({ uf: 'SP' });
    await nextTick();
    
    expect(wrapper.emitted('auth-error')).toBeTruthy();
    expect(wrapper.emitted('auth-error')[0]).toEqual(['Token não encontrado']);
  });
  
  it('exibe erro quando API retorna status 401', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });
    
    await wrapper.setProps({ uf: 'SP' });
    await nextTick();
    
    await nextTick();
    expect(wrapper.emitted('auth-error')).toBeTruthy();
  });
  
  it('exibe erro genérico quando API falha com outro status', async () => {
    mockToastAdd.mockClear();
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });
    
    await wrapper.setProps({ uf: 'SP' });
    await nextTick();
    
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Erro'
      })
    );
  });
  
  it('atualiza código do município quando um município é selecionado', async () => {
    wrapper.vm.municipios = [
      { nome: 'São Paulo', codigo: '3550308' },
      { nome: 'Campinas', codigo: '3509502' }
    ];
    
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.onChange();
    await nextTick();
    
    // Verificar se o código do município foi atualizado
    expect(wrapper.vm.codigoMunicipio).toBe('3550308');
    
    expect(wrapper.emitted('codigo-municipio')).toBeTruthy();
    expect(wrapper.emitted('codigo-municipio')[0]).toEqual(['3550308']);
  });
  
  it('emite evento change quando município é selecionado', async () => {
    wrapper.vm.municipios = [
      { nome: 'São Paulo', codigo: '3550308' }
    ];
    
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.onChange();
    await nextTick();
    
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')[0]).toEqual(['São Paulo']);
  });
  
  it('limpa código do município quando selectedMunicipio é vazio', async () => {
    wrapper.vm.municipios = [
      { nome: 'São Paulo', codigo: '3550308' }
    ];
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.codigoMunicipio = '3550308';
  
    wrapper.vm.selectedMunicipio = '';
    wrapper.vm.onChange();
    await nextTick();
    
    expect(wrapper.vm.codigoMunicipio).toBe('');
    expect(wrapper.emitted('codigo-municipio')).toBeTruthy();
    expect(wrapper.emitted('codigo-municipio')[0]).toEqual(['']);
  });
  
  it('exibe aviso quando município selecionado não é encontrado na lista', async () => {
    mockToastAdd.mockClear();
    
    wrapper.vm.municipios = [
      { nome: 'Campinas', codigo: '3509502' }
    ];
    
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.onChange();
    await nextTick();
    
    expect(wrapper.vm.codigoMunicipio).toBe('');
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'warn',
        summary: 'Atenção'
      })
    );
  });
  
  it('limpa dados quando UF é removida', async () => {
    wrapper.vm.municipios = [
      { nome: 'São Paulo', codigo: '3550308' },
      { nome: 'Campinas', codigo: '3509502' }
    ];
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.codigoMunicipio = '3550308';
    
    wrapper.vm.municipios = [];
    wrapper.vm.selectedMunicipio = '';
    wrapper.vm.codigoMunicipio = '';
    wrapper.vm.$emit('codigo-municipio', '');
    
    expect(wrapper.vm.municipios).toEqual([]);
    expect(wrapper.vm.selectedMunicipio).toBe('');
    expect(wrapper.vm.codigoMunicipio).toBe('');
    
    expect(wrapper.emitted('codigo-municipio')).toBeTruthy();
  });
  
  it('exibe mensagem de atenção quando código do município não está disponível', async () => {
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.codigoMunicipio = '';
    await nextTick();
    
    const atencaoMsg = wrapper.find('.text-orange-500');
    expect(atencaoMsg.exists()).toBe(true);
    expect(atencaoMsg.text()).toContain('Atenção: Código do município não disponível');
  });
  
  it('exibe mensagem de erro quando fornecida via props', async () => {
    // Configurar prop de erro
    await wrapper.setProps({ error: 'Este campo é obrigatório' });
    await nextTick();
    
    // Verificar se a mensagem de erro é exibida
    const errorMsg = wrapper.find('.p-error');
    expect(errorMsg.exists()).toBe(true);
    expect(errorMsg.text()).toBe('Este campo é obrigatório');
  });
  
  it('adiciona classe p-invalid ao dropdown quando há erro', async () => {
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).classes()).not.toContain('p-invalid');
    
    await wrapper.setProps({ error: 'Este campo é obrigatório' });
    await nextTick();
    
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).classes()).toContain('p-invalid');
  });
  
  it('carrega municípios automaticamente se UF estiver definida no momento da montagem', async () => {
    wrapper.unmount();
    
    const mockMunicipios = [
      { id: '3550308', nome: 'São Paulo' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMunicipios
    });
    
    wrapper = mount(MunicipioSelector, {
      global: {
        stubs: {
          PrimeDropdown: true
        }
      },
      props: {
        uf: 'SP'
      }
    });
    
    await nextTick();
    await nextTick();
    
    expect(global.fetch).toHaveBeenCalled();
    expect(wrapper.vm.municipios.length).toBe(1);
  });
  
  it('mantém o município selecionado se ele existir na nova UF', async () => {
    wrapper.vm.selectedMunicipio = 'Município Comum';
    wrapper.vm.codigoMunicipio = '1234';
    
    const mockMunicipios = [
      { id: '1234', nome: 'Município Comum' },
      { id: '5678', nome: 'Outro Município' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMunicipios
    });
    
    await wrapper.setProps({ uf: 'RJ' });
    await nextTick();
    await nextTick(); 
    
    expect(wrapper.vm.selectedMunicipio).toBe('Município Comum');
    expect(wrapper.vm.codigoMunicipio).toBe('1234');
  });
  
  it('limpa o município selecionado se ele não existir na nova UF', async () => {
    mockToastAdd.mockClear();
    
    wrapper.vm.selectedMunicipio = 'São Paulo';
    wrapper.vm.codigoMunicipio = '3550308';
    
    const mockMunicipios = [
      { id: '2200054', nome: 'Acauã' },
      { id: '2200103', nome: 'Água Branca' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMunicipios
    });
    
    await wrapper.setProps({ uf: 'PI' });
    await nextTick();
    await nextTick(); 
    
    expect(wrapper.vm.selectedMunicipio).toBe('');
    expect(wrapper.vm.codigoMunicipio).toBe('');
    
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'info',
        summary: 'Município alterado'
      })
    );
  });
  
  it('desabilita o dropdown quando UF não está definida', () => {
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).attributes('disabled')).toBe('true');
  });
  
  it('desabilita o dropdown durante o carregamento', async () => {
    wrapper.vm.isLoading = true;
    await nextTick();
    
    expect(wrapper.findComponent({ name: 'PrimeDropdown' }).attributes('disabled')).toBe('true');
  });
});