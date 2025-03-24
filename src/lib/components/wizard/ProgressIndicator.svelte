<script lang="ts">
    export let currentStep: number;

    const steps = [
        { number: 1, title: 'Contract Type' },
        { number: 2, title: 'Bedrijfsgegevens' },
        { number: 3, title: 'Contractant' },
        { number: 4, title: 'Details' }
    ];
</script>

<div class="mb-8">
    <div class="flex items-center justify-between">
        {#each steps as step}
            <div class="flex items-center">
                <div class={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${currentStep >= step.number ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-500'}`}>
                    {step.number}
                </div>
                <div class="hidden sm:block ml-2">
                    <p class={`text-sm font-medium ${currentStep >= step.number ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {step.title}
                    </p>
                </div>
                {#if step.number < steps.length}
                    <div class={`flex-1 w-16 sm:w-32 h-0.5 mx-2 ${currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                {/if}
            </div>
        {/each}
    </div>
</div> 