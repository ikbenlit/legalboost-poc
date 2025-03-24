<script lang="ts">
    export let currentStep: number;
    export let totalSteps: number = 4;

    const steps = [
        'Contract Type',
        'Bedrijfsgegevens',
        'Contractant',
        'Contract Details'
    ];
</script>

<div class="w-full py-4">
    <div class="flex items-center justify-between">
        {#each steps as step, i}
            <div class="flex items-center">
                <div class={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${i + 1 === currentStep ? 'bg-blue-600 text-white' : 
                      i + 1 < currentStep ? 'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-600'}
                `}>
                    {#if i + 1 < currentStep}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    {:else}
                        {i + 1}
                    {/if}
                </div>
                <span class={`ml-2 text-sm ${i + 1 === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step}
                </span>
                {#if i < steps.length - 1}
                    <div class={`w-12 h-1 mx-4 ${i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                {/if}
            </div>
        {/each}
    </div>
</div> 