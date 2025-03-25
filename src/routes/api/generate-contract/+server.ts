import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import type { ContractDetails } from '$lib/stores/wizardStore.js';
import { generateEnhancedContract } from '$lib/claude.js';

export const POST = (async ({ request }) => {
    try {
        const details: ContractDetails = await request.json();
        console.log('Received details:', JSON.stringify(details, null, 2));

        if (!details.contractType) {
            console.error('Missing contractType');
            return json({
                success: false,
                error: 'Contract type is niet gespecificeerd'
            }, { status: 400 });
        }

        if (!details.sector) {
            console.error('Missing sector');
            return json({
                success: false,
                error: 'Sector is niet gespecificeerd'
            }, { status: 400 });
        }

        const result = await generateEnhancedContract({
            contractType: details.contractType,
            details: details
        });
        console.log('Generated enhanced contract result:', result);

        return json({
            success: true,
            content: result.content,
            analysis: result.analysis
        });
    } catch (error) {
        console.error('Error generating contract:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Stuur de error details terug naar de client
            return json({
                success: false,
                error: `Er is een fout opgetreden: ${error.message}`,
                details: error.name
            }, { status: error.message.includes('502') ? 502 : 500 });
        }
        return json({
            success: false,
            error: 'Er is een onbekende fout opgetreden bij het genereren van het contract'
        }, { status: 500 });
    }
}) satisfies RequestHandler; 