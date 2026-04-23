import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  FiCheck,
  FiCopy,
  FiEdit2,
  FiMaximize2,
  FiMoon,
  FiMoreHorizontal,
  FiSun,
  FiTrash2
} from "react-icons/fi";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import php from "highlight.js/lib/languages/php";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { getTechMeta } from "./config/techIcons";
import { defaultSnippets } from "./defaultSnippets";
import { getStoredSnippets, setStoredSnippets } from "./storage";
import { Snippet, SnippetFormData } from "./types";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("php", php);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);

const EMPTY_FORM: SnippetFormData = {
  category: "",
  subCategory: "",
  title: "",
  description: "",
  code: ""
};

const THEME_STORAGE_KEY = "cola-do-dev.theme";
const HIGHLIGHT_AUTO_LANGUAGES = [
  "javascript",
  "typescript",
  "php",
  "sql",
  "json",
  "bash",
  "css",
  "xml"
];

type ThemeMode = "light" | "dark";

function createSnippetId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `snippet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inferSnippetLanguage(snippet: Snippet): string | null {
  const source = `${snippet.category} ${snippet.subCategory} ${snippet.title}`.toLowerCase();
  const code = snippet.code.trim();

  if (source.includes("typescript") || source.includes("tsx")) {
    return "typescript";
  }

  if (
    source.includes("javascript") ||
    source.includes("react") ||
    source.includes("node") ||
    source.includes("js")
  ) {
    return "javascript";
  }

  if (source.includes("php") || source.includes("laravel") || code.startsWith("<?php")) {
    return "php";
  }

  if (source.includes("sql") || source.includes("query")) {
    return "sql";
  }

  if (source.includes("json") || code.startsWith("{") || code.startsWith("[")) {
    return "json";
  }

  if (source.includes("css") || source.includes("style")) {
    return "css";
  }

  if (source.includes("html") || source.includes("xml") || code.startsWith("<")) {
    return "xml";
  }

  if (source.includes("bash") || source.includes("shell") || code.startsWith("npm ")) {
    return "bash";
  }

  return null;
}

function getSnippetCodeLabel(snippet: Snippet): string {
  const language = inferSnippetLanguage(snippet);

  if (language === "xml") {
    return "html";
  }

  return language ?? snippet.category.toLowerCase();
}

function highlightSnippetCode(snippet: Snippet): string {
  const language = inferSnippetLanguage(snippet);

  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(snippet.code, {
        language,
        ignoreIllegals: true
      }).value;
    }

    return hljs.highlightAuto(snippet.code, HIGHLIGHT_AUTO_LANGUAGES).value;
  } catch {
    return escapeHtml(snippet.code);
  }
}

function normalizeFormData(formData: SnippetFormData): SnippetFormData {
  return {
    category: formData.category.trim(),
    subCategory: formData.subCategory.trim(),
    title: formData.title.trim(),
    description: formData.description.trim(),
    code: formData.code.trim()
  };
}

function extractImportArray(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const snippets = (payload as { snippets?: unknown }).snippets;
    return Array.isArray(snippets) ? snippets : null;
  }

  return null;
}

function parseImportPayload(payload: unknown): Snippet[] {
  const rawItems = extractImportArray(payload);

  if (!rawItems) {
    throw new Error(
      "JSON inválido. Use um array de snippets ou um objeto com a chave 'snippets'."
    );
  }

  const now = new Date().toISOString();

  const parsed = rawItems.reduce<Snippet[]>((acc, item) => {
    if (!item || typeof item !== "object") {
      return acc;
    }

    const raw = item as Partial<Snippet>;
    const category = typeof raw.category === "string" ? raw.category.trim() : "";
    const subCategory =
      typeof raw.subCategory === "string" ? raw.subCategory.trim() : "";
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const description =
      typeof raw.description === "string" ? raw.description.trim() : "";
    const code = typeof raw.code === "string" ? raw.code.trim() : "";

    if (!category || !subCategory || !title || !description || !code) {
      return acc;
    }

    acc.push({
      id: typeof raw.id === "string" && raw.id ? raw.id : createSnippetId(),
      category,
      subCategory,
      title,
      description,
      code,
      createdAt:
        typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : now,
      updatedAt:
        typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : now
    });

    return acc;
  }, []);

  if (parsed.length === 0) {
    throw new Error(
      "Nenhum snippet válido encontrado. Campos obrigatórios: category, subCategory, title, description, code."
    );
  }

  return parsed;
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export default function App() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");

  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SnippetFormData>(EMPTY_FORM);

  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isUtilityMenuOpen, setIsUtilityMenuOpen] = useState<boolean>(false);
  const [expandedSnippet, setExpandedSnippet] = useState<Snippet | null>(null);

  const importInputRef = useRef<HTMLInputElement | null>(null);
  const utilityMenuRef = useRef<HTMLDivElement | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const editorPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    const loadSnippets = async (): Promise<void> => {
      try {
        const stored = await getStoredSnippets();

        if (!mounted) {
          return;
        }

        if (stored === null) {
          setSnippets(defaultSnippets);
          await setStoredSnippets(defaultSnippets);
          return;
        }

        setSnippets(stored);
      } catch {
        if (mounted) {
          setSnippets(defaultSnippets);
          setStatusMessage(
            "Falha ao ler storage do Chrome. Os snippets padrão foram carregados."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSnippets();

    return () => {
      mounted = false;
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    void setStoredSnippets(snippets).catch(() => {
      setStatusMessage("Falha ao salvar snippets no chrome.storage.local.");
    });
  }, [snippets, isLoading]);

  useEffect(() => {
    if (!isUtilityMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!utilityMenuRef.current?.contains(target)) {
        setIsUtilityMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isUtilityMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") {
        return;
      }

      setIsUtilityMenuOpen(false);
      setExpandedSnippet(null);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!editorMode) {
      return;
    }

    editorPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    popupRef.current?.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [editorMode]);

  const categories = useMemo(() => {
    return Array.from(new Set(snippets.map((snippet) => snippet.category))).sort();
  }, [snippets]);

  const subCategories = useMemo(() => {
    const source =
      categoryFilter === "all"
        ? snippets
        : snippets.filter((snippet) => snippet.category === categoryFilter);

    return Array.from(new Set(source.map((snippet) => snippet.subCategory))).sort();
  }, [snippets, categoryFilter]);

  useEffect(() => {
    if (
      subCategoryFilter !== "all" &&
      !subCategories.includes(subCategoryFilter)
    ) {
      setSubCategoryFilter("all");
    }
  }, [subCategories, subCategoryFilter]);

  const filteredSnippets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return snippets.filter((snippet) => {
      const matchesCategory =
        categoryFilter === "all" || snippet.category === categoryFilter;
      const matchesSubCategory =
        subCategoryFilter === "all" || snippet.subCategory === subCategoryFilter;

      if (!matchesCategory || !matchesSubCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        snippet.title,
        snippet.description,
        snippet.code,
        snippet.category,
        snippet.subCategory
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [snippets, searchTerm, categoryFilter, subCategoryFilter]);

  function openCreateEditor(): void {
    setEditorMode("create");
    setEditingSnippetId(null);
    setFormData(EMPTY_FORM);
    setStatusMessage("");
    setIsUtilityMenuOpen(false);
  }

  function openEditEditor(snippet: Snippet): void {
    setEditorMode("edit");
    setEditingSnippetId(snippet.id);
    setFormData({
      category: snippet.category,
      subCategory: snippet.subCategory,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code
    });
    setStatusMessage("");
    setIsUtilityMenuOpen(false);
  }

  function closeEditor(): void {
    setEditorMode(null);
    setEditingSnippetId(null);
    setFormData(EMPTY_FORM);
  }

  function toggleTheme(): void {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function updateFormField<K extends keyof SnippetFormData>(
    field: K,
    value: SnippetFormData[K]
  ): void {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveSnippet(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalized = normalizeFormData(formData);
    const hasEmptyField = Object.values(normalized).some((value) => !value);

    if (hasEmptyField) {
      setStatusMessage("Preencha todos os campos antes de salvar o snippet.");
      return;
    }

    const now = new Date().toISOString();

    if (editorMode === "edit" && editingSnippetId) {
      setSnippets((prev) =>
        prev.map((snippet) =>
          snippet.id === editingSnippetId
            ? { ...snippet, ...normalized, updatedAt: now }
            : snippet
        )
      );
      setStatusMessage("Snippet atualizado com sucesso.");
      closeEditor();
      return;
    }

    const snippet: Snippet = {
      id: createSnippetId(),
      ...normalized,
      createdAt: now,
      updatedAt: now
    };

    setSnippets((prev) => [snippet, ...prev]);
    setStatusMessage("Snippet criado com sucesso.");
    closeEditor();
  }

  function handleDeleteSnippet(snippetId: string): void {
    const confirmed = window.confirm("Deseja remover este snippet?");

    if (!confirmed) {
      return;
    }

    setSnippets((prev) => prev.filter((snippet) => snippet.id !== snippetId));

    if (editingSnippetId === snippetId) {
      closeEditor();
    }

    if (expandedSnippet?.id === snippetId) {
      setExpandedSnippet(null);
    }

    setStatusMessage("Snippet removido com sucesso.");
  }

  async function handleCopySnippet(snippetId: string, code: string): Promise<void> {
    try {
      await copyToClipboard(code);
      setCopiedSnippetId(snippetId);
      setStatusMessage("Código copiado para a área de transferência.");

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedSnippetId((current) => (current === snippetId ? null : current));
      }, 1500);
    } catch {
      setStatusMessage("Não foi possível copiar o código.");
    }
  }

  function handleExportJson(): void {
    const payload = {
      exportedAt: new Date().toISOString(),
      snippets
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cola-do-dev-snippets-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setStatusMessage("Exportação concluída.");
    setIsUtilityMenuOpen(false);
  }

  function triggerImportJson(): void {
    setIsUtilityMenuOpen(false);
    importInputRef.current?.click();
  }

  async function handleImportJson(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const payload: unknown = JSON.parse(content);
      const importedSnippets = parseImportPayload(payload);

      const confirmed = window.confirm(
        `Importar ${importedSnippets.length} snippet(s)? Isso substituirá a lista atual.`
      );

      if (!confirmed) {
        return;
      }

      setSnippets(importedSnippets);
      setStatusMessage(`${importedSnippets.length} snippet(s) importado(s) com sucesso.`);
      closeEditor();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Arquivo inválido.";
      setStatusMessage(message);
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="popup-shell">
      <div className="popup" ref={popupRef}>
        <header className="popup-topbar">
          <div className="brand">
            <span className="brand-icon" aria-hidden="true">
              <img src="/logo.svg" alt="" className="brand-logo" />
            </span>
            <div className="brand-copy">
              <h1>Cola do Dev</h1>
              <p>Snippets de bolso</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="btn btn-icon"
              aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
            </button>
            <button type="button" className="btn btn-primary btn-compact" onClick={openCreateEditor}>
              + Novo
            </button>
          </div>
        </header>

        <section className="search-panel">
          <div className="search-row">
            <label className="field-control">
              <span>Buscar</span>
              <input
                className="search-input"
                type="search"
                placeholder="Título, categoria ou código"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="utility-menu" ref={utilityMenuRef}>
              <button
                type="button"
                className="btn btn-icon"
                aria-label="Importar ou exportar JSON"
                title="Importar ou exportar JSON"
                aria-haspopup="menu"
                aria-expanded={isUtilityMenuOpen}
                onClick={() => setIsUtilityMenuOpen((current) => !current)}
              >
                <FiMoreHorizontal aria-hidden="true" />
              </button>

              {isUtilityMenuOpen ? (
                <div className="utility-dropdown" role="menu" aria-label="Ações de JSON">
                  <button type="button" className="utility-item" role="menuitem" onClick={triggerImportJson}>
                    Importar JSON
                  </button>
                  <button
                    type="button"
                    className="utility-item"
                    role="menuitem"
                    onClick={handleExportJson}
                    disabled={snippets.length === 0}
                  >
                    Exportar JSON
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="filters-row">
            <label className="field-control">
              <span>Categoria</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-control">
              <span>Subcategoria</span>
              <select
                value={subCategoryFilter}
                onChange={(event) => setSubCategoryFilter(event.target.value)}
              >
                <option value="all">Todas</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

        {editorMode ? (
          <section className="editor-panel" ref={editorPanelRef}>
            <h2>{editorMode === "create" ? "Novo snippet" : "Editar snippet"}</h2>

            <form onSubmit={handleSaveSnippet} className="editor-form">
              <label>
                Categoria
                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) => updateFormField("category", event.target.value)}
                  placeholder="Ex: Laravel"
                  required
                />
              </label>

              <label>
                Subcategoria
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(event) => updateFormField("subCategory", event.target.value)}
                  placeholder="Ex: Query Builder"
                  required
                />
              </label>

              <label>
                Título
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => updateFormField("title", event.target.value)}
                  placeholder="Ex: whereExists com selectRaw"
                  required
                />
              </label>

              <label>
                Descrição
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(event) => updateFormField("description", event.target.value)}
                  placeholder="Resumo curto para lembrar quando usar"
                  required
                />
              </label>

              <label>
                Código
                <textarea
                  rows={8}
                  value={formData.code}
                  onChange={(event) => updateFormField("code", event.target.value)}
                  placeholder="Cole seu snippet aqui"
                  required
                />
              </label>

              <div className="editor-actions">
                <button type="button" className="btn" onClick={closeEditor}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section className="snippets-list">
          {isLoading ? <p className="empty-state">Carregando snippets...</p> : null}

          {!isLoading && filteredSnippets.length === 0 ? (
            <p className="empty-state">Nenhum snippet encontrado para os filtros atuais.</p>
          ) : null}

          {!isLoading
            ? filteredSnippets.map((snippet) => {
                const techMeta = getTechMeta(snippet.category);
                const TechIcon = techMeta?.icon;
                const badgeStyle = techMeta
                  ? ({ "--tech-color": techMeta.color } as CSSProperties)
                  : undefined;
                const highlightedCode = highlightSnippetCode(snippet);

                return (
                  <article key={snippet.id} className="snippet-card">
                    <div className="snippet-card-header">
                      <div className="snippet-card-title">
                        <h3>{snippet.title}</h3>
                        <p>{snippet.subCategory}</p>
                      </div>

                      <span
                        className={`tech-badge${techMeta ? "" : " tech-badge-fallback"}`}
                        style={badgeStyle}
                      >
                        {TechIcon ? <TechIcon aria-hidden="true" /> : null}
                        {techMeta?.label ?? snippet.category}
                      </span>
                    </div>

                    <p className="snippet-description">{snippet.description}</p>

                    <div className="snippet-code-box">
                      <div className="snippet-code-header">
                        <span className="window-dot window-dot-red" aria-hidden="true" />
                        <span className="window-dot window-dot-yellow" aria-hidden="true" />
                        <span className="window-dot window-dot-green" aria-hidden="true" />
                        <span className="code-file-name">{getSnippetCodeLabel(snippet)}</span>
                        <button
                          type="button"
                          className="btn btn-icon btn-copy-code"
                          aria-label={
                            copiedSnippetId === snippet.id
                              ? "Código copiado"
                              : "Copiar código"
                          }
                          title={copiedSnippetId === snippet.id ? "Copiado" : "Copiar"}
                          onClick={() => void handleCopySnippet(snippet.id, snippet.code)}
                        >
                          {copiedSnippetId === snippet.id ? (
                            <FiCheck aria-hidden="true" />
                          ) : (
                            <FiCopy aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      <pre className="snippet-code-preview">
                        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                      </pre>
                    </div>

                    <div className="snippet-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        aria-label="Ver código completo"
                        title="Ver código completo"
                        onClick={() => setExpandedSnippet(snippet)}
                      >
                        <FiMaximize2 aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-neutral btn-icon"
                        aria-label="Editar snippet"
                        title="Editar"
                        onClick={() => openEditEditor(snippet)}
                      >
                        <FiEdit2 aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-icon"
                        aria-label="Excluir snippet"
                        title="Excluir"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })
            : null}
        </section>

        {expandedSnippet ? (
          <div
            className="code-modal-backdrop"
            role="presentation"
            onClick={() => setExpandedSnippet(null)}
          >
            <section
              className="code-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="code-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="code-modal-header">
                <div>
                  <h2 id="code-modal-title">{expandedSnippet.title}</h2>
                  <p>
                    {expandedSnippet.category} / {expandedSnippet.subCategory}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-neutral btn-compact"
                  onClick={() => setExpandedSnippet(null)}
                >
                  Fechar
                </button>
              </header>

              <pre className="code-modal-content">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightSnippetCode(expandedSnippet)
                  }}
                />
              </pre>
            </section>
          </div>
        ) : null}

        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          onChange={(event) => void handleImportJson(event)}
          hidden
        />
      </div>
    </div>
  );
}
