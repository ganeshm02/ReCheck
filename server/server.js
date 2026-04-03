import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/analyze-ats', async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Resume text and job description are required.' });
  }

  console.log('[ATS Analyze] Received request');
  console.log('[ATS Analyze] Resume length:', resumeText.length, 'chars');
  console.log('[ATS Analyze] Job description length:', jobDescription.length, 'chars');

  const prompt = `You are "ReCheck ATS Analyzer" — a senior HR technology expert specializing in Applicant Tracking Systems, resume optimization, and recruitment workflows.

TASK: Perform a comprehensive ATS compatibility analysis of the provided resume against the given job description.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

ANALYSIS FRAMEWORK:
1. KEYWORD MATCHING — Extract critical keywords, skills, and phrases from the job description. Compare against resume content. Calculate match percentage.
2. SECTION ANALYSIS — Evaluate: Contact Information, Professional Summary/Objective, Work Experience, Education, Skills, Certifications, Projects.
3. FORMATTING ASSESSMENT — Check for ATS-friendly formatting: clear section headers, standard date formats, no complex tables/graphics references, proper use of bullet points.
4. ACHIEVEMENT QUANTIFICATION — Check if achievements are backed by metrics (numbers, percentages, dollar amounts).
5. EXPERIENCE RELEVANCE — How well does the experience align with the job requirements?
6. SKILLS GAP — Identify critical skills from the job description that are missing from the resume.

SCORING RULES:
- Score 0-100 where:
  - 90-100: Excellent ATS match, highly likely to pass
  - 75-89: Good match, likely to pass with minor improvements
  - 60-74: Moderate match, needs optimization
  - 40-59: Below average, significant gaps
  - 0-39: Poor match, major overhaul needed
- Be STRICT and REALISTIC. Do not inflate scores.
- Weight keyword matching at 35%, experience relevance at 25%, skills coverage at 20%, formatting at 10%, quantification at 10%.

TONE GUIDELINES:
- Be factual and balanced. Avoid superlatives like "exceptional", "outstanding", "remarkable", "incredibly".
- Use clear, professional language. State observations plainly without dramatization.
- Give honest, calibrated feedback — neither overly harsh nor needlessly flattering.
- Keep feedback concise and actionable. Every suggestion should be specific enough to act on.

OUTPUT: Return ONLY valid JSON matching the schema exactly.`;

  const schema = {
    type: 'OBJECT',
    properties: {
      overall_score: { type: 'NUMBER' },
      score_breakdown: {
        type: 'OBJECT',
        properties: {
          keyword_match: { type: 'OBJECT', properties: { score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, feedback: { type: 'STRING' } } },
          experience_relevance: { type: 'OBJECT', properties: { score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, feedback: { type: 'STRING' } } },
          skills_coverage: { type: 'OBJECT', properties: { score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, feedback: { type: 'STRING' } } },
          formatting: { type: 'OBJECT', properties: { score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, feedback: { type: 'STRING' } } },
          quantification: { type: 'OBJECT', properties: { score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, feedback: { type: 'STRING' } } }
        }
      },
      matched_keywords: { type: 'ARRAY', items: { type: 'STRING' } },
      missing_keywords: { type: 'ARRAY', items: { type: 'STRING' } },
      strengths: { type: 'ARRAY', items: { type: 'STRING' } },
      weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
      improvements: { type: 'ARRAY', items: { type: 'STRING' } },
      section_feedback: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            section: { type: 'STRING' },
            status: { type: 'STRING' },
            feedback: { type: 'STRING' }
          }
        }
      },
      summary: { type: 'STRING' }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const result = JSON.parse(response.text.trim());
    console.log('[ATS Analyze] Score:', result.overall_score);
    console.log('[ATS Analyze] Matched keywords:', result.matched_keywords?.length);
    console.log('[ATS Analyze] Missing keywords:', result.missing_keywords?.length);
    res.json(result);
  } catch (error) {
    console.error('[ATS Analyze] Gemini API error:', error);
    res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
  }
});

app.post('/api/optimize', async (req, res) => {
  const { resumeText, jobTitle, industry } = req.body;

  if (!resumeText || !jobTitle || !industry) {
    return res.status(400).json({ error: 'Resume text, job title, and industry are required.' });
  }

  console.log('[Optimize] Received request');
  console.log('[Optimize] Resume length:', resumeText.length, 'chars');
  console.log('[Optimize] Job title:', jobTitle);
  console.log('[Optimize] Industry:', industry);

  const prompt = `You are "ReCheck Resume Optimizer" — a senior career coach and resume strategist with deep expertise across multiple industries.

TASK: Perform a thorough analysis of the provided resume and provide actionable optimization advice for the specified target role and industry.

RESUME TEXT:
"""
${resumeText}
"""

TARGET JOB TITLE: ${jobTitle}
TARGET INDUSTRY: ${industry}

ANALYSIS FRAMEWORK:
1. KEYWORD OPTIMIZATION — Identify relevant industry keywords and ATS-friendly terms the resume should include for the target role. List what's present and what's missing.
2. ACHIEVEMENT HIGHLIGHTING — Review current bullet points. Transform generic job duties into impressive, metric-driven achievements. Provide specific rewrite examples.
3. SKILLS ENHANCEMENT — Compare the resume's skills against industry standards for the target role. Suggest skills to add, remove, or reorder.
4. PROFESSIONAL SUMMARY — Evaluate the current summary/objective. Provide a rewritten version optimized for the target role.
5. SECTION STRUCTURE — Assess the overall resume structure and suggest improvements in section ordering, content emphasis, and formatting.
6. INDUSTRY ALIGNMENT — Evaluate how well the resume aligns with ${industry} industry expectations and conventions.

SCORING AND ASSESSMENT:
- Provide an overall readiness score (0-100) for the target role.
- Be constructive but honest. Highlight both strengths and specific areas for improvement.

TONE GUIDELINES:
- Be factual and balanced. Avoid superlatives like "exceptional", "outstanding", "remarkable", "incredibly".
- Use clear, professional language. State observations plainly without dramatization.
- Keep rewrites realistic — improve clarity and impact, but don't fabricate achievements or metrics the candidate didn't mention.
- Give honest, calibrated feedback — neither overly harsh nor needlessly flattering.
- Every suggestion should be specific and actionable.

OUTPUT: Return ONLY valid JSON matching the schema exactly.`;

  const schema = {
    type: 'OBJECT',
    properties: {
      readiness_score: { type: 'NUMBER' },
      overall_assessment: { type: 'STRING' },
      keyword_analysis: {
        type: 'OBJECT',
        properties: {
          present_keywords: { type: 'ARRAY', items: { type: 'STRING' } },
          suggested_keywords: { type: 'ARRAY', items: { type: 'STRING' } },
          feedback: { type: 'STRING' }
        }
      },
      achievement_rewrites: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            original: { type: 'STRING' },
            improved: { type: 'STRING' },
            reason: { type: 'STRING' }
          }
        }
      },
      skills_suggestions: {
        type: 'OBJECT',
        properties: {
          add: { type: 'ARRAY', items: { type: 'STRING' } },
          keep: { type: 'ARRAY', items: { type: 'STRING' } },
          remove: { type: 'ARRAY', items: { type: 'STRING' } },
          feedback: { type: 'STRING' }
        }
      },
      summary_rewrite: {
        type: 'OBJECT',
        properties: {
          current_assessment: { type: 'STRING' },
          suggested_summary: { type: 'STRING' }
        }
      },
      section_feedback: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            section: { type: 'STRING' },
            status: { type: 'STRING' },
            feedback: { type: 'STRING' },
            priority: { type: 'STRING' }
          }
        }
      },
      industry_tips: { type: 'ARRAY', items: { type: 'STRING' } },
      strengths: { type: 'ARRAY', items: { type: 'STRING' } },
      critical_improvements: { type: 'ARRAY', items: { type: 'STRING' } }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const result = JSON.parse(response.text.trim());
    console.log('[Optimize] Readiness score:', result.readiness_score);
    console.log('[Optimize] Suggested keywords:', result.keyword_analysis?.suggested_keywords?.length);
    console.log('[Optimize] Achievement rewrites:', result.achievement_rewrites?.length);
    res.json(result);
  } catch (error) {
    console.error('[Optimize] Gemini API error:', error);
    res.status(500).json({ error: 'Failed to optimize resume. Please try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Your API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Server] ReCheck backend running on port ${PORT}`);
});
