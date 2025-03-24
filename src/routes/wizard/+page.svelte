<script lang="ts">
    import { wizardStore, type ContractDetails } from '$lib/stores/wizardStore';
    import ProgressIndicator from '$lib/components/wizard/ProgressIndicator.svelte';
    import ContractAnalysis from '$lib/components/ContractAnalysis.svelte';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let loading = false;
    let error = '';
    let generatedContract = '';
    let contractAnalysis: AnalysisResult | null = null;
    let showSuccess = false;

    interface AnalysisResult {
        risks: Array<{
            severity: 'high' | 'medium' | 'low';
            description: string;
        }>;
        recommendations: string[];
        considerations: string[];
    }

    $: currentStep = $wizardStore.currentStep;
    $: details = $wizardStore.details;

    onMount(() => {
        // Voeg keyboard listener toe
        document.addEventListener('keydown', handleKeydown);
        return () => {
            // Cleanup bij unmount
            document.removeEventListener('keydown', handleKeydown);
        };
    });

    function handleKeydown(event: KeyboardEvent) {
        // Check voor Ctrl+T of Cmd+T (Mac)
        if ((event.ctrlKey || event.metaKey) && event.key === 't') {
            event.preventDefault(); // Voorkom browser tab open
            handleReset(true);
        }
    }

    function handleNext() {
        if (validateCurrentStep()) {
            wizardStore.nextStep();
        }
    }

    function handlePrevious() {
        wizardStore.previousStep();
    }

    type TestData = {
        [key: string]: ContractDetails;
    };

    function handleReset(useTestData = false) {
        generatedContract = '';
        showSuccess = false;

        if (useTestData) {
            const testData: TestData = {
                arbeidsovereenkomst: {
                    contractType: 'arbeidsovereenkomst',
                    sector: 'technologie',
                    companyInfo: {
                        name: 'TechCorp B.V.',
                        kvkNumber: '12345678',
                        address: 'Innovatieweg 42, Amsterdam'
                    },
                    contractorInfo: {
                        name: 'Jan de Tester',
                        address: 'Teststraat 123, Rotterdam',
                        bsn: '123456789'
                    },
                    contractSpecifics: {
                        startDate: '2024-04-01',
                        endDate: '2025-04-01',
                        salary: 4500,
                        hoursPerWeek: 40,
                        additionalNotes: 'Inclusief laptop en telefoon'
                    }
                },
                leveranciersovereenkomst: {
                    contractType: 'leveranciersovereenkomst',
                    sector: 'zakelijke_dienstverlening',
                    companyInfo: {
                        name: 'ConsultancyPro B.V.',
                        kvkNumber: '87654321',
                        address: 'Zakenlaan 1, Utrecht'
                    },
                    contractorInfo: {
                        name: 'IT Solutions N.V.',
                        address: 'Serviceweg 55, Den Haag',
                        kvkNumber: '98765432'
                    },
                    contractSpecifics: {
                        startDate: '2024-04-01',
                        rate: 95,
                        hoursPerWeek: 24,
                        additionalNotes: 'Inclusief maandelijkse rapportage'
                    }
                },
                geheimhoudingsverklaring: {
                    contractType: 'geheimhoudingsverklaring',
                    sector: 'technologie',
                    companyInfo: {
                        name: 'InnovatieTech B.V.',
                        kvkNumber: '11223344',
                        address: 'Hightech Park 7, Eindhoven'
                    },
                    contractorInfo: {
                        name: 'Security Solutions B.V.',
                        address: 'Beveiligingsweg 10, Delft',
                        kvkNumber: '44332211'
                    },
                    contractSpecifics: {
                        startDate: '2024-04-01',
                        additionalNotes: 'Extra focus op IP bescherming'
                    }
                }
            };

            const contractTypes = ['arbeidsovereenkomst', 'leveranciersovereenkomst', 'geheimhoudingsverklaring'] as const;
            const nextType = contractTypes[(contractTypes.indexOf(details.contractType as typeof contractTypes[number]) + 1) % contractTypes.length] || contractTypes[0];
            
            wizardStore.updateDetails(testData[nextType]);
        } else {
            wizardStore.reset();
        }
    }

    function validateCurrentStep(): boolean {
        switch (currentStep) {
            case 1:
                if (!details.contractType) {
                    error = 'Selecteer een contract type';
                    return false;
                }
                if (!details.sector) {
                    error = 'Selecteer een branche/sector';
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
            contractAnalysis = data.analysis;
            showSuccess = true;
        } catch (e) {
            console.error('Contract generation error:', e);
            error = e instanceof Error ? e.message : 'Er is een fout opgetreden';
        } finally {
            loading = false;
        }
    }

    function handleDownload() {
        // Creëer een tijdelijke link element
        const element = document.createElement('a');
        
        // Converteer contract naar blob
        const file = new Blob([generatedContract], {type: 'text/markdown'});
        element.href = URL.createObjectURL(file);
        
        // Genereer bestandsnaam op basis van contract type en datum
        const date = new Date().toISOString().split('T')[0];
        const fileName = `${details.contractType}_${date}.md`;
        element.download = fileName;
        
        // Trigger download
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Header -->
<nav class="fixed w-full bg-primary shadow-sm z-50">
    <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <button 
                class="flex items-center space-x-4 hover:opacity-80 transition-opacity"
                on:click={() => goto('/')}
            >
                <img src="/images/logo-scherplegal-svg.svg" alt="Legal Boost" class="h-8 w-auto brightness-0 invert" />
                <span class="text-xl font-semibold text-text-light"></span>
            </button>
        </div>
    </div>
</nav>

<!-- Main Content with padding for fixed header -->
<div class="container mx-auto px-4 py-8 max-w-6xl pt-24">
    <h1 class="text-3xl font-bold mb-8">Contract Generator</h1>
    
    {#if loading}
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
                <div class="relative">
                    <!-- Outer ring -->
                    <div class="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <!-- Inner ring -->
                    <div class="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-indigo-50 border-t-indigo-400 animate-spin"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Contract wordt gegenereerd...</p>
                <p class="text-sm text-gray-500 mt-2">Dit kan enkele momenten duren</p>
            </div>
        </div>
    {/if}
    
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
                    <div>
                        <label for="sector" class="block text-sm font-medium text-gray-700">Branche/Sector</label>
                        <select
                            id="sector"
                            bind:value={details.sector}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Selecteer een branche</option>
                            <option value="retail">Retail & Winkeliers</option>
                            <option value="horeca">Horeca & Catering</option>
                            <option value="technologie">Technologie & IT</option>
                            <option value="zakelijke_dienstverlening">Zakelijke Dienstverlening</option>
                            <option value="bouw">Bouw & Constructie</option>
                            <option value="gezondheidszorg">Gezondheidszorg</option>
                            <option value="transport">Transport & Logistiek</option>
                            <option value="onderwijs">Onderwijs & Training</option>
                            <option value="productie">Productie & Industrie</option>
                            <option value="overig">Overige Sectoren</option>
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

            <!-- Navigation buttons -->
            <div class="mt-6 flex justify-between items-center">
                <div class="space-x-4">
                    {#if currentStep > 1}
                        <button
                            on:click={handlePrevious}
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Vorige
                        </button>
                    {/if}
                    <button
                        on:click={() => handleReset(true)}
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Laad Test Data
                    </button>
                </div>
                <div>
                    {#if currentStep < 4}
                        <button
                            on:click={handleNext}
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Volgende
                        </button>
                    {:else}
                        <button
                            on:click={handleSubmit}
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Genereren...' : 'Genereer Contract'}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Contract Preview -->
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Gegenereerd Contract</h2>
                <div class="prose max-w-none">
                    {@html generatedContract}
                </div>
            </div>

            <!-- Contract Analysis -->
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Contract Analyse</h2>
                {#if contractAnalysis}
                    <ContractAnalysis analysis={contractAnalysis} />
                {/if}
            </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
            <button
                on:click={() => handleReset(false)}
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Nieuw Contract
            </button>
            <button
                on:click={() => handleReset(true)}
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Test Data
            </button>
            <button
                on:click={handleDownload}
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Download Contract
            </button>
        </div>
    {/if}
</div> 