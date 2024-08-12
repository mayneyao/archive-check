/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface ArchiveResponse {
	archived_snapshots: {
		closest?: {
			url: string;
		};
	};
}

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const targetUrl = url.pathname.slice(1); // Remove leading slash

		if (!targetUrl) {
			return new Response('Missing URL', { status: 400 });
		}

		console.log(`Received target URL: ${targetUrl}`);

		try {
			const response = await fetch(targetUrl, {
				method: 'HEAD',
				redirect: 'manual',
			});

			if (response.ok) {
				console.log(`URL ${targetUrl} is accessible, redirecting`);
				return Response.redirect(targetUrl, 302);
			}

			console.log(`URL ${targetUrl} is not directly accessible (status: ${response.status})`);
		} catch (error) {
			console.error('Error checking URL:', error);
		}

		const archiveApiUrl = `https://archive.org/wayback/available?url=${targetUrl}`;
		console.log(`Querying Web Archive API: ${archiveApiUrl}`);

		try {
			const archiveResponse = await fetch(archiveApiUrl);
			const archiveData = (await archiveResponse.json()) as ArchiveResponse;

			console.log('Archive API response:', JSON.stringify(archiveData));

			if (archiveData.archived_snapshots && archiveData.archived_snapshots.closest) {
				const latestArchiveUrl = archiveData.archived_snapshots.closest.url;
				console.log(`Found archive URL: ${latestArchiveUrl}`);
				return Response.redirect(latestArchiveUrl, 302);
			} else {
				console.log('No archive snapshot found in API response');
				return Response.redirect(`https://web.archive.org/web/*/${targetUrl}`, 302);
			}
		} catch (error) {
			console.error('Error querying Web Archive:', error);
			return new Response('Error checking archive', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
