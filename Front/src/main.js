import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

// Estilos do PrimeVue
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Componentes do PrimeVue
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Tooltip from 'primevue/tooltip';


// Adicionar componentes para a tabela de processos
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog';
import Paginator from 'primevue/paginator'

// Componentes adicionais para interface melhorada
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)

// Registre todos os componentes com o prefixo "Prime"
app.component('PrimeInputText', InputText)
app.component('PrimeDropdown', Dropdown)
app.component('PrimeButton', Button)
app.component('PrimeToast', Toast)
app.component('PrimePassword', Password)
app.component('PrimeCheckbox', Checkbox)

// Registrar os componentes da tabela também com o prefixo "Prime"
app.component('PrimeDataTable', DataTable)
app.component('PrimeColumn', Column)
app.component('PrimeDialog', Dialog)
app.component('PrimeConfirmDialog', ConfirmDialog);
app.component('PrimePaginator', Paginator)

// Registrar componentes adicionais
app.component('PrimeTag', Tag)
app.component('PrimeBadge', Badge)
app.directive('tooltip', Tooltip);

app.mount('#app')


