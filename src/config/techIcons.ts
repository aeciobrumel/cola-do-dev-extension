import type { IconType } from "react-icons";
import {
  SiAngular,
  SiCss3,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiKubernetes,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs
} from "react-icons/si";

export interface TechMeta {
  label: string;
  icon: IconType;
  color: string;
}

export const TECH_META = {
  Laravel: {
    label: "Laravel",
    icon: SiLaravel,
    color: "#FF2D20"
  },
  TypeScript: {
    label: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6"
  },
  JavaScript: {
    label: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E"
  },
  Python: {
    label: "Python",
    icon: SiPython,
    color: "#3776AB"
  },
  React: {
    label: "React",
    icon: SiReact,
    color: "#61DAFB"
  },
  Docker: {
    label: "Docker",
    icon: SiDocker,
    color: "#2496ED"
  },
  Git: {
    label: "Git",
    icon: SiGit,
    color: "#F05032"
  },
  "Node.js": {
    label: "Node.js",
    icon: SiNodedotjs,
    color: "#339933"
  },
  PHP: {
    label: "PHP",
    icon: SiPhp,
    color: "#777BB4"
  },
  "Vue.js": {
    label: "Vue.js",
    icon: SiVuedotjs,
    color: "#4FC08D"
  },
  "Next.js": {
    label: "Next.js",
    icon: SiNextdotjs,
    color: "#000000"
  },
  Angular: {
    label: "Angular",
    icon: SiAngular,
    color: "#DD0031"
  },
  NestJS: {
    label: "NestJS",
    icon: SiNestjs,
    color: "#E0234E"
  },
  HTML: {
    label: "HTML",
    icon: SiHtml5,
    color: "#E34F26"
  },
  CSS: {
    label: "CSS",
    icon: SiCss3,
    color: "#1572B6"
  },
  PostgreSQL: {
    label: "PostgreSQL",
    icon: SiPostgresql,
    color: "#4169E1"
  },
  MySQL: {
    label: "MySQL",
    icon: SiMysql,
    color: "#4479A1"
  },
  MongoDB: {
    label: "MongoDB",
    icon: SiMongodb,
    color: "#47A248"
  },
  Redis: {
    label: "Redis",
    icon: SiRedis,
    color: "#DC382D"
  },
  GraphQL: {
    label: "GraphQL",
    icon: SiGraphql,
    color: "#E10098"
  },
  Kubernetes: {
    label: "Kubernetes",
    icon: SiKubernetes,
    color: "#326CE5"
  },
  Go: {
    label: "Go",
    icon: SiGo,
    color: "#00ADD8"
  },
  Rust: {
    label: "Rust",
    icon: SiRust,
    color: "#000000"
  },
  Django: {
    label: "Django",
    icon: SiDjango,
    color: "#092E20"
  },
  Flask: {
    label: "Flask",
    icon: SiFlask,
    color: "#000000"
  },
  Firebase: {
    label: "Firebase",
    icon: SiFirebase,
    color: "#FFCA28"
  },
  "Tailwind CSS": {
    label: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4"
  },
  Express: {
    label: "Express",
    icon: SiExpress,
    color: "#000000"
  },
  Vite: {
    label: "Vite",
    icon: SiVite,
    color: "#646CFF"
  }
} satisfies Record<string, TechMeta>;

type TechKey = keyof typeof TECH_META;

function normalizeTechName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, "");
}

const AUTO_ALIASES = (Object.keys(TECH_META) as TechKey[]).reduce<
  Record<string, TechKey>
>((acc, key) => {
  acc[normalizeTechName(key)] = key;
  acc[normalizeTechName(TECH_META[key].label)] = key;
  return acc;
}, {});

const EXTRA_ALIASES: Record<string, TechKey> = {
  ts: "TypeScript",
  js: "JavaScript",
  py: "Python",
  node: "Node.js",
  nodejs: "Node.js",
  reactjs: "React",
  vue: "Vue.js",
  vuejs: "Vue.js",
  nextjs: "Next.js",
  nest: "NestJS",
  golang: "Go",
  postgres: "PostgreSQL",
  mongo: "MongoDB",
  k8s: "Kubernetes",
  tailwind: "Tailwind CSS",
  expressjs: "Express"
};

const TECH_ALIASES: Record<string, TechKey> = {
  ...AUTO_ALIASES,
  ...EXTRA_ALIASES
};

export function getTechMeta(technology: string): TechMeta | null {
  const normalized = normalizeTechName(technology);

  if (!normalized) {
    return null;
  }

  const canonicalKey = TECH_ALIASES[normalized];
  return canonicalKey ? TECH_META[canonicalKey] : null;
}
