export type Lang = "fr" | "en";

export type DomainId = "data-ia" | "sysadmin" | "devops" | "cyber" | "webdev";

export interface Project {
  id: string;
  name: string;
  url: string;
  private: boolean;
  domain: DomainId;
  tags: string[];
  summary: Record<Lang, string>;
  demo?: string;
}

export interface DomainMeta {
  id: DomainId;
  num: number;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
}
