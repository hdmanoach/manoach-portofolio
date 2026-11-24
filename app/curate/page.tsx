import type { Metadata } from "next";
import Curator from "@/components/Curator";
import raw from "@/data/projects.json";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Curation — Manoach HOSSOU DODO",
  description: "Outil d'administration du portfolio : sélection des dépôts à publier.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return <Curator initialProjects={raw.projects as Project[]} />;
}
