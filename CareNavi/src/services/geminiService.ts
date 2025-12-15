// T035: Gemini AI service
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';
import { ConditionAnalysis } from '../types';
import { DEFAULT_CONDITION_ANALYSIS, GEMINI_MODEL } from '../utils/constants';

let genAI: GoogleGenerativeAI | null = null;

/**
 * Initialize Gemini AI client
 */
export function initializeGemini(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Analyze condition input using Gemini AI
 */
export async function analyzeConditionWithAI(rawInput: string): Promise<ConditionAnalysis> {
  try {
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `당신은 건강 컨디션 분석 AI입니다.
사용자의 자연어 입력을 분석하여 다음 정보를 추출하세요:

1. mood: 기분 상태 (피로, 우울, 활기, 불안, 평온, 스트레스, 행복, 무기력 등)
2. physical: 신체 상태 (두통, 어깨결림, 소화불량, 근육통, 좋음, 피곤함 등)
3. mainIssue: 가장 중요한 이슈 요약 (한 문장)
4. confidence: 분석 확신도 (0-1 사이 숫자)
5. shouldRecommendProducts: 영양/건강 제품 추천이 필요한지 (true/false)
6. productKeywords: 관련 제품 검색 키워드 배열

사용자 입력: "${rawInput}"

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "mood": "string",
  "physical": "string",
  "mainIssue": "string",
  "confidence": number,
  "shouldRecommendProducts": boolean,
  "productKeywords": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('AI response not in expected JSON format');
      return DEFAULT_CONDITION_ANALYSIS;
    }

    const analysis = JSON.parse(jsonMatch[0]) as ConditionAnalysis;
    return analysis;
  } catch (error) {
    console.error('Gemini AI analysis failed:', error);
    return DEFAULT_CONDITION_ANALYSIS;
  }
}

/**
 * Test Gemini connection
 */
export async function testGemini(): Promise<boolean> {
  try {
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent('Say hello in Korean');
    console.log('Gemini connection: OK');
    console.log('Response:', result.response.text());
    return true;
  } catch (error) {
    console.log('Gemini connection: FAILED', error);
    return false;
  }
}
