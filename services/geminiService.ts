
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisScope } from "../types";

/**
 * Utility function to handle retries with exponential backoff.
 * This ensures the app is resilient against transient network issues or rate limits
 * common in cloud deployment environments.
 */
const fetchWithRetry = async (fn: () => Promise<any>, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Extract status code if available
      const status = error?.status || error?.response?.status;
      
      // Only retry on rate limits (429) or potential server/network hiccups (5xx or unknown)
      const isRetryable = status === 429 || (status >= 500 && status < 600) || !status;
      
      if (!isRetryable) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      console.warn(`Attempt ${i + 1} failed. Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

export const analyzeWord = async (word: string, scope: AnalysisScope) => {
  // Environment Check: Essential for first-time deployments on Netlify/Vercel
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Linguistic Engine Error: API_KEY is missing. Please set it in your environment variables dashboard.");
  }

  // Use gemini-3-flash-preview for high speed and reliability in a web context
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstructions = `You are a highly advanced Islamic and Arabic Grammar Analyzer (Mutawalli). Your primary goal is to provide users with in-depth, structured information concerning the Quran, Hadith, and the core disciplines of Arabic grammar (Nahw and Sarf).
  
  CRITICAL LANGUAGE REQUIREMENT:
  - All textual explanations, characteristics, methodologies, and parsing details MUST be provided in URDU.
  - Do NOT use English for descriptions.
  - Use classical Islamic linguistic terminology in Urdu (e.g., use "مبتدا" instead of just "Subject" in descriptions).
  
  Scope 1: Quran & Hadith (QURAN_HADITH)
  - Provide Urdu translation.
  - Word Etymology (Tahqeeq): Root, Form (Bāb), lexical meaning in Urdu.
  - Cross-references: Surah/Ayah for Quran or Book/Number for Hadith.
  - Five Educational Sentences in Arabic with Urdu translation.
  
  Scope 2: Ilm an-Nahw (NAHW)
  - Syntactic Rules: Word type (Ism, Fi'l, etc.) and detailed characteristics in URDU.
  - Syntactic Parsing: Explain role in a sample sentence in URDU.
  
  Scope 3: Ilm as-Sarf (SARF)
  - Conjugation Chart (REQUIRED): Provide an array of rows for Past (Madi), Present (Mudari), Command (Amr), and Prohibition (Nahi). 
  - Each row MUST contain 'singular', 'dual', and 'plural' forms in Arabic.
  - IMPORTANT: For EVERY Arabic form, you MUST provide its URDU translation (meaning) in the respective translation field.
  - Sound Change (Ta'līl) explained in URDU.
  - Seven Categories (Haft Aqsām) with Urdu explanation.
  - Weight (Wazn) and methodology explained in URDU.
  - Number, Form, and Vowel Marks (Ṣīghah I'rāb) in URDU.
  
  OUTPUT FORMAT:
  - You MUST return a VALID JSON object.
  - Do not include any text before or after the JSON.`;

  const conjugationRowSchema = {
    type: Type.OBJECT,
    properties: {
      singular: { type: Type.STRING },
      singularTranslation: { type: Type.STRING },
      dual: { type: Type.STRING },
      dualTranslation: { type: Type.STRING },
      plural: { type: Type.STRING },
      pluralTranslation: { type: Type.STRING },
    },
    required: ["singular", "singularTranslation", "dual", "dualTranslation", "plural", "pluralTranslation"]
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      quranHadith: {
        type: Type.OBJECT,
        properties: {
          urduTranslation: { type: Type.STRING },
          etymology: {
            type: Type.OBJECT,
            properties: {
              root: { type: Type.STRING },
              bab: { type: Type.STRING },
              lexicalMeaning: { type: Type.STRING },
            },
            required: ["root", "bab", "lexicalMeaning"]
          },
          references: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                reference: { type: Type.STRING },
                context: { type: Type.STRING },
              },
              required: ["source", "reference"]
            }
          },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                arabic: { type: Type.STRING },
                urdu: { type: Type.STRING },
              },
              required: ["arabic", "urdu"]
            }
          }
        }
      },
      nahw: {
        type: Type.OBJECT,
        properties: {
          rules: {
            type: Type.OBJECT,
            properties: {
              wordType: { type: Type.STRING },
              characteristics: { type: Type.STRING },
            },
            required: ["wordType", "characteristics"]
          },
          parsing: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              sampleSentence: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["role", "sampleSentence", "explanation"]
          }
        }
      },
      sarf: {
        type: Type.OBJECT,
        properties: {
          conjugations: {
            type: Type.OBJECT,
            properties: {
              madi: { type: Type.ARRAY, items: conjugationRowSchema },
              mudari: { type: Type.ARRAY, items: conjugationRowSchema },
              amr: { type: Type.ARRAY, items: conjugationRowSchema },
              nahi: { type: Type.ARRAY, items: conjugationRowSchema }
            }
          },
          talil: { type: Type.STRING },
          haftAqsam: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["category", "explanation"]
          },
          weight: {
            type: Type.OBJECT,
            properties: {
              wazn: { type: Type.STRING },
              methodology: { type: Type.STRING },
            },
            required: ["wazn", "methodology"]
          },
          sighaIrab: { type: Type.STRING }
        }
      }
    }
  };

  return fetchWithRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Analyze "${word}" using ${scope}. Ensure descriptions are in Urdu.`,
        config: {
          systemInstruction: systemInstructions,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      if (!response || !response.text) {
        throw new Error("No response received from the model.");
      }

      let text = response.text.trim();
      
      // Standardize JSON extraction
      if (text.includes("{")) {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}") + 1;
        text = text.substring(start, end);
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", text);
        throw new Error("The linguistic engine provided an invalid response format.");
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  });
};