<script lang="ts">
    import { wizardStore, type ContractDetails } from '$lib/stores/wizardStore';
    import ProgressIndicator from '$lib/components/wizard/ProgressIndicator.svelte';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    
    let loading = false;
    let error = '';
    let generatedContract = '';
    let showSuccess = false;

    $: currentStep = $wizardStore.currentStep;
    $: details = $wizardStore.details;

    function handleNext() {
        if (validateCurrentStep()) {
            wizardStore.nextStep();
        }
    }

    function handlePrevious() {
        wizardStore.previousStep();
    }

    function handleReset() {
        generatedContract = '';
        showSuccess = false;
        wizardStore.reset();
    }

    function validateCurrentStep(): boolean {
        switch (currentStep) {
            case 1:
                if (!details.contractType) {
                    error = 'Selecteer een contract type';
                    return false;
                }
                break;
            case 2:
                if (!details.companyInfo.name || !details.companyInfo.kvkNumber || !details.companyInfo.address) {
                    error = 'Vul alle bedrijfsgegevens in';
                    return false;
                }
                break;
            case 3:
                if (!details.contractorInfo.name || !details.contractorInfo.address) {
                    error = 'Vul alle contractant gegevens in';
                    return false;
                }
                break;
            case 4:
                if (!details.contractSpecifics.startDate) {
                    error = 'Vul een startdatum in';
                    return false;
                }
                break;
        }
        error = '';
        return true;
    }

    async function handleSubmit() {
        if (!validateCurrentStep()) return;

        loading = true;
        try {
            const response = await fetch('/api/generate-contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            });

            const data = await response.json();
            console.log('API Response:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Er is een fout opgetreden');
            }

            generatedContract = data.content;
            showSuccess = true;
        } catch (e) {
            console.error('Contract generation error:', e);
            error = e instanceof Error ? e.message : 'Er is een fout opgetreden';
        } finally {
            loading = false;
        }
    }
</script>

<!-- Header -->
<nav class="fixed w-full bg-primary shadow-sm z-50">
    <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <button 
                class="flex items-center space-x-4 hover:opacity-80 transition-opacity"
                on:click={() => goto('/')}
            >
                <img src="/src/assets/images/logo-scherplegal-svg.svg" alt="Legal Boost" class="h-8 w-auto brightness-0 invert" />
                <span class="text-xl font-semibold text-text-light"></span>
            </button>
        </div>
    </div>
</nav>

<!-- Main Content with padding for fixed header -->
<div class="container mx-auto px-4 py-8 max-w-4xl pt-24">
    <h1 class="text-3xl font-bold mb-8">Contract Generator</h1>
    
    {#if !showSuccess}
        <ProgressIndicator currentStep={currentStep} />

        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <div class="bg-white p-6 rounded-lg shadow-lg">
            {#if currentStep === 1}
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold mb-4">Selecteer Contract Type</h2>
                    <div>
                        <label for="contractType" class="block text-sm font-medium text-gray-700">Contract Type</label>
                        <select
                            id="contractType"
                            bind:value={details.contractType}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Selecteer een type</option>
                            <option value="arbeidsovereenkomst">Arbeidsovereenkomst</option>
                            <option value="leveranciersovereenkomst">Leveranciersovereenkomst</option>
                            <option value="geheimhoudingsverklaring">Geheimhoudingsverklaring</option>
                        </select>
                    </div>
                </div>
            {:else if currentStep === 2}
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold mb-4">Bedrijfsgegevens</h2>
                    <div>
                        <label for="companyName" class="block text-sm font-medium text-gray-700">Bedrijfsnaam</label>
                        <input
                            type="text"
                            id="companyName"
                            bind:value={details.companyInfo.name}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label for="kvkNumber" class="block text-sm font-medium text-gray-700">KVK Nummer</label>
                        <input
                            type="text"
                            id="kvkNumber"
                            bind:value={details.companyInfo.kvkNumber}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label for="companyAddress" class="block text-sm font-medium text-gray-700">Adres</label>
                        <input
                            type="text"
                            id="companyAddress"
                            bind:value={details.companyInfo.address}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            {:else if currentStep === 3}
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold mb-4">Contractant Gegevens</h2>
                    <div>
                        <label for="contractorName" class="block text-sm font-medium text-gray-700">Naam</label>
                        <input
                            type="text"
                            id="contractorName"
                            bind:value={details.contractorInfo.name}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label for="contractorAddress" class="block text-sm font-medium text-gray-700">Adres</label>
                        <input
                            type="text"
                            id="contractorAddress"
                            bind:value={details.contractorInfo.address}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    {#if details.contractType === 'arbeidsovereenkomst'}
                        <div>
                            <label for="bsn" class="block text-sm font-medium text-gray-700">BSN</label>
                            <input
                                type="text"
                                id="bsn"
                                bind:value={details.contractorInfo.bsn}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    {:else if details.contractType === 'leveranciersovereenkomst'}
                        <div>
                            <label for="contractorKvk" class="block text-sm font-medium text-gray-700">KVK Nummer</label>
                            <input
                                type="text"
                                id="contractorKvk"
                                bind:value={details.contractorInfo.kvkNumber}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    {/if}
                </div>
            {:else if currentStep === 4}
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold mb-4">Contract Details</h2>
                    <div>
                        <label for="startDate" class="block text-sm font-medium text-gray-700">Startdatum</label>
                        <input
                            type="date"
                            id="startDate"
                            bind:value={details.contractSpecifics.startDate}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label for="endDate" class="block text-sm font-medium text-gray-700">Einddatum (optioneel)</label>
                        <input
                            type="date"
                            id="endDate"
                            bind:value={details.contractSpecifics.endDate}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    {#if details.contractType === 'arbeidsovereenkomst'}
                        <div>
                            <label for="salary" class="block text-sm font-medium text-gray-700">Salaris (bruto per maand)</label>
                            <input
                                type="number"
                                id="salary"
                                bind:value={details.contractSpecifics.salary}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    {:else if details.contractType === 'leveranciersovereenkomst'}
                        <div>
                            <label for="rate" class="block text-sm font-medium text-gray-700">Uurtarief (excl. BTW)</label>
                            <input
                                type="number"
                                id="rate"
                                bind:value={details.contractSpecifics.rate}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    {/if}
                    <div>
                        <label for="hoursPerWeek" class="block text-sm font-medium text-gray-700">Uren per week</label>
                        <input
                            type="number"
                            id="hoursPerWeek"
                            bind:value={details.contractSpecifics.hoursPerWeek}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label for="additionalNotes" class="block text-sm font-medium text-gray-700">Aanvullingen of aandachtspunten</label>
                        <textarea
                            id="additionalNotes"
                            bind:value={details.contractSpecifics.additionalNotes}
                            rows="4"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Voer hier eventuele aanvullingen of aandachtspunten in..."
                        ></textarea>
                    </div>
                </div>
            {/if}

            <div class="mt-8 flex justify-between">
                {#if currentStep > 1}
                    <button
                        type="button"
                        on:click={handlePrevious}
                        class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Vorige
                    </button>
                {:else}
                    <div></div>
                {/if}

                <button
                    type="button"
                    on:click={currentStep === 4 ? handleSubmit : handleNext}
                    disabled={loading}
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {#if loading}
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    {/if}
                    {currentStep === 4 ? 'Genereer Contract' : 'Volgende'}
                </button>
            </div>
        </div>
    {:else}
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Gegenereerd Contract</h2>
                <button
                    type="button"
                    on:click={handleReset}
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Nieuw Contract
                </button>
            </div>
            <div class="prose max-w-none">
                <pre class="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{generatedContract}</pre>
            </div>
            <div class="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Download PDF
                </button>
            </div>
        </div>
    {/if}
</div> 