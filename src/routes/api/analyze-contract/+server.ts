import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { analyzeContract } from '$lib/claude.js';

export const POST = (async ({ request }: { request: Request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return json({
                success: false,
                error: 'Geen bestand ontvangen'
            }, { status: 400 });
        }

        // Controleer bestandstype
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'txt') {
            return json({
                success: false,
                error: 'Alleen TXT bestanden worden ondersteund'
            }, { status: 400 });
        }

        // Lees de inhoud van het bestand
        const text = await file.text();

        // Analyze contract using Claude
        const analysis = await analyzeContract(text);

        return json({
            success: true,
            analysis
        });
    } catch (error: any) {
        console.error('Error analyzing contract:', error);
        return json({
            success: false,
            error: 'Er is een fout opgetreden bij het analyseren van het contract',
            details: error.message
        }, { status: 500 });
    }
}) satisfies RequestHandler; 