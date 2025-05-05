import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Tooltip from 'primevue/tooltip';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';
import Chart from 'primevue/chart';

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

app.component('PrimeInputText', InputText)
app.component('PrimeDropdown', Dropdown)
app.component('PrimeButton', Button)
app.component('PrimeToast', Toast)
app.component('PrimePassword', Password)
app.component('PrimeCheckbox', Checkbox)
app.component('PrimeDataTable', DataTable)
app.component('PrimeColumn', Column)
app.component('PrimeDialog', Dialog)
app.component('PrimeConfirmDialog', ConfirmDialog)
app.component('PrimePaginator', Paginator)
app.component('PrimeTag', Tag)
app.component('PrimeBadge', Badge)
app.component('PrimeAvatar', Avatar)
app.component('PrimeProgressSpinner', ProgressSpinner)
app.component('PrimeChart', Chart)
app.directive('tooltip', Tooltip);

app.mount('#app')