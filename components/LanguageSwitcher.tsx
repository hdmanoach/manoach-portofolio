"use client";

import { useLanguage } from "@/lib/language";
import type { Lang } from "@/lib/types";

const options: Lang[] = ["fr", "en"];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label="FR / EN">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`language-button${lang === option ? " active" : ""}`}
          aria-pressed={lang === option}
          onClick={() => setLang(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
