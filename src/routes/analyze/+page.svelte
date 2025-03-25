<script lang="ts">
    import ContractAnalysis from '$lib/components/ContractAnalysis.svelte';
    import ContractInput from '$lib/components/ContractInput.svelte';
    import Header from '$lib/components/Header.svelte';

    let error = '';
    let analysis: {
        risks: Array<{
            severity: 'high' | 'medium' | 'low';
            description: string;
        }>;
        recommendations: string[];
        considerations: string[];
    } | null = null;

    // Processing status
    let processingStatus = {
        step: 'idle' as 'idle' | 'analyzing',
        message: ''
    };

    async function handleAnalyze(event: CustomEvent<{ text: string; type: 'file' | 'text' }>) {
        error = '';
        analysis = null;
        
        try {
            // Start analyzing
            processingStatus = {
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
                step: 'idle',
                message: ''
            };
        } catch (e) {
            console.error('Analysis error:', e);
            error = e instanceof Error ? e.message : 'Er is een fout opgetreden';
            processingStatus = {
                step: 'idle',
                message: ''
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

            <div class="mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Linkerkant: Input sectie -->
                <div>
                    <ContractInput on:analyze={handleAnalyze} />
                </div>

                <!-- Rechterkant: Analyse sectie -->
                <div class="lg:sticky lg:top-8">
                    {#if analysis}
                        <div class="bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-200">
                            <ContractAnalysis {analysis} />
                        </div>
                    {:else}
                        <div class="bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-200">
                            <div class="text-center text-gray-500">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 class="mt-2 text-sm font-medium text-gray-900">Geen analyse beschikbaar</h3>
                                <p class="mt-1 text-sm text-gray-500">Upload een contract of plak de tekst om een analyse te krijgen.</p>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </main>

    {#if processingStatus.step !== 'idle'}
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
                <div class="relative">
                    <!-- Outer ring -->
                    <div class="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <!-- Inner ring -->
                    <div class="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-indigo-50 border-t-indigo-400 animate-spin"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Contract wordt geanalyseerd...</p>
                <p class="text-sm text-gray-500 mt-2">Dit kan enkele momenten duren</p>
            </div>
        </div>
    {/if}
</div> 