import { GoogleGenAI } from '@google/genai';

export default {
	async fetch(request, env, ctx) {
		try {
			const ai = new GoogleGenAI({
				apiKey: env.GEMINI_API_KEY,
			});

			let userPrompt = 'Tell me a joke about programmers.';
			if (request.method === 'POST' || request.method === 'PUT') {
				const body = await request.text();
				if (body && body.trim().length > 0) {
					userPrompt = body;
				}
			}

			const response = await ai.models.generateContent({
				model: 'gemini-2.5-flash',
				contents: userPrompt,
			});

			return new Response(response.text);
		} catch (error) {
			console.error('Internal error:', error);
			return new Response('An internal error occurred.', { status: 500 });
		}
	},
};
