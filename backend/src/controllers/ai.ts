import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini Client lazily to ensure environment variables are loaded
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResume = async (req: Request, res: Response): Promise<void> => {
  const { texContent } = req.body;

  if (!texContent) {
    res.status(400).json({ error: 'LaTeX content is required' });
    return;
  }

  try {
    const prompt = `
    You are an expert resume reviewer and ATS optimization specialist.
    Review the following LaTeX resume and provide a structured JSON response.
    
    The JSON should contain:
    - score: A number from 0-100 indicating the overall quality.
    - summary: A short string summarizing the overall feedback.
    - sections: An array of objects, each containing:
      - name: The section name (e.g., "Experience", "Education").
      - feedback: Specific feedback for this section.
    
    Resume LaTeX:
    ${texContent}
    `;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json(resultJson);
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

export const suggestImprovement = async (req: Request, res: Response): Promise<void> => {
  const { blockContent, context } = req.body;

  if (!blockContent) {
    res.status(400).json({ error: 'Block content is required' });
    return;
  }

  try {
    const prompt = `
    You are an expert resume writer. Improve the following LaTeX block.
    Keep the LaTeX formatting intact, but rewrite the content to use stronger action verbs, better metrics, and a more professional tone.
    Context (if any): ${context || 'None'}
    
    Return ONLY the improved raw LaTeX code, without markdown blocks.
    
    Original Block:
    ${blockContent}
    `;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ suggestion: response.text });
  } catch (error: any) {
    console.error('Gemini Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
};

export const tailorResume = async (req: Request, res: Response): Promise<void> => {
  const { texContent, jobDescription } = req.body;

  if (!texContent || !jobDescription) {
    res.status(400).json({ error: 'LaTeX content and job description are required' });
    return;
  }

  try {
    const prompt = `
    You are an expert resume writer. Tailor the following LaTeX resume for the job description below.
    Rewrite bullet points, reorder sections, and adjust emphasis to align with the job requirements.
    Maintain the existing LaTeX structure and formatting.
    
    Return a structured JSON response with:
    - matchScore: A number from 0-100 indicating how well the original resume matches the job.
    - gapReport: A short string explaining what skills/keywords were missing.
    - tailoredTex: The complete updated raw LaTeX code.
    
    Job Description:
    ${jobDescription}
    
    Original Resume LaTeX:
    ${texContent}
    `;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json(resultJson);
  } catch (error: any) {
    console.error('Gemini Tailoring Error:', error);
    res.status(500).json({ error: 'Failed to tailor resume' });
  }
};
