<template>
  <div class="layout-wrapper">
    <div class="layout-sidebar" :class="{ 'active': sidebarVisible, 'collapsed': !sidebarVisible }">
      <div class="sidebar-header">
        <div class="logo">
          <h2 v-if="sidebarVisible">Sistema de Processos</h2>
          <h2 v-else class="mini-logo">SP</h2>
        </div>
        <button v-if="sidebarVisible" class="sidebar-toggle p-link" @click="toggleSidebar">
          <i class="pi pi-angle-left"></i>
        </button>
      </div>

      <div class="menu-container">
        <ul class="menu-list">
          <li>
            <router-link to="/dashboard" class="menu-item" active-class="active-menu-item">
              <i class="pi pi-chart-bar"></i>
              <span v-if="sidebarVisible" class="menu-text">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/processos" class="menu-item" active-class="active-menu-item">
              <i class="pi pi-file"></i>
              <span v-if="sidebarVisible" class="menu-text">Cadastro de Processos</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="layout-main" :class="{ 'expanded': !sidebarVisible }">
      <div class="layout-topbar">
        <button class="menu-button p-link" @click="toggleSidebar">
          <i class="pi pi-bars"></i>
        </button>
        <div class="topbar-title">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="topbar-actions">
          <div class="user-menu-container">
            <button @click="toggleUserMenu" class="user-profile-button p-link">
              <i class="pi pi-user"></i>
            </button>
            
            <div class="user-menu" v-if="userMenuVisible">
              <div class="user-email">{{ userEmail }}</div>
              <div class="menu-divider"></div>
              <button @click="logout" class="logout-button p-link">
                <i class="pi pi-sign-out mr-2"></i>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="layout-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'AppSidebar',
  setup() {
    const sidebarVisible = ref(true);
    const userMenuVisible = ref(false);
    const userEmail = ref('');
    const route = useRoute();
    const router = useRouter();

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value;
      localStorage.setItem('sidebarVisible', sidebarVisible.value.toString());
    };

    const toggleUserMenu = () => {
      userMenuVisible.value = !userMenuVisible.value;
    };

    const closeUserMenuOnClickOutside = (event) => {
      if (userMenuVisible.value && !event.target.closest('.user-menu-container')) {
        userMenuVisible.value = false;
      }
    };

    const getUserEmail = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userEmail.value = payload.email || 'usuario@exemplo.com';
        } catch (e) {
          userEmail.value = localStorage.getItem('userEmail') || 'usuario@exemplo.com';
        }
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      router.push('/login');
    };

    const pageTitle = computed(() => {
      switch (route.path) {
        case '/dashboard':
          return 'Dashboard';
        case '/processos':
          return 'Cadastro de Processos';
        case '/processos/criar':
          return 'Novo Processo';
        case '/processos/editar':
          return 'Editar Processo';
        default:
          return 'Sistema de Processos';
      }
    });

    onMounted(() => {
      getUserEmail();
      document.addEventListener('click', closeUserMenuOnClickOutside);
      const savedState = localStorage.getItem('sidebarVisible');
      if (savedState !== null) {
        sidebarVisible.value = savedState === 'true';
      }
      
      if (window.innerWidth < 768) {
        sidebarVisible.value = false;
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeUserMenuOnClickOutside);
    });

    return {
      sidebarVisible,
      userMenuVisible,
      userEmail,
      toggleSidebar,
      toggleUserMenu,
      logout,
      pageTitle
    };
  }
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
}

.layout-sidebar {
  width: 250px;
  background-color: #1e293b;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 999;
  transition: all 0.3s ease;
}

.layout-sidebar.collapsed {
  width: 65px;
}

.layout-sidebar .logo {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.layout-sidebar .mini-logo {
  font-size: 1.2rem;
  text-align: center;
  width: 100%;
}

.sidebar-header {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2a3a50;
}

.sidebar-toggle {
  color: #fff;
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-container {
  padding: 1rem 0;
  flex: 1;
  overflow-y: auto;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #e2e8f0;
  text-decoration: none;
  transition: background-color 0.2s;
}

.menu-item i {
  font-size: 1.2rem;
  margin-right: 0.75rem;
}

.layout-sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.layout-sidebar.collapsed .menu-item i {
  margin-right: 0;
  font-size: 1.4rem;
}

.menu-text {
  transition: opacity 0.3s;
}

.menu-item:hover {
  background-color: #2a3a50;
}

.active-menu-item {
  background-color: #334155;
  border-left: 3px solid var(--primary-color);
}

.layout-main {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.layout-main.expanded {
  margin-left: 65px;
}

.layout-topbar {
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  height: 60px;
}

.menu-button {
  margin-right: 1rem;
  font-size: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
}

.topbar-title {
  flex: 1;
}

.topbar-actions {
  padding: 0 1rem;
}

.layout-content {
  padding: 1.5rem;
  background-color: #f8f9fa;
  flex: 1;
}

.user-menu-container {
  position: relative;
}

.user-profile-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.user-profile-button:hover {
  background-color: #dee2e6;
}

.user-menu {
  position: absolute;
  top: 45px;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

.user-email {
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #495057;
  word-break: break-word;
}

.menu-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 8px 0;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  color: #495057;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #f8f9fa;
  color: #e74c3c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 768px) {
  .layout-sidebar {
    transform: translateX(-100%);
  }
  
  .layout-sidebar.active {
    transform: translateX(0);
  }
  
  .layout-main {
    margin-left: 0;
  }
  
  .layout-main.expanded {
    margin-left: 0;
  }
}
</style>