# Implementatieplan: Intelligente Contract Optimalisatie (MVP)
Overzicht
Dit plan beschrijft een efficiënte MVP-implementatie van de Intelligente Contract Optimalisatie voor de Legal Boost app. We focussen op maximale waarde met minimale ontwikkelingsinspanning.
Stapsgewijze User Flow
1. Contract Setup

Gebruiker opent de wizard
Gebruiker selecteert contracttype (arbeidsovereenkomst, leveranciersovereenkomst, etc.)
MVP toevoeging: Gebruiker selecteert branche/sector uit dropdown (Retail, Technologie, Horeca, etc.)
Gebruiker klikt op "Volgende"

2. Gegevensinvoer

Gebruiker vult bedrijfsgegevens in (stap 2)
Gebruiker vult contractantgegevens in (stap 3)
Gebruiker vult contractdetails in (stap 4)
Gebruiker klikt op "Genereer Contract"

3. Generatieproces

Systeem toont duidelijke loading state
Systeem stuurt verzoek naar Claude API met template, gegevens EN branche-informatie
Claude genereert contract én analyseert juridische aspecten
Systeem ontvangt respons en verwerkt deze

4. Resultaatweergave

Systeem toont twee-koloms layout:

Links: Het gegenereerde contract in markdown
Rechts: De juridische analyse met:

Geïdentificeerde risico's (hoog/middel/laag)
Korte lijst aanbevelingen
Sectorspecifieke overwegingen


Gebruiker kan contract downloaden als PDF
Gebruiker kan terug om nieuw contract te maken

### Te Wijzigen Bestanden:

1. **`src/lib/stores/wizardStore.ts`**
   - Uitbreiden van de `ContractDetails` interface met sector veld
   - Aanpassen van initialState object

2. **`src/lib/claude.ts`**
   - Toevoegen van verbeterde systeem-prompt
   - Toevoegen nieuwe functie `generateEnhancedContract`
   - Aanpassen response interface voor analyse-data

3. **`src/routes/api/generate-contract/+server.ts`**
   - Updaten om gebruik te maken van nieuwe `generateEnhancedContract` functie
   - Uitbreiden response met analyse data

4. **`src/routes/wizard/+page.svelte`**
   - Toevoegen sector dropdown op stap 1
   - Aanpassen resultaatweergave voor twee-koloms layout
   - Updaten contract generator call

### Nieuwe Bestanden:

1. **`src/lib/components/ContractAnalysis.svelte`**
   - Nieuw component voor het tonen van contract analyse
   - Toont risico's, aanbevelingen en overwegingen

## Fasering van Implementatie

### Fase 1: Back-end Basis (2 dagen)

#### Dag 1: Store en Service Update

1. **Taak 1.1: Update WizardStore (2 uur)**
   - Open `src/lib/stores/wizardStore.ts`
   - Voeg `sector` veld toe aan de `ContractDetails` interface
   - Update het initialState object met een leeg sector veld
   - Zorg dat TypeScript types correct zijn

2. **Taak 1.2: Begin Claude Service Upgrade (6 uur)**
   - Open `src/lib/claude.ts`
   - Creëer een constante `ENHANCED_SYSTEM_PROMPT` met de verbeterde prompt
   - Voeg een nieuw interface toe voor analyse resultaten:
   ```
   interface AnalysisResult {
     risks: Array<{ severity: 'high' | 'medium' | 'low', description: string }>;
     recommendations: string[];
     considerations: string[];
   }
   ```
   - Begin met de implementatie van `generateEnhancedContract` functie 
   - Let op: Behoud backwards compatibility

#### Dag 2: API Integration

3. **Taak 1.3: Voltooien Claude Service (4 uur)**
   - Voltooien `generateEnhancedContract` functie
   - Implementeer helpers voor het extraheren van analyse uit Claude's respons
   - Test de functie lokaal met voorbeeld input

4. **Taak 1.4: Update API Endpoint (4 uur)**
   - Open `src/routes/api/generate-contract/+server.ts`
   - Wijzig de handler om `generateEnhancedContract` te gebruiken
   - Breid de API response uit met analyse data
   - Test de API endpoint lokaal

### Fase 2: Front-end Essentials (2 dagen)

#### Dag 3: Basiscomponenten

5. **Taak 2.1: Sector Selector (3 uur)**
   - Open `src/routes/wizard/+page.svelte`
   - Voeg sector dropdown toe aan stap 1 van de wizard
   - Implementeer een array van beschikbare sectoren
   - Bind de sector-waarde aan het wizardStore detail object

6. **Taak 2.2: Analyse Component (5 uur)**
   - Creëer nieuw bestand `src/lib/components/ContractAnalysis.svelte`
   - Implementeer een component dat analyse-data toont:
     - Risico's met kleurindicatie
     - Aanbevelingen als bullet points
     - Sectorspecifieke overwegingen
   - Style het component volgens de bestaande designschema

#### Dag 4: Integratie

7. **Taak 2.3: Update Resultaatweergave (4 uur)**
   - Open `src/routes/wizard/+page.svelte`
   - Zoek de resultaatweergave sectie
   - Herstructureer naar een twee-koloms grid
   - Importeer en gebruik het ContractAnalysis component
   - Zorg voor correcte props binding

8. **Taak 2.4: Responsieve Styling (4 uur)**
   - Test de layout op verschillende schermformaten
   - Implementeer responsieve aanpassingen
   - Zorg voor goede leesbaarheid op mobiele apparaten
   - Verbeter loading states voor langere API calls

### Fase 3: MVP Afronding (1 dag)

#### Dag 5: Afronding

9. **Taak 3.1: End-to-end Testen (4 uur)**
   - Test de volledige flow voor verschillende contracttypen
   - Test met verschillende sectoren
   - Verifieer dat risico's correct worden getoond
   - Los eventuele bugs op

10. **Taak 3.2: Prompt Verfijning (4 uur)**
    - Analyseer de resultaten van Claude
    - Verfijn de prompt voor consistentere output
    - Update de helper functies indien nodig
    - Test met randgevallen

## Implementatie Details per Bestand

### 1. src/lib/stores/wizardStore.ts

**Wijzigingen:**
- Uitbreiden van de ContractDetails interface met sector veld:
  ```
  sector?: string;
  ```
- Aanpassen initialState met leeg sector veld:
  ```
  details: {
    //... bestaande velden
    sector: '',
  }
  ```

### 2. src/lib/claude.ts

**Wijzigingen:**
- Toevoegen van verbeterde systeem prompt voor sector-specifieke analyse
- Toevoegen nieuwe interfaces voor analyse resultaten
- Implementeren van nieuwe `generateEnhancedContract` functie die:
  - De template ophaalt
  - Sector informatie meestuurt naar Claude
  - Analyse extraheert uit Claude's respons
  - Contract en analyse gescheiden retourneert
- Behoud van originele functie voor backward compatibility

### 3. src/routes/api/generate-contract/+server.ts

**Wijzigingen:**
- Update van de POST handler om generateEnhancedContract aan te roepen
- Uitbreiden van de API respons met analyse data
- Aanpassen error handling

### 4. src/routes/wizard/+page.svelte

**Wijzigingen:**
- Toevoegen van sector dropdown op stap 1:
  ```
  <div>
    <label for="sector">Branche/Sector</label>
    <select id="sector" bind:value={details.sector}>
      <option value="">Selecteer een branche</option>
      <option value="retail">Retail & Winkeliers</option>
      <!-- Meer opties -->
    </select>
  </div>
  ```
- Uitbreiden van de handleSubmit functie om analyse data te verwerken
- Herstructureren van resultaatweergave naar twee-koloms layout
- Importeren en gebruiken van ContractAnalysis component

### 5. src/lib/components/ContractAnalysis.svelte (NIEUW)

**Nieuwe component:** 
- Accepteert analyse data als props
- Toont risico's met kleurindicatie (rood voor hoog, oranje voor middel, blauw voor laag)
- Toont aanbevelingen als bullet points
- Toont sectorspecifieke overwegingen
- Styling volgens bestaande designschema

## Afhankelijkheden en Overwegingen

- De implementatie bouwt voort op de bestaande codebase met minimale disruptie
- Maakt gebruik van bestaande Svelte/SvelteKit structuur en Tailwind styling
- Wijzigt geen bestaande functionaliteit, voegt alleen nieuwe functies toe
- Claude API blijft hetzelfde, alleen de prompt en response verwerking verandert

Dit plan geeft de programmeur een duidelijk pad voor implementatie, met specifieke bestanden, wijzigingen en een logische fasering.