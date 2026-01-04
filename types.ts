export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface AnalysisResult {
  summary: string;
  medicalAdvice: string;
  translatedText: string;
  originalFileName: string;
  targetLanguage: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  LANGUAGE_SELECT = 'LANGUAGE_SELECT',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface FileData {
  file: File;
  base64: string;
  mimeType: string;
}