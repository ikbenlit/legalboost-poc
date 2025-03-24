<!-- ProcessingIndicator.svelte -->
<script lang="ts">
  import type { ProcessingStatus, ProcessingStep } from '$lib/types/processing';
  import { processingMessages } from '$lib/types/processing';

  export let status: ProcessingStatus;

  const steps: ProcessingStep[] = ['loading', 'parsing', 'analyzing', 'generating'];
  
  $: currentStepIndex = steps.indexOf(status.step);
  $: message = status.message || (status.fileType && processingMessages[status.step][status.fileType]);
  
  // Bereken geschatte tijd in leesbaar formaat
  $: estimatedTime = status.estimatedTimeSeconds 
    ? status.estimatedTimeSeconds > 60 
      ? `${Math.ceil(status.estimatedTimeSeconds / 60)} minuten`
      : `${status.estimatedTimeSeconds} seconden`
    : null;

  // Bereken voortgang voor de huidige stap
  $: stepProgress = status.currentPage && status.totalPages
    ? Math.round((status.currentPage / status.totalPages) * 100)
    : null;
</script>

<div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center max-w-lg w-full">
  <!-- Stappen indicator -->
  <div class="w-full flex justify-between mb-8 relative">
    {#each steps as step, i}
      <div class="flex flex-col items-center relative z-10">
        <!-- Stap cirkel -->
        <div class="w-10 h-10 rounded-full flex items-center justify-center
          {i < currentStepIndex ? 'bg-green-500' : 
           i === currentStepIndex ? 'bg-indigo-600 animate-pulse' : 
           'bg-gray-200'} 
          text-white font-semibold">
          {#if i < currentStepIndex}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          {:else}
            {i + 1}
          {/if}
        </div>
        <!-- Stap label -->
        <span class="text-sm mt-2 text-gray-600">
          {#if step === 'loading'}
            Laden
          {:else if step === 'parsing'}
            Verwerken
          {:else if step === 'analyzing'}
            Analyseren
          {:else if step === 'generating'}
            Genereren
          {/if}
        </span>
      </div>

      <!-- Verbindingslijn tussen stappen -->
      {#if i < steps.length - 1}
        <div class="flex-1 h-0.5 bg-gray-200 relative top-5">
          <div class="h-full bg-green-500 transition-all duration-500"
            style="width: {i < currentStepIndex ? '100%' : i === currentStepIndex && stepProgress ? `${stepProgress}%` : '0%'}">
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Voortgangsindicator voor huidige stap -->
  {#if stepProgress !== null}
    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
        style="width: {stepProgress}%">
      </div>
    </div>
  {/if}

  <!-- Status bericht -->
  <div class="text-center">
    <p class="text-gray-600 font-medium text-lg mb-2">{message}</p>
    
    {#if status.currentPage && status.totalPages}
      <p class="text-sm text-gray-500">
        Pagina {status.currentPage} van {status.totalPages}
      </p>
    {/if}
    
    {#if estimatedTime}
      <p class="text-sm text-gray-500 mt-1">
        Geschatte tijd: {estimatedTime}
      </p>
    {/if}
  </div>

  <!-- Animatie ringen -->
  <div class="relative mt-6">
    <!-- Outer ring -->
    <div class="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
    <!-- Inner ring -->
    <div class="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-indigo-50 border-t-indigo-400 animate-spin"></div>
  </div>
</div> 