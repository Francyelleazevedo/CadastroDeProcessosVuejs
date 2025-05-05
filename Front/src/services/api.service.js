import httpService from './http.service';

const API_URL = 'https://localhost:7041/api/';

export default {
  processos: {
    getAll: (params) => httpService.get(`${API_URL}processo`, { params }),
    getById: (id) => httpService.get(`${API_URL}processo/${id}`),
    create: (processo) => httpService.post(`${API_URL}processo`, processo),
    update: (id, processo) => httpService.put(`${API_URL}processo/${id}`, processo),
    delete: (id) => httpService.delete(`${API_URL}processo/${id}`)
  },
  
  visualizacao: {
    confirmarVisualizacao: (id) => httpService.post(`${API_URL}processo/${id}/confirmar-visualizacao`)
  }, 

  localidades: {
    getMunicipiosByUF: (uf) => httpService.get(`${API_URL}localidades/municipios/${uf}`)
  },
  
  relatorios: {
    getMensal: (mes, ano) => httpService.get(`${API_URL}relatorio/mensal?mes=${mes}&ano=${ano}`)
  }
};