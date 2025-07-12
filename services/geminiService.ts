import { GoogleGenAI, Type } from "@google/genai";
import type { CaseData, AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        likelySites: {
            type: Type.ARRAY,
            description: "A list of likely injury locations, sorted from most to least likely. Include a confidence percentage and a brief explanation for each.",
            items: {
                type: Type.OBJECT,
                properties: {
                    site: {
                        type: Type.STRING,
                        description: "The anatomical location of the potential injury (e.g., 'Upper Trunk C5-C6', 'Posterior Cord', 'Root C7')."
                    },
                    confidence: {
                        type: Type.INTEGER,
                        description: "A confidence score from 0 to 100 representing the likelihood of this location."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief explanation for why this site is considered likely."
                    }
                },
                required: ["site", "confidence", "explanation"]
            }
        },
        reasoning: {
            type: Type.ARRAY,
            description: "A step-by-step logical deduction of how the conclusion was reached, explaining the clinical reasoning.",
            items: { type: Type.STRING }
        },
        followUp: {
            type: Type.ARRAY,
            description: "A list of recommended next steps or follow-up tests for the patient.",
            items: { type: Type.STRING }
        }
    },
    required: ["likelySites", "reasoning", "followUp"]
};

const buildPrompt = (data: CaseData): string => {
  let prompt = `Analyze the following findings to localize a brachial plexus injury.\n\n`;
  prompt += `Evaluation Mode: ${data.mode}\n\n`;

  if (data.ncsMotor.length > 0 || data.ncsSensory.length > 0) {
    prompt += "--- Nerve Conduction Study (NCS) Findings ---\n";
    if (data.ncsMotor.length > 0) {
      prompt += "Abnormal Motor Nerves:\n" + data.ncsMotor.map(n => `- ${n.nerve} (${n.type})`).join("\n") + "\n";
    }
    if (data.ncsSensory.length > 0) {
      prompt += "Abnormal Sensory Nerves:\n" + data.ncsSensory.map(n => `- ${n.nerve} (${n.type})`).join("\n") + "\n";
    }
     if (data.ncsMotor.length === 0 && data.ncsSensory.length === 0) {
      prompt += "No abnormal NCS findings reported.\n";
    }
    prompt += "\n";
  }

  if (data.examMotor.length > 0 || data.examReflex.length > 0 || data.examSpecific.length > 0 || data.examSensory.length > 0) {
    prompt += "--- Physical Examination Findings ---\n";
    if(data.examMotor.length > 0) prompt += "Motor Weakness: " + data.examMotor.join(", ") + "\n";
    if(data.examReflex.length > 0) prompt += "Reflex Changes: " + data.examReflex.join(", ") + "\n";
    if(data.examSpecific.length > 0) prompt += "Specific Signs: " + data.examSpecific.join(", ") + "\n";
    if(data.examSensory.length > 0) prompt += "Sensory Deficits: " + data.examSensory.join(", ") + "\n";
    if (data.examMotor.length === 0 && data.examReflex.length === 0 && data.examSpecific.length === 0 && data.examSensory.length === 0) {
        prompt += "No abnormal physical exam findings reported.\n";
    }
    prompt += "\n";
  }
  
  prompt += "Based on these findings, provide a differential diagnosis for the lesion's location, your reasoning, and recommended follow-up actions. Pay close attention to patterns indicating pre-ganglionic (root) vs. post-ganglionic (plexus) lesions. For instance, abnormal sensory exam with normal SNAPs points to a pre-ganglionic lesion."

  return prompt;
};

export const analyzeBrachialPlexusCase = async (data: CaseData): Promise<AnalysisResult> => {
  const prompt = buildPrompt(data);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
        systemInstruction: "You are an expert neurophysiologist specializing in localizing brachial plexus injuries. Your task is to analyze clinical and electrodiagnostic findings to determine the most likely site of a nerve injury. Provide your analysis in a structured JSON format. For educational purposes only.",
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);

    // Basic validation
    if (!result.likelySites || !result.reasoning || !result.followUp) {
        throw new Error("Invalid response format from API.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("The request was blocked due to safety settings. Please modify the input.");
    }
    throw new Error("Failed to get analysis from Gemini API.");
  }
};