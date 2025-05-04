export default {
    async request(url, options = {}) {
      // Obtém o token do localStorage
      const token = localStorage.getItem('token');
      
      // Define os headers padrão
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      // Adiciona o token de autenticação se disponível
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Configurações da requisição
      const config = {
        ...options,
        headers
      };
      
      try {
        const response = await fetch(url, config);
        
        // Verifica se é um erro 401 (não autorizado)
        if (response.status === 401) {
          // Limpa o armazenamento e redireciona para o login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada ou inválida');
        }
        
        // Verifica outros erros HTTP
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        // Retorna os dados como JSON
        return await response.json();
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    },
    
    // Métodos específicos
    get(url, options = {}) {
      return this.request(url, { ...options, method: 'GET' });
    },
    
    post(url, data, options = {}) {
      return this.request(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    put(url, data, options = {}) {
      return this.request(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    delete(url, options = {}) {
      return this.request(url, { ...options, method: 'DELETE' });
    }
  };