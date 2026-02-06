
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
  fileName: string;
}
