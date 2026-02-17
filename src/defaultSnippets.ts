import { Snippet } from "./types";

const now = new Date().toISOString();

export const defaultSnippets: Snippet[] = [
  {
    id: "docker-reset-total",
    category: "Docker",
    subCategory: "Cleanup",
    title: "Reset total (derrubar tudo)",
    description: "Para parar/remover todos containers e limpar networks/volumes.",
    code: "docker stop $(docker ps -aq) 2>/dev/null || true && \\\ndocker rm $(docker ps -aq) 2>/dev/null || true && \\\ndocker network prune -f && \\\ndocker volume prune -f",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "git-flow-tipos-branches",
    category: "Git",
    subCategory: "Workflow",
    title: "Git Flow - tipos de branches",
    description: "Resumo de main/develop/feature/release/hotfix.",
    code: "Main/Master:\n- Branch principal, sempre representa a versão estável e pronta para produção.\n\nDevelop:\n- Integra todas as funcionalidades prontas para a próxima versão.\n\nFeature Branches:\n- Criadas a partir de develop para desenvolver novas funcionalidades.\n- Temporárias e excluídas após merge.\n- Exemplo: feature/nova-tela\n\nRelease Branches:\n- Criadas a partir de develop para preparar uma nova entrega (release).\n- Corrigir bugs finais e preparar metadados.\n- Temporárias.\n\nHotfix Branches:\n- Criadas diretamente da main/master para corrigir bugs críticos em produção.\n- Merge imediato em main e develop.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-create-vite",
    category: "React",
    subCategory: "Setup",
    title: "Criar projeto React com Vite",
    description: "Cria projeto React rápido (JS ou TS).",
    code: "npm create vite@latest meu-projeto\n\n# escolher:\n# React\n# JavaScript ou TypeScript\n\ncd meu-projeto\nnpm install\nnpm run dev",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-run-dev",
    category: "NPM",
    subCategory: "Scripts",
    title: "Rodar em modo dev",
    description: "Subir projeto React em modo desenvolvimento.",
    code: "npm run dev",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-run-build",
    category: "NPM",
    subCategory: "Scripts",
    title: "Build de produção",
    description: "Gera build otimizado para deploy.",
    code: "npm run build",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-run-preview",
    category: "NPM",
    subCategory: "Scripts",
    title: "Testar build local (preview)",
    description: "Roda localmente o build já gerado.",
    code: "npm run preview",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Instalar dependências",
    description: "Instala todas libs do package.json.",
    code: "npm install",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-clean-install",
    category: "NPM",
    subCategory: "Fix",
    title: "Reset node_modules (quando dá erro estranho)",
    description: "Limpeza total e reinstalação do projeto.",
    code: "rm -rf node_modules package-lock.json\nnpm install\nnpm run dev",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-check-version",
    category: "NPM",
    subCategory: "Debug",
    title: "Ver versão do Node e NPM",
    description: "Checar versões instaladas.",
    code: "node -v\nnpm -v",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-router-install",
    category: "React",
    subCategory: "Routing",
    title: "Instalar React Router",
    description: "Lib padrão para rotas SPA.",
    code: "npm install react-router-dom",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-tailwind-install",
    category: "React",
    subCategory: "Styling",
    title: "Instalar Tailwind no Vite",
    description: "Setup TailwindCSS com Vite.",
    code: "npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-shadcn-init",
    category: "React",
    subCategory: "UI",
    title: "Instalar Shadcn UI (Vite)",
    description: "Inicializar shadcn/ui no projeto React.",
    code: "npx shadcn@latest init",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-eslint-fix",
    category: "NPM",
    subCategory: "Quality",
    title: "Rodar lint (ESLint)",
    description: "Checar e corrigir erros.",
    code: "npm run lint\n\nnpm run lint -- --fix",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-prettier-format",
    category: "NPM",
    subCategory: "Quality",
    title: "Formatar código (Prettier)",
    description: "Formatar automaticamente o projeto.",
    code: "npx prettier . --write",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-typescript-install",
    category: "React",
    subCategory: "TypeScript",
    title: "Adicionar TypeScript em projeto React",
    description: "Caso tenha criado projeto JS e quer migrar.",
    code: "npm install -D typescript @types/react @types/react-dom",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "react-env-vars-vite",
    category: "React",
    subCategory: "Env",
    title: "Variáveis de ambiente no Vite",
    description: "Exemplo padrão de VITE_API_URL.",
    code: "# .env\nVITE_API_URL=http://localhost:8000\n\n# uso no código\nconst apiUrl = import.meta.env.VITE_API_URL;",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-ps-all",
    category: "Docker",
    subCategory: "Inspecao",
    title: "Listar containers (ativos e parados)",
    description: "Mostra todos os containers com status para diagnostico rapido.",
    code: "docker ps -a",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-logs-follow",
    category: "Docker",
    subCategory: "Debug",
    title: "Ver logs em tempo real",
    description: "Acompanha logs do container em tempo real.",
    code: "docker logs -f --tail=200 <container>",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-exec-bash-sh",
    category: "Docker",
    subCategory: "Debug",
    title: "Entrar no container (bash/sh)",
    description: "Abre shell interativo para inspeção e testes dentro do container.",
    code: "docker exec -it <container> bash\n# se bash nao existir:\ndocker exec -it <container> sh",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-compose-up-build",
    category: "Docker",
    subCategory: "Compose",
    title: "Subir stack com build",
    description: "Sobe todos os serviços e força build das imagens.",
    code: "docker compose up -d --build",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-compose-down-volumes",
    category: "Docker",
    subCategory: "Compose",
    title: "Derrubar stack e volumes",
    description: "Para e remove containers, redes e volumes do compose.",
    code: "docker compose down -v --remove-orphans",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-rebuild-no-cache",
    category: "Docker",
    subCategory: "Build",
    title: "Rebuild sem cache",
    description: "Reconstrói imagem do zero para evitar cache inconsistente.",
    code: "docker build --no-cache -t <imagem>:<tag> .",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-prune-system-all",
    category: "Docker",
    subCategory: "Cleanup",
    title: "Limpeza pesada (system prune)",
    description: "Remove recursos nao usados (containers, redes, imagens dangling e build cache).",
    code: "docker system prune -af --volumes",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "docker-stats-live",
    category: "Docker",
    subCategory: "Monitoramento",
    title: "Monitorar consumo em tempo real",
    description: "Mostra uso de CPU, memoria e rede dos containers.",
    code: "docker stats",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-selectraw-1",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "selectRaw(1) (checar existência)",
    description: "Padrão comum com whereExists para verificar se existe registro relacionado.",
    code: "DB::table('orders')\n    ->whereExists(function ($query) {\n        $query->selectRaw(1)\n            ->from('order_items')\n            ->whereColumn('order_items.order_id', 'orders.id');\n    })\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-selectraw",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "selectRaw() (SQL no select)",
    description: "Usado para alias, concat, cálculos e expressões SQL no SELECT.",
    code: "DB::table('users')\n    ->selectRaw(\"id, name, email, CONCAT(name, ' - ', email) as label\")\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-whereexists",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "whereExists() (validar relacionamento)",
    description: "Checa se existe um relacionamento sem precisar join.",
    code: "DB::table('users')\n    ->whereExists(function ($query) {\n        $query->selectRaw(1)\n            ->from('orders')\n            ->whereColumn('orders.user_id', 'users.id');\n    })\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-exists",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "exists() (retorna true/false)",
    description: "Verifica se existe pelo menos um registro.",
    code: "$exists = DB::table('users')\n    ->where('email', 'teste@email.com')\n    ->exists();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-wherecolumn",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "whereColumn() (coluna vs coluna)",
    description: "Compara uma coluna com outra coluna.",
    code: "DB::table('orders')\n    ->whereColumn('paid_value', '>=', 'total_value')\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-where",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "where() (coluna vs valor)",
    description: "Filtro padrão de comparação.",
    code: "DB::table('users')\n    ->where('status', 1)\n    ->where('perfil', 'admin')\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-join",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "join() (inner join)",
    description: "Retorna só registros com correspondência.",
    code: "DB::table('users')\n    ->join('orders', 'orders.user_id', '=', 'users.id')\n    ->select('users.name', 'orders.total')\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-leftjoin",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "leftJoin() (left join)",
    description: "Mantém todos os registros da tabela da esquerda.",
    code: "DB::table('users')\n    ->leftJoin('orders', 'orders.user_id', '=', 'users.id')\n    ->select('users.name', 'orders.total')\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-groupby",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "groupBy() (agrupar)",
    description: "Agrupa resultados.",
    code: "DB::table('orders')\n    ->select('user_id')\n    ->selectRaw('COUNT(*) as total_orders')\n    ->groupBy('user_id')\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-having",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "having() (filtrar após groupBy)",
    description: "Filtra resultados depois do groupBy.",
    code: "DB::table('orders')\n    ->select('user_id')\n    ->selectRaw('COUNT(*) as total_orders')\n    ->groupBy('user_id')\n    ->having('total_orders', '>=', 3)\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-count",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "count() (contar registros)",
    description: "Conta quantos registros existem.",
    code: "$total = DB::table('users')->where('status', 1)->count();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-sum",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "sum() (somar valores)",
    description: "Soma valores de uma coluna.",
    code: "$total = DB::table('orders')->where('status', 'paid')->sum('total');",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-avg",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "avg() (média)",
    description: "Calcula média dos valores de uma coluna.",
    code: "$avg = DB::table('orders')->avg('total');",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-min-max",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "min() / max() (menor e maior valor)",
    description: "Retorna menor e maior valor da coluna.",
    code: "$min = DB::table('orders')->min('total');\n$max = DB::table('orders')->max('total');",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-orderby",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "orderBy() (ordenar)",
    description: "Ordena os registros.",
    code: "DB::table('users')->orderBy('name', 'asc')->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-wherein",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "whereIn() (filtrar lista)",
    description: "Filtra registros com base em uma lista.",
    code: "DB::table('users')->whereIn('id', [1, 2, 3])->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-wherenotin",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "whereNotIn() (excluir lista)",
    description: "Exclui registros que estejam dentro da lista.",
    code: "DB::table('users')->whereNotIn('id', [4, 5])->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-db-raw",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "DB::raw() (SQL puro)",
    description: "Expressões SQL dentro do Query Builder.",
    code: "DB::table('users')\n    ->select('id', 'name', DB::raw('YEAR(created_at) as year'))\n    ->get();",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-transaction",
    category: "Laravel",
    subCategory: "Database",
    title: "DB::transaction() (rollback automático)",
    description: "Executa múltiplas queries e faz rollback se der erro.",
    code: "DB::transaction(function () {\n    DB::table('users')->insert(['name' => 'Brumel']);\n    DB::table('logs')->insert(['action' => 'user_created']);\n});",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-make-model",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Criar Model",
    description: "Cria uma model Eloquent.",
    code: "php artisan make:model User",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-make-model-migration",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Model + Migration",
    description: "Cria model e migration juntos.",
    code: "php artisan make:model Post -m",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-make-controller",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Criar Controller",
    description: "Cria controller básico.",
    code: "php artisan make:controller UserController",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-make-controller-resource",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Controller Resource (CRUD)",
    description: "Cria controller com métodos padrão CRUD.",
    code: "php artisan make:controller UserController --resource",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-make-model-mcr",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Model + Migration + Controller",
    description: "Cria tudo de uma vez.",
    code: "php artisan make:model Post -mcr",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-migrate-fresh-seed",
    category: "Laravel",
    subCategory: "Database",
    title: "migrate:fresh --seed (reset + seed)",
    description: "Apaga e recria o banco e roda seeders.",
    code: "php artisan migrate:fresh --seed",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "conventional-commits",
    category: "Git",
    subCategory: "Commits",
    title: "Conventional Commits (tipos)",
    description: "Tipos mais usados.",
    code: "feat: nova funcionalidade\nfix: correção de bug\ndocs: documentação\nstyle: formatação\nrefactor: refatoração\ntest: testes\nperf: performance",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prompt-gerar-codigo",
    category: "IA",
    subCategory: "Gerar Código",
    title: "Prompt - gerar código",
    description: "Gerar snippet de código rapidamente.",
    code: "Crie um pequeno <pedaço de código> que demonstre o uso de <biblioteca/estrutura/função> em <linguagem de programação>.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prompt-refatorar",
    category: "IA",
    subCategory: "Refatoração",
    title: "Prompt - refatorar código",
    description: "Refatoração com foco em boas práticas.",
    code: "Refatore o seguinte <pedaço de código> para melhorar a legibilidade, performance e seguir as melhores práticas de <linguagem de programação>.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prompt-docstring",
    category: "IA",
    subCategory: "Documentação",
    title: "Prompt - gerar docstring",
    description: "Gerar docstring clara e curta.",
    code: "Gere docstring concisa e clara para a função <nome da função> que aceita <parâmetros> e retorna <tipo de retorno>.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prompt-explicar-funcao",
    category: "IA",
    subCategory: "Explicação",
    title: "Prompt - explicar função",
    description: "Explicação detalhada e análise de risco.",
    code: "Explique, em tópicos, o que a função <nome> faz e se há riscos de erro de lógica.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prompt-criar-commit-message",
    category: "IA",
    subCategory: "Git",
    title: "Prompt - gerar commit message",
    description: "Mensagem de commit baseada no staged.",
    code: "Escreva a mensagem de commit com base nas alterações staged.\nUse o padrão Conventional Commits.\nSeja claro, objetivo e técnico.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install-axios",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Instalar Axios",
    description: "Adicionar cliente HTTP Axios ao projeto.",
    code: "npm install axios",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install-react-router-dom",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Instalar react-router-dom",
    description: "Adicionar roteamento SPA ao projeto.",
    code: "npm install react-router-dom",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install-tailwind-deps",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Instalar deps do Tailwind",
    description: "Instala dependências de build para Tailwind.",
    code: "npm install -D tailwindcss postcss autoprefixer",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install-eslint-prettier",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Instalar ESLint + Prettier",
    description: "Instala ferramentas de qualidade e formatação.",
    code: "npm install -D eslint prettier",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-outdated",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Listar pacotes desatualizados",
    description: "Mostra dependências com versão mais nova.",
    code: "npm outdated",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "npm-install-latest-package",
    category: "NPM",
    subCategory: "Dependencies",
    title: "Atualizar pacote para latest",
    description: "Instala a versão mais recente de um pacote específico.",
    code: "npm install <pacote>@latest",
    createdAt: now,
    updatedAt: now
  }
];
