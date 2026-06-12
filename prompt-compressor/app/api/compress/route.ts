import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, strategy } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing from environment variables' }, { status: 500 });
    }

    // Define instructions based on strategy
    let instructions = '';
    if (strategy === 'gentle') {
      instructions = 'Remove unnecessary filler words, pleasantries, and redundant phrasing, but keep all important context and natural sentence structure.';
    } else if (strategy === 'moderate') {
      instructions = 'Aggressively remove stop words, filler, and transition words. Use abbreviations where common. The output should be dense but still highly readable by an LLM.';
    } else { // aggressive
      instructions = 'Extract only the absolute core keywords, entities, and commands. Remove all grammar, syntax, and stop words. Output a highly condensed string of keywords separated by spaces. Prioritize extreme token reduction over human readability.';
    }

    const requestBody = {
      system_instruction: {
        parts: [{ 
          text: `You are an expert prompt compressor. Your goal is to reduce the token count of the given prompt as much as possible without losing the core intent or constraints. ${instructions}\n\nDo not add any conversational text, greetings, or explanations. Output ONLY the compressed prompt and nothing else.` 
        }]
      },
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.1, // Low temperature for deterministic and focused compression
      }
    };

    // Note: Using gemini-3.5-flash as the reliable, fast model for compression.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return NextResponse.json({ error: 'Failed to compress prompt with Gemini' }, { status: 500 });
    }

    const data = await response.json();
    const compressedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ compressed: compressedText.trim() });
  } catch (error) {
    console.error("Compression route error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
