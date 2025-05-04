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
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  },
  
  getToken() {
    return localStorage.getItem('token');
  }
};