import { Snippet } from "./types";

const now = new Date().toISOString();

export const defaultSnippets: Snippet[] = [
  {
    id: "docker-reset-total",
    category: "Docker",
    subCategory: "Comandos",
    title: "Reset total de containers, redes e volumes",
    description:
      "Para limpar ambiente local e remover containers/redes/volumes não utilizados.",
    code: `docker stop $(docker ps -aq) 2>/dev/null || true && \\
  docker rm $(docker ps -aq) 2>/dev/null || true && \\
  docker network prune -f && \\
  docker volume prune -f`,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "laravel-where-exists",
    category: "Laravel",
    subCategory: "Query Builder",
    title: "whereExists + selectRaw(1)",
    description:
      "Padrão performático para validar existência de relacionamento via subquery.",
    code: `DB::table('orders')
  ->whereExists(function ($query) {
    $query->selectRaw(1)
      ->from('customers')
      ->whereColumn('customers.id', 'orders.customer_id');
  })
  ->get();`,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "artisan-model-mcr",
    category: "Laravel",
    subCategory: "Artisan",
    title: "Criar Model + Migration + Controller",
    description: "Comando único para iniciar recurso completo de CRUD.",
    code: "php artisan make:model Post -mcr",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "git-feature-branch",
    category: "Git",
    subCategory: "Git Flow",
    title: "Criar feature branch a partir de develop",
    description:
      "Fluxo padrão para iniciar nova funcionalidade sem impactar branch principal.",
    code: `git checkout develop
  git pull origin develop
  git checkout -b feature/nova-funcionalidade`,
    createdAt: now,
    updatedAt: now
  }
];
