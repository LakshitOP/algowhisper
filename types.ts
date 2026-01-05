
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

// Updated sources structure to correctly handle Google Search grounding objects (uri and title)
export interface AnalysisResult {
  type: ResultType;
  content: string;
  sources?: { uri: string; title: string }[];
}

export enum SupportedLanguage {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  JAVA = 'Java',
  CPP = 'C++',
  GO = 'Go',
  RUST = 'Rust'
}
