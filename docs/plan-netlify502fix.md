# Stapsgewijze Implementatie voor Netlify 502-Fix

## Fase 1: Voorbereidende Stappen ✅

### Stap 1: Lokale Ontwikkelomgeving Instellen ✅
1. Installeer Netlify CLI voor lokaal testen: ✅ GEDAAN
   ```bash
   npm install -g netlify-cli
   ```

2. Maak een `.env` bestand in de root van je project (als je die nog niet hebt): ✅ AANWEZIG
   ```
   PRIVATE_CLAUDE_API_KEY=jouw_anthropic_api_sleutel
   ```

3. Installeer de benodigde extra dependencies: ✅ GEDAAN
   ```bash
   npm install parse-multipart-data querystring
   ```

### Stap 2: Netlify Configuratie Aanmaken ✅
1. Maak een `netlify.toml` bestand aan in de root van je project: ✅ GEDAAN
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
     functions = "netlify/functions"

   [functions]
     node_bundler = "esbuild"
     external_node_modules = ["mammoth", "pdfjs-dist"]
     
   [functions."*"]
     timeout = 30  # Verhoog de timeout naar 30 seconden

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. Maak de directory structuur aan voor Netlify Functions: ✅ GEDAAN
   ```bash
   mkdir -p netlify/functions
   ```

## Fase 2: Functies Omzetten naar Serverless ✅

### Stap 3: API Types Voorbereiden ✅
1. Maak een nieuw bestand `src/lib/types/claude-api.ts`: ✅ GEDAAN
   ```typescript
   export interface ContractGenerationRequest {
       contractType: string;
       details: Record<string, any>;
   }

   export interface ContractGenerationResponse {
       content: string;
       error?: string;
   }

   export interface Risk {
       severity: 'high' | 'medium' | 'low';
       description: string;
   }

   export interface AnalysisResult {
       risks: Risk[];
       recommendations: string[];
       considerations: string[];
   }

   export interface EnhancedContractGenerationResponse extends ContractGenerationResponse {
       analysis: AnalysisResult;
   }
   ```

### Stap 4: Claude API Client Optimaliseren ✅
1. Maak een verbeterde versie van je Claude integratie in `src/lib/claude-optimized.ts`: ✅ GEDAAN
   - Verbeterde error handling
   - Uitgebreide logging
   - Geoptimaliseerde API calls
   - Betere type definities

### Stap 5: Netlify Functions Aanmaken ✅
1. Maak `netlify/functions/analyze-contract.js`: ✅ GEDAAN
   - Implementatie met multipart data handling
   - Uitgebreide error handling
   - CORS headers
   - Logging

2. Maak `netlify/functions/generate-contract.js`: ✅ GEDAAN
   - Implementatie met JSON data handling
   - Uitgebreide error handling
   - CORS headers
   - Logging

## Fase 3: Frontend Bijwerken

### Stap 6: API Endpoints Aanpassen in Frontend ✅ GEDAAN
1. Update `src/routes/analyze/+page.svelte`:
   ```javascript
   // Verander
   const response = await fetch('/api/analyze-contract', {
     method: 'POST',
     body: formData
   });

   // Naar
   const response = await fetch('/.netlify/functions/analyze-contract', {
     method: 'POST',
     body: formData
   });
   ```

2. Update `src/routes/wizard/+page.svelte`:
   ```javascript
   // Verander
   const response = await fetch('/api/generate-contract', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(details)
   });

   // Naar
   const response = await fetch('/.netlify/functions/generate-contract', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(details)
   });
   ```

## Fase 4: Testen en Debugging

### Stap 7: Lokaal Testen met Netlify CLI ✅ GEDAAN
1. Maak het debugging script aan in `scripts/debug-netlify-function.js` met de eerder gedeelde code.

2. Voer lokale tests uit:
   ```bash
   netlify dev
   ```

3. In een andere terminal, voer het debugging script uit:
   ```bash
   node scripts/debug-netlify-function.js
   ```

### Stap 8: Logboeken Verbeteren voor Troubleshooting
1. Voeg uitgebreide logging toe aan je serverless functies:
   ```javascript
   // Aan het begin van elke functie
   console.log('Function invoked with event:', JSON.stringify({
     path: event.path,
     httpMethod: event.httpMethod,
     headers: event.headers,
     queryStringParameters: event.queryStringParameters
   }));
   
   // Voordat je de API aanroept
   console.log('Calling Claude API with parameters:', /* relevante parameters */);
   
   // Na de API aanroep
   console.log('Claude API response status:', /* status informatie */);
   ```

## Fase 5: Deployment en Monitoring

### Stap 9: Omgevingsvariabelen Configureren op Netlify
1. Ga naar de Netlify dashboard en selecteer je site
2. Navigeer naar Site settings > Build & deploy > Environment variables
3. Voeg de volgende variabele toe:
   - `PRIVATE_CLAUDE_API_KEY` - Jouw Anthropic API sleutel

### Stap 10: Deployen en Monitoren
1. Commit alle wijzigingen:
   ```bash
   git add .
   git commit -m "Fix 502 errors voor Netlify deployment"
   ```

2. Push naar je repository:
   ```bash
   git push
   ```

3. Controleer de deployment in de Netlify dashboard
4. Bekijk de functie logs onder Functions > Logs
5. Test je nieuwe deployment in de browser

## Fase 6: Troubleshooting indien nodig

### Stap 11: Veelvoorkomende Problemen Oplossen
- **CORS Issues**: Voeg headers toe aan je functions voor cross-origin verzoeken
- **Memory Limits**: Optimaliseer grote verzoeken of response data
- **API Time-outs**: Verlaag de complexiteit van verzoeken naar Claude API

### Stap 12: Performance Optimalisatie
- Implementeer caching voor veelgebruikte templates
- Overwegen om de functionaliteit op te splitsen in kleinere, gerichte functies
- Minify response data waar mogelijk