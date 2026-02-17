import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { defaultSnippets } from "./defaultSnippets";
import { getStoredSnippets, setStoredSnippets } from "./storage";
import { Snippet, SnippetFormData } from "./types";

const EMPTY_FORM: SnippetFormData = {
  category: "",
  subCategory: "",
  title: "",
  description: "",
  code: ""
};

function createSnippetId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `snippet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");

  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SnippetFormData>(EMPTY_FORM);

  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const importInputRef = useRef<HTMLInputElement | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

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
  }

  function closeEditor(): void {
    setEditorMode(null);
    setEditingSnippetId(null);
    setFormData(EMPTY_FORM);
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
  }

  function triggerImportJson(): void {
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
    <div className="popup">
      <header className="popup-header">
        <div>
          <h1>Cola do Dev</h1>
          <p>Cheats e snippets no popup do Chrome</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateEditor}>
          Novo
        </button>
      </header>

      <section className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar por título, descrição, categoria ou código"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <div className="filters-row">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Todas categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={subCategoryFilter}
            onChange={(event) => setSubCategoryFilter(event.target.value)}
          >
            <option value="all">Todas subcategorias</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>

        <div className="actions-row">
          <button type="button" className="btn" onClick={triggerImportJson}>
            Importar JSON
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleExportJson}
            disabled={snippets.length === 0}
          >
            Exportar JSON
          </button>
        </div>
      </section>

      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

      {editorMode ? (
        <section className="editor-panel">
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
          ? filteredSnippets.map((snippet) => (
              <article key={snippet.id} className="snippet-card">
                <div className="snippet-card-header">
                  <div>
                    <h3>{snippet.title}</h3>
                    <p>
                      {snippet.category} / {snippet.subCategory}
                    </p>
                  </div>
                </div>

                <p className="snippet-description">{snippet.description}</p>

                <pre>
                  <code>{snippet.code}</code>
                </pre>

                <div className="snippet-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => void handleCopySnippet(snippet.id, snippet.code)}
                  >
                    {copiedSnippetId === snippet.id ? "Copiado" : "Copiar"}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => openEditEditor(snippet)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteSnippet(snippet.id)}
                  >
                    Remover
                  </button>
                </div>
              </article>
            ))
          : null}
      </section>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        onChange={(event) => void handleImportJson(event)}
        hidden
      />
    </div>
  );
}
