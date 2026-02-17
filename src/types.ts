export interface Snippet {
  id: string;
  category: string;
  subCategory: string;
  title: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export type SnippetFormData = Pick<
  Snippet,
  "category" | "subCategory" | "title" | "description" | "code"
>;
