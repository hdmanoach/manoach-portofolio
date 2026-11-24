import raw from "@/data/projects.json";
import type { DomainId, Project } from "./types";

export const projects: Project[] = raw.projects as Project[];

export function projectsByDomain(domain: DomainId): Project[] {
  return projects.filter((p) => p.domain === domain);
}
