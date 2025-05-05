import httpService from './http.service';

const API_URL = 'https://localhost:7041/api/';

export default {
  processos: {
    getAll: (options) => {
      if (typeof options?.params === 'string') {
        return httpService.get(`${API_URL}processo?${options.params}`);
      }
      
      if (options && typeof options === 'object') {
        const queryParams = new URLSearchParams();
        
        if (options.page) queryParams.append('page', options.page);
        if (options.pageSize) queryParams.append('pageSize', options.pageSize);
        if (options.sortField) queryParams.append('sortField', options.sortField);
        if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
        
        const queryString = queryParams.toString();
        return httpService.get(`${API_URL}processo${queryString ? `?${queryString}` : ''}`);
      }
      
      return httpService.get(`${API_URL}processo`);
    },
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