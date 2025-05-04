export default {
    async request(url, options = {}) {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const config = {
        ...options,
        headers
      };
      
      try {
        const response = await fetch(url, config);
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada ou inválida');
        }
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    },
    
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