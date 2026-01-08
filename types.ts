
export enum AnalysisScope {
  QURAN_HADITH = 'QURAN_HADITH',
  NAHW = 'NAHW',
  SARF = 'SARF'
}

export interface QuranHadithResult {
  urduTranslation: string;
  etymology: {
    root: string;
    bab: string;
    lexicalMeaning: string;
  };
  references: Array<{
    source: string;
    reference: string;
    context: string;
  }>;
  sentences: Array<{
    arabic: string;
    urdu: string;
  }>;
}

export interface NahwResult {
  rules: {
    wordType: string;
    characteristics: string;
  };
  parsing: {
    role: string;
    sampleSentence: string;
    explanation: string;
  };
}

export interface ConjugationRow {
  singular: string;
  singularTranslation?: string;
  dual: string;
  dualTranslation?: string;
  plural: string;
  pluralTranslation?: string;
}

export interface SarfResult {
  conjugations: {
    madi: ConjugationRow[];
    mudari: ConjugationRow[];
    amr: ConjugationRow[];
    nahi: ConjugationRow[];
  };
  talil: string;
  haftAqsam: {
    category: string;
    explanation: string;
  };
  weight: {
    wazn: string;
    methodology: string;
  };
  sighaIrab: string;
}

export interface AnalysisResult {
  scope: AnalysisScope;
  word: string;
  quranHadith?: QuranHadithResult;
  nahw?: NahwResult;
  sarf?: SarfResult;
}
