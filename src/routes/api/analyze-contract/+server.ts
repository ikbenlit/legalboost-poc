import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analyzeContract } from '$lib/claude';

export const POST = (async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return json({
                success: false,
                error: 'Geen bestand geüpload'
            }, { status: 400 });
        }

        // Lees de file content
        const fileContent = await file.text();
        
        // Analyze contract using Claude
        const analysis = await analyzeContract(fileContent);

        return json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Error analyzing contract:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het analyseren van het contract'
        }, { status: 500 });
    }
}) satisfies RequestHandler; 