# Sistema de Cadastro de Processos
Visão Geral
O Sistema de Cadastro de Processos é uma aplicação web desenvolvida com Vue.js e .NET para gerenciar processos cadastrais. A aplicação permite visualizar, cadastrar, editar e excluir processos, além de controlar o status de visualização dos mesmos.
Tecnologias Utilizadas
Frontend

Vue.js 3
PrimeVue (componentes UI)
Vue Router (para navegação)
Composition API & Options API
Fetch API (para comunicação com o backend)

Backend

.NET Core API
Entity Framework
SQL Server

Funcionalidades

Autenticação de Usuário: Login com token JWT e persistência de sessão
Dashboard: Visualização geral de processos cadastrados
Listagem de Processos: Visualização de todos os processos com paginação e filtros
Visualização Detalhada: Detalhes completos de cada processo
Cadastro de Processos: Formulário para adicionar novos processos
Edição de Processos: Modificação de processos existentes
Exclusão de Processos: Remoção de processos com confirmação
Confirmação de Visualização: Marcação de processos como visualizados
Filtro por UF e Município: Seleção hierárquica de localidades

Arquitetura
O projeto segue uma arquitetura de serviços para organizar a comunicação com a API:

httpService: Serviço base para todas as requisições HTTP, gerenciando tokens e tratamento de erros
apiService: Mapeamento organizado de todas as rotas da API
authService: Gerenciamento de autenticação e sessão do usuário

Componentes Principais

Sidebar: Menu lateral responsivo para navegação entre funcionalidades
Login/Register: Telas de autenticação e criação de conta
ProcessList: Listagem de processos com funcionalidades de CRUD
ProcessForm: Formulário compartilhado para criação e edição de processos
ProcessDetails: Visualização detalhada de um processo específico
Seletores de UF/Município: Componentes para seleção hierárquica de localidades

Instalação e Configuração
Requisitos

Node.js (v14+)
.NET 6+
SQL Server

Instalação Frontend
bash# Clonar o repositório
git clone [url-do-repositorio]

# Entrar na pasta do projeto
cd cadastro-processos/Front

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run serve
Configuração Backend
bash# Navegar para a pasta do backend
cd cadastro-processos/Back

# Restaurar pacotes
dotnet restore

# Configurar o banco de dados
dotnet ef database update

# Iniciar a API
dotnet run
Estrutura de Diretórios
├── public/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Menu/         # Componentes de navegação
│   │   └── ...           # Outros componentes
│   ├── router/           # Configuração de rotas
│   ├── services/         # Serviços de API e autenticação
│   ├── views/            # Páginas principais
│   │   ├── Dashboard/
│   │   ├── Login/
│   │   ├── Processos/
│   │   └── ...
│   ├── App.vue           # Componente raiz
│   └── main.js           # Ponto de entrada
└── ...
Fluxo de Autenticação

O usuário acessa a aplicação e é redirecionado para a tela de login
Após autenticação, um token JWT é armazenado no localStorage
O token é incluído em todas as requisições subsequentes
Em caso de token expirado, o usuário é redirecionado para o login

Boas Práticas Implementadas

Serviços Centralizados: Comunicação com a API organizada em serviços
Componentes Reutilizáveis: Formulários e elementos UI compartilhados
Tratamento de Erros: Mensagens de erro amigáveis com o componente Toast
Responsividade: Layout adaptável para diferentes tamanhos de tela
Confirmações de Ações: Diálogos de confirmação para ações irreversíveis

Futuras Melhorias

Implementação de testes unitários e E2E
Exportação de dados em diferentes formatos
Melhorias na visualização de histórico de processos
Implementação de dashboard com estatísticas detalhadas
Melhorias de acessibilidade


Desenvolvido por: Francyelle Azevedo dos Santos
Versão: 1.0.0
Data: Maio 2025
