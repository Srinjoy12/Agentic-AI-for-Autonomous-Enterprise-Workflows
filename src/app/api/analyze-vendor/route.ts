import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';

// Increase body size limit for file uploads
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export async function POST(req: Request) {
  try {
    const { documentName, fileContent, fileBase64 } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.warn("No real GEMINI_API_KEY found, falling back to mock response.");
      return NextResponse.json({
         isDocumentValid: true,
         vendorName: "ACME Corp Intl (Mock)",
         riskScore: 94,
         isHighRisk: true,
         reasons: ["Vendor location is within a restricted jurisdiction (Risk Tier 2).", "Ultimate Beneficial Owner (UBO) verification data is inconclusive."]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are an autonomous enterprise compliance agent for vendor onboarding. 
You must analyze the uploaded vendor document.

Document filename: "${documentName}"

Your task:
1. First, determine if this is a valid corporate/business document (invoice, contract, purchase order, vendor registration form). If it is clearly NOT a business document (e.g., a restaurant menu, personal photo, unrelated content), mark it invalid.
2. If valid, extract the vendor's legal entity name from the content.
3. Assign a compliance risk score (0-100) based on the ACTUAL content. Score high (80+) if you detect ANY of these: 
   - Tax haven or restricted jurisdictions (Cayman Islands, British Virgin Islands, Panama, etc.)
   - Politically Exposed Persons (PEP) references
   - Shell company indicators
   - Requests to bypass KYC/AML procedures  
   - Cryptocurrency or unregulated financial services
   - Anonymous payment methods
   - Offshore asset/entity structuring
4. Provide specific, detailed reasons for the risk score based on what you found in the document.

Return a strictly formatted JSON object with these exact keys: 
'isDocumentValid' (boolean),
'documentErrorReason' (string, explain why rejected if invalid, empty string otherwise),
'vendorName' (string, extract from content), 
'riskScore' (number 0-100), 
'isHighRisk' (boolean, true if riskScore >= 80), 
'reasons' (array of strings, each a specific compliance concern found in the document).

Output ONLY valid JSON without Markdown block fences.`;

    let result;
    const isPdf = documentName.toLowerCase().endsWith('.pdf');
    const isDocx = documentName.toLowerCase().endsWith('.docx') || documentName.toLowerCase().endsWith('.doc');

    if (fileBase64 && fileBase64.length > 100 && isPdf) {
      // PDFs: send natively to Gemini multimodal API (Gemini can read PDFs)
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: fileBase64,
          },
        },
      ]);
    } else if (fileBase64 && fileBase64.length > 100 && isDocx) {
      // DOCX: extract text server-side with mammoth, then send as text prompt
      let docxText = '';
      try {
        const buffer = Buffer.from(fileBase64, 'base64');
        const mammothResult = await mammoth.extractRawText({ buffer });
        docxText = mammothResult.value?.substring(0, 4000) || '';
        console.log('Mammoth extracted:', docxText.length, 'chars');
      } catch (err) {
        console.error('DOCX extraction error:', err);
      }
      
      const docxSection = docxText.length > 10 
        ? `\n\nHere is the text content extracted from the DOCX document:\n---\n${docxText}\n---`
        : '\n\n(Could not extract text from DOCX file.)';
      
      result = await model.generateContent(prompt + docxSection);
    } else if (fileContent && fileContent.length > 10) {
      // For text-based files (.txt, .csv), include content directly in the prompt
      result = await model.generateContent(
        prompt + `\n\nHere is the actual text content of the document:\n---\n${fileContent}\n---`
      );
    } else {
      // Filename-only fallback
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text().trim();
    
    // Strip markdown formatting if Gemini includes it
    let cleanedText = responseText;
    if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const responseJSON = JSON.parse(cleanedText);
    return NextResponse.json(responseJSON);

  } catch (error: any) {
    console.error("LLM Error:", error?.message || error);
    return NextResponse.json({
      isDocumentValid: true,
      vendorName: "Unknown Vendor (Fallback)",
      riskScore: 50,
      isHighRisk: false,
      reasons: [`Processing error: ${error?.message || 'Unknown error'}. Using safe fallback.`]
    });
  }
}
