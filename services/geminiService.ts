
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getTechnicalAnswer(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um mestre mecânico e eletricista automotivo com 30 anos de experiência. Responda de forma técnica, porém didática, ajudando alunos de um curso de elétrica automotiva. Use terminologia correta e dê dicas práticas de segurança.",
          temperature: 0.7,
        },
      });
      return response.text || "Desculpe, tive um problema ao processar sua dúvida técnica.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Erro ao conectar com o consultor técnico. Tente novamente mais tarde.";
    }
  }
}
