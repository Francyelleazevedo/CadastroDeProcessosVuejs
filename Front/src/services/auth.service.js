const API_URL = 'https://localhost:7041/api/';

export default {
  // Login
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }
      
      const data = await response.json();
      
      // Armazena o token e informações do usuário
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Verifica se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  // Obtém o usuário atual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  },
  
  // Obtém o token
  getToken() {
    return localStorage.getItem('token');
  }
};