# Volledige Opzet Legal Boost App met Template Wizard

Dit document beschrijft de complete setup voor de Legal Boost-app: een SvelteKit-project met Template Wizard, FAQ-sectie en integraties met Supabase en Claude API. Het is bedoeld als herbruikbare handleiding voor de MVP (fase 1) zoals beschreven in Document 1 en 3. Datum: 21 maart 2025.

---

## Stap 1: Projectstructuur opzetten

Een gestructureerde basis voorkomt chaos en ondersteunt schaalbaarheid.

### Commando
```bash
npm create svelte@latest poc-legalboost
cd legalboost
```

### Keuzes bij setup
- TypeScript: Ja (voor typeveiligheid bij API-calls en forms).
- ESLint: Ja (houdt code schoon en consistent).
- Tailwind CSS: Ja (basis voor DaisyUI-styling).
- App Router: Ja (SvelteKit standaard, flexibel voor routes).
- Vite: Standaard bundler in SvelteKit.

### Resultaatstructuur
```
legalboost/
├── src/
│   ├── routes/           # Routing en pagina's
│   │   ├── +page.svelte  # Homepage (later dashboard)
│   │   ├── faq/          # FAQ-pagina
│   │   └── wizard/       # Wizard-pagina
│   ├── lib/             # Reusable UI-componenten
│   ├── server/          # Helpers (Supabase, Claude API)
│   └── app.css         # Global CSS
├── static/             # Statische assets (bijv. logo's)
└── package.json
```

**Waarom?**
- routes/ gebruikt SvelteKit's file-based routing voor simpele, schaalbare routes.
- lib/ centraliseert reusable componenten.
- server/ scheidt logica van UI.

## Stap 2: Dependencies installeren
Installeer de tools voor de MVP: UI, database, en template-generatie.

### Basis-dependencies
```bash
npm install @supabase/supabase-js @anthropic-ai/sdk jspdf
npm install -D tailwindcss postcss autoprefixer daisyui @types/jsPDF
```
- @supabase/supabase-js: Auth en database (gebruikers, contracten).
- @anthropic-ai/sdk: Claude API voor juridische templates.
- daisyui: UI-componenten (bovenop Tailwind CSS).
- jsPDF: PDF-output voor contracten (client-side).

### Tailwind CSS en DaisyUI toevoegen
DaisyUI biedt kant-en-klare componenten.

```bash
npx svelte-add@latest tailwindcss
```

**Configuratie**
- tailwind.config.js aanvullen:
```js
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#DBEAFE",
          600: "#2563EB",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  }
};
```

Resultaat: DaisyUI-componenten beschikbaar zoals `.btn`, `.form-control`, `.input`, `.select`, `.collapse`, `.card`.

## Stap 3: Configuratie
Configureer SvelteKit, Supabase, en Claude voor een werkende basis.

### SvelteKit
Pas svelte.config.js aan voor Netlify:

```js
import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
```

### Supabase
1. Maak een project aan op supabase.com.
2. Haal URL en anon key op uit je dashboard.
3. Zet in .env:
```
PUBLIC_SUPABASE_URL=your-url
PUBLIC_SUPABASE_ANON_KEY=your-key
```

4. Maak src/lib/supabase.js:
```javascript
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);
```

**Waarom?** Simpele auth en opslag voor gebruikers en contracten.

### Claude API
1. Haal je API-key op via Anthropic.
2. Voeg toe aan .env:
```
ANTHROPIC_API_KEY=your-key
```
3. Test later via een API-route (zie Stap 4).
4. Tip: Stel een kostenlimiet in (€50-€100) voor 1000 contracten.

## Stap 4: Testen en valideren
Zorg dat de basis werkt voordat je verder bouwt.

### Commando
```bash
npm run dev
```
- Open http://localhost:5173 (Vite's standaard poort).
- Controleer of de homepage laadt met Tailwind-styling.
- Test een simpel DaisyUI component uit.

### Voorbeeld homepage (src/routes/+page.svelte)
```svelte
<script>
  // Je script code hier
</script>

<div class="p-4">
  <h1 class="text-2xl">Legal Boost</h1>
  <button class="btn btn-primary bg-blue-600 text-white">Start Wizard</button>
</div>
```

## Extra tips en aandachtspunten
- **Sterke punten**: SvelteKit en DaisyUI versnellen ontwikkeling. Supabase en Claude zijn schaalbaar en kosteneffectief.
- **Blinde vlekken**:
  - Test Supabase Auth vroeg – login-flows kunnen bugs hebben.
  - Claude API-kosten kunnen oplopen; monitor gebruik.
- **Concrete tip**: Bouw na setup de /wizard-route met een `.form-control` en `.select` om de flow te testen.
- **Volgende stappen**:
  - Wizard UI opzetten (src/routes/wizard/+page.svelte).
  - Supabase Auth configureren voor login.
  - API-route maken (/api/generate-contract) met Claude.