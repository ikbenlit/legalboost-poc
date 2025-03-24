<script lang="ts">
    import ContractAnalysis from '$lib/components/ContractAnalysis.svelte';
    import type { AnalysisResult } from '$lib/claude';

    let file: File | null = null;
    let loading = false;
    let error = '';
    let analysis: AnalysisResult | null = null;
    let fileContent = '';

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            file = input.files[0];
            
            // Check bestandstype
            const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];
            if (!allowedTypes.includes(file.type)) {
                error = 'Alleen .txt, .pdf, .docx en .md bestanden zijn toegestaan';
                file = null;
                return;
            }

            // Reset states
            error = '';
            analysis = null;
            fileContent = '';

            // Lees bestandsinhoud
            try {
                fileContent = await file.text();
            } catch (e) {
                error = 'Fout bij het lezen van het bestand';
                file = null;
            }
        }
    }

    async function handleAnalyze() {
        if (!file) {
            error = 'Selecteer eerst een bestand';
            return;
        }

        loading = true;
        error = '';

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/analyze-contract', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Er is een fout opgetreden');
            }

            analysis = data.analysis;
        } catch (e) {
            console.error('Analysis error:', e);
            error = e instanceof Error ? e.message : 'Er is een fout opgetreden';
        } finally {
            loading = false;
        }
    }
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl pt-24">
    <h1 class="text-3xl font-bold mb-8">Contract Analyse</h1>

    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="mb-6">
            <label for="contract-file" class="block text-sm font-medium text-gray-700 mb-2">
                Upload Contract
            </label>
            <input
                id="contract-file"
                type="file"
                accept=".txt,.pdf,.docx,.md"
                on:change={handleFileSelect}
                class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
            />
            <p class="mt-2 text-sm text-gray-500">
                Toegestane formaten: .txt, .pdf, .docx, .md
            </p>
        </div>

        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <button
            on:click={handleAnalyze}
            disabled={!file || loading}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Analyseren...' : 'Analyseer Contract'}
        </button>
    </div>

    {#if loading}
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
    {:else if analysis}
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <ContractAnalysis {analysis} />
        </div>
    {/if}
</div> 