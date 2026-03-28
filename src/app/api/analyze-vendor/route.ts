import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { documentName } = await req.json();
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.warn("No real GEMINI_API_KEY found, falling back to mock response.");
      return NextResponse.json({
         isDocumentValid: true,
         vendorName: "ACME Corp Intl (Mock)",
         riskScore: 94,
         isHighRisk: true,
         reasons: ["Vendor location is within a restricted jurisdiction (Risk Tier 2)."]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an autonomous enterprise compliance agent. Analyze this uploaded vendor document name: "${documentName}". 
Return a strictly formatted JSON object with these exact keys: 
'isDocumentValid' (boolean, strict false if the filename heavily implies it's NOT a corporate invoice/contract/onboarding document, e.g., a menu, personal photo, fast food receipt),
'documentErrorReason' (string, explain why it is rejected if isDocumentValid is false),
'vendorName' (string, extract from name), 
'riskScore' (number 0-100, generate sensibly based on context), 
'isHighRisk' (boolean, true if score >= 80), 
'reasons' (array of strings explaining the risk). Output ONLY valid JSON without Markdown block fences.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Helper to strip markdown formatting if Gemini includes it
    let cleanedText = responseText;
    if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const responseJSON = JSON.parse(cleanedText);
    return NextResponse.json(responseJSON);

  } catch (error) {
    console.error("LLM Error:", error);
    return NextResponse.json({ error: "Failed to process via Gemini API" }, { status: 500 });
  }
}
