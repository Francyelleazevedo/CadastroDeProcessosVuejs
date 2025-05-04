import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login/Login.vue'
import RegisterView from '../views/Register/Register.vue'
import DashboardView from '../views/Dashboard/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register', 
    name: 'novo-usuario',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/processos',
    name: 'processos',
    component: () => import('../views/Processos/Index.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/processos/criar',
    name: 'criar-processo',
    component: () => import('../views/Processos/Create.vue'),
    meta: { requiresAuth: true }
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
  },
  // Rota de fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Adiciona log para depuração
router.afterEach((to) => {
  console.log(`Navegação concluída: ${to.path}`);
})

export default router