<!-- ContractInput.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher<{
        analyze: { text: string; type: 'file' | 'text' };
    }>();

    let activeTab: 'file' | 'text' = 'file';
    let file: File | null = null;
    let contractText = '';
    let error = '';

    // Bestandsselectie handler
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            file = input.files[0];
            
            // Check bestandstype
            const fileType = file.name.split('.').pop()?.toLowerCase();
            if (!['txt'].includes(fileType || '')) {
                error = 'Alleen TXT bestanden zijn toegestaan';
                file = null;
                return;
            }

            error = '';
        }
    }

    // Tekstinvoer handler
    function handleTextInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        contractText = textarea.value;
        error = '';
    }

    // Analyse handler
    function handleAnalyze() {
        if (activeTab === 'file' && !file) {
            error = 'Selecteer eerst een bestand';
            return;
        }

        if (activeTab === 'text' && !contractText.trim()) {
            error = 'Voer eerst tekst in';
            return;
        }

        dispatch('analyze', {
            text: activeTab === 'file' ? '' : contractText,
            type: activeTab
        });
    }
</script>

<div class="bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-200">
    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    {activeTab === 'file'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click={() => activeTab = 'file'}
            >
                Bestand uploaden
            </button>
            <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    {activeTab === 'text'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click={() => activeTab = 'text'}
            >
                Tekst plakken
            </button>
        </nav>
    </div>

    <!-- Content -->
    {#if activeTab === 'file'}
        <div class="mb-6">
            <label for="contract-file" class="block text-sm font-semibold leading-6 text-gray-900 mb-2">
                Upload Contract
            </label>
            <input
                id="contract-file"
                type="file"
                accept=".txt"
                on:change={handleFileSelect}
                class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    focus:outline-none"
            />
            <p class="mt-2 text-sm text-gray-500">
                Toegestane formaten: TXT
            </p>
        </div>
    {:else}
        <div class="mb-6">
            <label for="contract-text" class="block text-sm font-semibold leading-6 text-gray-900 mb-2">
                Contract Tekst
            </label>
            <textarea
                id="contract-text"
                rows="10"
                placeholder="Plak hier de contract tekst..."
                on:input={handleTextInput}
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >{contractText}</textarea>
            <div class="mt-2 flex justify-between text-sm text-gray-500">
                <span>{contractText.length} karakters</span>
                <button
                    on:click={() => contractText = ''}
                    class="text-indigo-600 hover:text-indigo-500"
                >
                    Wissen
                </button>
            </div>
        </div>
    {/if}

    {#if error}
        <div class="mb-6 rounded-md bg-red-50 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{error}</h3>
                </div>
            </div>
        </div>
    {/if}

    <button
        on:click={handleAnalyze}
        class="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        Analyseer Contract
    </button>
</div> 