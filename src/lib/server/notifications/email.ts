import type { EmailChannelConfig } from '../db/schema';

export type EmailEnv = {
	RESEND_API_KEY?: string;
};

export async function sendEmailMessage(
	env: EmailEnv,
	config: EmailChannelConfig,
	subject: string,
	textBody: string,
	htmlBody: string
): Promise<void> {
	if (!env.RESEND_API_KEY) {
		throw new Error(
			'RESEND_API_KEY not configured. Set it with `pnpm wrangler secret put RESEND_API_KEY`.'
		);
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: config.from,
			to: config.to,
			subject,
			text: textBody,
			html: htmlBody
		})
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Resend send failed (${res.status}): ${body}`);
	}
}
