import OpenAI from 'openai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		const host = 'https://gateway.ai.cloudflare.com';
		const endpoint = `/v1/${env.GEMINI_API_TOKEN}/gemini-worker/compat`; // ✅ uses your route name "gemini-worker"

		try {
			const client = new OpenAI({
				apiKey: env.GEMINI_API_KEY, // ✅ your Google AI Studio key stored in .env
				baseURL: host + endpoint,
			});

			let userPrompt = 'Tell me a joke about programmers.';
			if (request.method === 'POST' || request.method === 'PUT') {
				const body = await request.text();
				if (body && body.trim().length > 0) userPrompt = body;
			}

			const completion = await client.chat.completions.create({
				model: 'dynamic/gemini', // ✅ matches Cloudflare route config
				messages: [{ role: 'user', content: userPrompt }],
			});

			const text = completion.choices?.[0]?.message?.content || 'No response.';

			return new Response(text, {
				status: 200,
				headers: { 'Content-Type': 'text/plain', ...corsHeaders },
			});
		} catch (error) {
			console.error('Internal error:', error);
			return new Response('An internal error occurred.', { status: 500, headers: corsHeaders });
		}
	},
};
