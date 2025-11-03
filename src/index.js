import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

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

			return new Response(response.text, {
				status: 200,
				headers: {
					'Content-Type': 'text/plain',
					...corsHeaders,
				},
			});
		} catch (error) {
			console.error('Internal error:', error);
			return new Response('An internal error occurred.', { status: 500, headers: corsHeaders });
		}
	},
};
