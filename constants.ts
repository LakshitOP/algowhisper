import { SupportedLanguage } from './types';

export const PATTERNS = {
  LEETCODE: /https?:\/\/(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+\/?/,
  CODEFORCES: /https?:\/\/(www\.)?codeforces\.com\/(contest|problemset)\/problem\/.*/,
  CODECHEF: /https?:\/\/(www\.)?codechef\.com\/problems\/[a-zA-Z0-9-]+\/?/
};

export const LANGUAGES: SupportedLanguage[] = [
  SupportedLanguage.PYTHON,
  SupportedLanguage.CPP,
  SupportedLanguage.JAVA,
  SupportedLanguage.JAVASCRIPT,
  SupportedLanguage.GO,
  SupportedLanguage.RUST
];