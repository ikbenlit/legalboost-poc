<script lang="ts">
    import ContractAnalysis from '$lib/components/ContractAnalysis.svelte';
    import ProcessingIndicator from '$lib/components/ProcessingIndicator.svelte';
    import ContractInput from '$lib/components/ContractInput.svelte';
    import type { AnalysisResult } from '$lib/claude';
    import type { ProcessingStatus } from '$lib/types/processing';
    import Header from '$lib/components/Header.svelte';

    let error = '';
    let analysis: AnalysisResult | null = null;

    // Processing status
    let processingStatus: ProcessingStatus = {
        step: 'idle',
        fileType: null
    };

    async function handleAnalyze(event: CustomEvent<{ text: string; type: 'file' | 'text' }>) {
        error = '';
        analysis = null;
        
        try {
            // Start analyzing
            processingStatus = {
                ...processingStatus,
                step: 'analyzing',
                message: 'Contract wordt geanalyseerd...'
            };

            let formData = new FormData();
            
            if (event.detail.type === 'text') {
                // Create a new Blob from the text
                const textBlob = new Blob([event.detail.text], { type: 'text/plain' });
                formData.append('file', textBlob, 'contract.txt');
            } else {
                const fileInput = document.querySelector('#contract-file') as HTMLInputElement;
                if (fileInput?.files?.[0]) {
                    formData.append('file', fileInput.files[0]);
                } else {
                    throw new Error('Geen bestand geselecteerd');
                }
            }

            const response = await fetch('/api/analyze-contract', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Er is een fout opgetreden');
            }

            analysis = data.analysis;
            processingStatus = {
                ...processingStatus,
                step: 'idle'
            };
        } catch (e) {
            console.error('Analysis error:', e);
            error = e instanceof Error ? e.message : 'Er is een fout opgetreden';
            processingStatus = {
                ...processingStatus,
                step: 'idle'
            };
        }
    }
</script>

<div class="min-h-screen bg-gray-50">
    <Header />

    <main class="py-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Contract Analyse</h1>
                <p class="mt-6 text-lg leading-8 text-gray-600">
                    Upload een contract of plak de tekst om het te laten analyseren door onze AI. Ontvang direct inzicht in de belangrijkste punten en risico's.
                </p>
            </div>

            <div class="mx-auto mt-16 max-w-2xl">
                <ContractInput on:analyze={handleAnalyze} />

                {#if processingStatus.step !== 'idle'}
                    <div class="mt-8">
                        <ProcessingIndicator status={processingStatus} />
                    </div>
                {/if}

                {#if analysis}
                    <div class="mt-8 bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-200">
                        <ContractAnalysis {analysis} />
                    </div>
                {/if}
            </div>
        </div>
    </main>
</div> 