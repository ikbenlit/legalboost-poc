<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-white">
  <!-- Navigation -->
  <nav class="fixed w-full bg-primary shadow-sm z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="/images/logo-scherplegal-svg.svg" alt="Legal Boost" class="h-8 w-auto" />

        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-text-light hover:text-hover transition-colors">Features</a>
          <a href="#how-it-works" class="text-text-light hover:text-hover transition-colors">Hoe het werkt</a>
          <a href="/faq" class="text-text-light hover:text-hover transition-colors">FAQ</a>
          <button 
            class="bg-accent text-text-light px-6 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full sm:w-auto"
            on:click={() => goto('/wizard')}
          >
            Start nu
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 bg-primary">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-bold text-text mb-6">
          Juridische documenten op maat,<br/> 
          <span class="text-hover">binnen enkele minuten</span>
        </h1>
        <p class="text-xl text-text mb-8">
          Genereer professionele juridische documenten met AI-ondersteuning. 
          Snel, betrouwbaar en op maat gemaakt voor jouw situatie.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            class="bg-accent text-text-light px-8 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full sm:w-auto"
            on:click={() => goto('/wizard')}
          >
            Start Template Wizard
          </button>
          <a 
            href="/faq" 
            class="text-text-light hover:text-hover transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Meer informatie
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Waarom Legal Boost?</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-primary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-hover/20 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-text-light">Razendsnel</h3>
          <p class="text-text-light/90">Genereer juridische documenten binnen enkele minuten, niet dagen of weken.</p>
        </div>
        <div class="bg-primary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-hover/20 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-text-light">Betrouwbaar</h3>
          <p class="text-text-light/90">Door juridische experts gevalideerde templates en AI-ondersteuning.</p>
        </div>
        <div class="bg-primary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-hover/20 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-text-light">Op maat</h3>
          <p class="text-text-light/90">Elk document wordt specifiek aangepast aan jouw situatie en wensen.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- How it Works Section -->
  <section id="how-it-works" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Onze Tools</h2>
      
      <!-- Tool Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <!-- Contract Generator Card -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 class="text-xl font-semibold mb-4">Contract Generator</h3>
          <p class="text-gray-600 mb-6">
            Genereer professionele contracten op maat met onze intelligente wizard.
            Kies uit verschillende contracttypes en laat AI je helpen bij het opstellen.
          </p>
          <button
            on:click={() => goto('/wizard')}
            class="bg-accent text-text-light px-6 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full"
          >
            Start Contract Generator
          </button>
        </div>
        
        <!-- Contract Analysis Card -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 class="text-xl font-semibold mb-4">Contract Analyse</h3>
          <p class="text-gray-600 mb-6">
            Upload een bestaand contract voor een gedetailleerde analyse.
            Ontvang inzicht in risico's, aanbevelingen en juridische overwegingen.
          </p>
          <button
            on:click={() => goto('/analyze')}
            class="bg-accent text-text-light px-6 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full"
          >
            Start Contract Analyse
          </button>
        </div>
      </div>

      <!-- Steps -->
      <div class="max-w-4xl mx-auto">
        <div class="grid gap-8">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Kies je tool</h3>
              <p class="text-gray-600">Selecteer de Contract Generator voor nieuwe contracten of de Contract Analyse voor bestaande documenten.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Vul de details in of upload je contract</h3>
              <p class="text-gray-600">Beantwoord enkele vragen voor een nieuw contract of upload een bestaand contract voor analyse.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Ontvang je resultaat</h3>
              <p class="text-gray-600">Krijg direct je gegenereerde contract of een gedetailleerde analyse van je bestaande contract.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Klaar om te beginnen?</h2>
        <p class="text-xl text-gray-600 mb-8">
          Genereer nu je eerste juridische document of analyseer een bestaand contract met Legal Boost.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            class="bg-accent text-text-light px-8 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full sm:w-auto"
            on:click={() => goto('/wizard')}
          >
            Start nu
          </button>
          <a 
            href="/faq" 
            class="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Bekijk FAQ
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-4 mb-4">
            <img src="/images/logo-scherplegal-svg.svg" alt="Legal Boost" class="h-8 w-auto" />

          </div>
          <p class="text-gray-600">Juridische zekerheid voor ondernemers, eenvoudig en effectief.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Product</h4>
          <ul class="space-y-2">
            <li><a href="#features" class="text-gray-600 hover:text-primary transition-colors">Features</a></li>
            <li><a href="#how-it-works" class="text-gray-600 hover:text-primary transition-colors">Hoe het werkt</a></li>
            <li><a href="/faq" class="text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Contact</h4>
          <ul class="space-y-2">
            <li><a href="mailto:info@legalboost.nl" class="text-gray-600 hover:text-primary transition-colors">info@legalboost.nl</a></li>
            <li><span class="text-gray-600">+31 (0)20 123 4567</span></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Volg ons</h4>
          <div class="flex space-x-4">
            <a 
              href="https://www.linkedin.com/company/legalboost" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Volg ons op LinkedIn"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="https://twitter.com/legalboost" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Volg ons op Twitter"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
        <p>&copy; 2024 Legal Boost. Alle rechten voorbehouden.</p>
      </div>
    </div>
  </footer>
</div>
