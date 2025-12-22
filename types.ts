export enum Platform {
  LEETCODE = 'LeetCode',
  CODEFORCES = 'Codeforces',
  CODECHEF = 'CodeChef',
  UNKNOWN = 'Unknown'
}

export enum ResultType {
  ELI5 = 'ELI5',
  SOLUTION = 'Solution',
  TEST_CASES = 'Test Cases'
}

export interface AnalysisResult {
  type: ResultType;
  content: string;
  sources?: string[];
}

export enum SupportedLanguage {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  JAVA = 'Java',
  CPP = 'C++',
  GO = 'Go',
  RUST = 'Rust'
}