# Document 3: Technische en Functionele Specificaties – Legal Boost App met Template Wizard

## Doel

Dit document beschrijft hoe we de Legal Boost-app bouwen: een aanvulling op Marianne's dienstverlening die mkb'ers helpt contracten te maken en beheren, haar werkdruk verlaagt, en haar online programma schaalbaar maakt. Het is de blauwdruk voor mij (Colin) en mijn AI-tools (Cursor, Claude, Grok) om de MVP in 4-6 weken live te krijgen.

## Scope

**Fase 1 (MVP):** Template wizard, FAQ-sectie, programma-link.
**Fase 2 (optioneel):** Risico-highlights.
**Doelen:** Eenvoud voor klanten, werkdruk verlagen, schaalbare ondersteuning.

## Technische Specificaties

Dit is de technische fundering – wat ik gebruik om te bouwen, deployen en onderhouden.

### Architectuur

* **Framework:** Svelte met SvelteKit.
    * **Waarom:** Full-stack (frontend + API), snel deploybaar, reactief UI-systeem.
* **Hosting:** Netlify.
    * **Waarom:** Naadloze SvelteKit-integratie, gratis tier (100GB bandbreedte), schaalbaar.
* **Database:** Supabase (PostgreSQL).
    * **Waarom:** Gratis tier (500MB, 100+ gebruikers), simpel, real-time opties.

### Frontend

* **Tech:** SvelteKit met Svelte-componenten.
* **UI:** Tailwind CSS + DaisyUI.
    * **Componenten:** `.btn`, `.form-control`, `.input`, `.select`, `.collapse`, `.card`.
    * **Waarom:** Kant-en-klare UI, aanpasbaar, versnelt dev.
* **Styling:** Tailwind CSS.
    * **Kleuren:** `bg-white`, `bg-blue-100`, `bg-blue-600`, `text-gray-800` (Calendly-inspired).
    * **Spacing:** `p-4`, `m-4`, `rounded-md`.
* **Features:**
    * **Wizard:** Multi-step form (state-managed).
    * **FAQ:** Statische lijst met accordion.
    * **Links:** Sticky banner + contextuele knoppen.
    * **Dashboard:** Contractlijst (later).

### Backend

* **Tech:** SvelteKit API-routes.
* **AI:** Claude (Anthropic API) voor template-generatie.
    * **Waarom:** Sterk in tekst, juridische nuance, kosteneffectief.
* **Endpoints:**
    * `/api/generate-contract`: Neemt wizard-input, vraagt Claude om tekst, retourneert PDF/tekst.
    * `/api/save-contract`: Slaat contract op in Supabase.

### Database

* **Tabel:** `users`: `id`, `email`, `name` (auth).
* **Tabel:** `contracts`: `id`, `user_id`, `type`, `content` (tekst/PDF-URL), `created_at`.
* **Tabel:** `templates`: Statisch in code of `id`, `type`, `base_text` (optioneel).

### Beveiliging

* **Auth:** Supabase Auth (e-mail/password).
    * **Waarom:** Simpel, veilig, gratis.
* **Data:** HTTPS via Netlify, gevoelige velden encrypted in Supabase.
* **Toegang:** Alleen geregistreerde Legal Boost-klanten.

### Dev-tools

* **Coding:** Cursor (AI-assisted code).
* **Prototyping:** Claude/Grok voor tekstlogica en risico-regels.
* **Testing:** Local (Vite dev server) + staging op Netlify.

### Schaalbaarheid

* **Serverless:** Netlify schaalt automatisch.
* **Database:** Supabase groeit mee (€25/maand bij >500MB).
* **AI:** Claude API schaalt onbeperkt (€0.01-€0.05/request).

### Kosten (MVP)

* **Netlify:** €0 (tot 100GB).
* **Supabase:** €0 (tot 500MB).
* **Claude API:** €50-€100 (1000 contracten).
* **Totaal:** €50-€100 initieel.

## Functionele Specificaties

Dit beschrijft wat de app doet – technisch vertaald vanuit Marianne's en klantperspectief.

### 1. Template Wizard

* **Doel:** Klanten maken contracten in 5-10 minuten; Marianne's templates geautomatiseerd.
* **Flow:**
    1.  **Login:** Via Supabase Auth (e-mail/password).
    2.  **Keuze:** 3 contracttypes in `.select`:
        * Arbeidscontract.
        * Freelance-deal.
        * Leveranciersovereenkomst.
    3.  **Formulier:** 3-5 velden in `.form-control`:
        * Tekst: "Naam partij" (`.input`).
        * Dropdown: "Looptijd" (`.select`: 6m, 1y, onbepaald).
        * Tekst: "Betaling" (`.input`: bijv. €500).
    4.  **Output:** `.btn` triggert `/api/generate-contract`:
        * Claude vult template met input.
        * Retourneert PDF/tekst (via jsPDF of Markdown).
* **Specificaties:**
    * Max 5 klikken van start tot finish.
    * Output in Marianne's toon: "Dit contract is klaar – juridische rust gegarandeerd."
    * Opslag in Supabase (`contracts`-tabel).
* **UI:**

    ```svelte
    <div class="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
      <button class="btn btn-primary bg-blue-600 text-white hover:bg-blue-700">Genereer</button>
    </div>
    ```

### 2. FAQ-sectie

* **Doel:** Basisvragen afvangen zonder Marianne's input.
* **Flow:**
    * Statische pagina met `.collapse`:
        * 10 vragen (bijv. "Wat moet in een arbeidscontract?").
        * Antwoorden max 100 woorden.
    * `.input` als zoekbalk (filter client-side).
* **Specificaties:**
    * Data hardcoded in `routes/faq/+page.svelte` of Supabase (optioneel).
    * `.collapse-title class="text-blue-600"` voor vragen.
* **UI:**

    ```svelte
    <div class="bg-blue-50 p-6 rounded-lg">
      <!-- ... Collapse items ... -->
    </div>
    ```

### 3. Programma-link

* **Doel:** Upsells naar Marianne's programma pushen.
* **Flow:**
    * **Banner:** `<div class="fixed bottom-0 bg-blue-100 p-4">`
        * `.btn`: "Join Legal Boost – €499" (link naar haar cursus).
    * **Knoppen:** Na wizard/FAQ:
        * `.btn class="mt-4 bg-blue-600 text-white"`: "Check voor €100"
* **Specificaties:**
    * Links hardcoded (Marianne levert URL).
    * Altijd visible (sticky banner).

### 4. Fase 2: Risico-highlights

* **Doel:** Risico's markeren in bestaande contracten.
* **Flow:**
    * Upload via `.input type="file"`.
    * `/api/analyze-risk`:
        * Claude scant op 5 risico's (bijv. "Geen einddatum").
        * Retourneert lijst met rood/oranje/groen.
    * Output in `.card`:
        * "Rood: Geen betalingstermijn – risico op vertraging."
    * Upsell: `.btn` naar Marianne's check.
* **Specificaties:**
    * Simpele regex/keyword-check als start (Claude finetuned later).
    * Max 3 zinnen per risico.

## Gebruikerservaring

* **Start:** `/dashboard` met "Start Wizard" | "FAQ" | "Mijn Contracten."
* **Wizard:** `.form-control` met 3 stappen (keuze, input, download).
* **FAQ:** `.collapse` met zoekfunctie.
* **Design:** Wit, lichtblauw (`bg-blue-100`), groen (`bg-green-500`), afgerond (`rounded-md`).

## Implementatie-aanpak

### Fase 1 (4-6 weken)

* **Week 1:** Setup (SvelteKit, DaisyUI, Supabase, Netlify), wizard-flow schetsen.
* **Week 2:** Wizard UI (`.form-control`, `.input`), Claude API-test.
* **Week 3:** Backend (`/api/generate-contract`), Supabase-opslag.
* **Week 4:** FAQ (`.collapse`), programma-links (`.btn`).
* **Week 5:** Testen (local + Netlify staging), Marianne's feedback.
* **Week 6:** Deploy (`legalboost.netlify.app`), bugfixes.

### Fase 2 (2-3 weken, later)

* Upload + `/api/analyze-risk`, risico-UI (`.card`).

## Tools

* **Cursor:** Code schrijven (UI, API-routes).
* **Claude:** Template-logica, risico-regels.
* **Grok:** Debugging, optimalisatie-suggesties.

## Wat dit oplevert

* **Marianne:** Automatisering van templates, schaalbare upsells.
* **Klanten:** Simpele contracten, directe waarde.
* **Jou:** MVP in 60-70 uur, live op Netlify.

## Volgende stappen

* Marianne's input: 3 contracttypes, 10 FAQ's.
* Start: SvelteKit setup (`npm create svelte@latest`), DaisyUI installeren.

## Reflectie

Dit is jouw technische playbook, Colin – alles wat je nodig hebt om te bouwen met SvelteKit, DaisyUI, Supabase en Claude. Het sluit aan op Document 1 (kosten, scope) en Document 2 (functioneel ontwerp). Technisch haalbaar in 4-6 weken met jouw skills en AI-tools. Wat denk je – klaar om Marianne's contracttypes te vragen en te starten? Of nog iets finetunen?