import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login/Login.vue'
import RegisterView from '../views/Register/Register.vue'
import AppSidebar from '../components/Menu/Sidebar.vue'

const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'novo-usuario',
    component: RegisterView,
    meta: { public: true }
  }
];

const protectedRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard/Dashboard.vue')
  },
  {
    path: '/processos',
    name: 'processos',
    component: () => import('../views/Processos/Index.vue')
  },
  {
    path: '/processos/criar',
    name: 'criar-processo',
    component: () => import('../views/Processos/Create.vue')
  },
  {
    path: '/processos/:id',
    name: 'detalhes-processo',
    component: () => import('../views/Processos/Details.vue'),
    props: true
  },
  {
    path: '/processos/editar/:id',
    name: 'editar-processo',
    component:() => import('../views/Processos/Edit.vue'),
    props: true
  }
];

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  
  ...publicRoutes,
  
  {
    path: '/',
    component: AppSidebar,
    children: protectedRoutes
  },
  
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isPublic = to.meta.public === true;
  
  console.log('Navegando para:', to.path);
  console.log('Autenticado:', isAuthenticated, 'Rota pública:', isPublic);
  
  if (!isAuthenticated && !isPublic) {
    console.log('Acesso negado, redirecionando para login');
    return next('/login');
  }
  
  if (isAuthenticated && to.path === '/login') {
    console.log('Já autenticado, redirecionando para dashboard');
    return next('/dashboard');
  }
  
  next();
});

router.afterEach((to) => {
  console.log(`Navegação concluída: ${to.path}`);
});

export default router;