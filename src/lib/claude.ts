import { PRIVATE_CLAUDE_API_KEY } from '$env/static/private';

interface ContractGenerationRequest {
    contractType: string;
    details: Record<string, any>;
}

interface ContractGenerationResponse {
    content: string;
    error?: string;
}

interface Risk {
    severity: 'high' | 'medium' | 'low';
    description: string;
}

interface AnalysisResult {
    risks: Risk[];
    recommendations: string[];
    considerations: string[];
}

interface EnhancedContractGenerationResponse extends ContractGenerationResponse {
    analysis: AnalysisResult;
}

class ClaudeApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ClaudeApiError';
    }
}

const TEMPLATES: Record<string, string> = {
    'arbeidsovereenkomst': `# Arbeidsovereenkomst

**Tussen:**  
Werkgever: **{{naam_werkgever}}**, gevestigd te **{{adres_werkgever}}**  
en  
Werknemer: **{{naam_werknemer}}**, wonende te **{{adres_werknemer}}**  

### Artikel 1: Duur overeenkomst
Deze overeenkomst wordt aangegaan voor een periode van **{{looptijd}}**, ingaande op **{{startdatum}}**, eindigend op **{{einddatum}}**.

### Artikel 2: Functieomschrijving
Werknemer treedt in dienst als **{{functie}}**. De werkzaamheden omvatten onder andere:
- {{taak_1}}
- {{taak_2}}
- {{taak_3}}

### Artikel 3: Salaris en betaling
Het salaris bedraagt **€{{salaris}} bruto per maand**, betaalbaar op de laatste werkdag van elke maand.

### Artikel 4: Arbeidsuren
De werkweek bedraagt **{{uren_per_week}} uur**, verdeeld over **{{werkdagen}}**.

### Artikel 5: Vakantiedagen
Werknemer heeft recht op **{{vakantiedagen}} vakantiedagen** per jaar.

### Artikel 6: Overige bepalingen
{{extra_bepalingen}}

**Ondertekening:**  
Datum: {{datum_ondertekening}}  

Werkgever: ___________________  
Werknemer: ___________________`,

    'geheimhoudingsverklaring': `# Geheimhoudingsverklaring (Non-Disclosure Agreement)

Deze geheimhoudingsverklaring wordt overeengekomen tussen:

**Partij 1**: {{naam_partij_1}}, gevestigd te {{adres_partij_1}}
**Partij 2**: {{naam_partij_2}}, gevestigd te {{adres_partij_2}}

### Artikel 1: Doel van de overeenkomst
Het doel van deze overeenkomst is het beschermen van vertrouwelijke informatie die partijen in het kader van samenwerking zullen delen.

### Artikel 2: Definities
Onder vertrouwelijke informatie wordt verstaan:
- Zakelijke strategieën, plannen en gegevens.
- Financiële en technische gegevens.
- Klant- en leveranciersgegevens.
- Alle overige informatie die expliciet als vertrouwelijk wordt aangemerkt.

### Artikel 3: Geheimhouding
Partijen verplichten zich om vertrouwelijke informatie:
- Strikt geheim te houden.
- Niet te gebruiken voor andere doeleinden dan samenwerking.
- Niet te delen met derden zonder voorafgaande schriftelijke toestemming van de andere partij.

### Artikel 4: Uitzonderingen
Geheimhouding geldt niet voor informatie die:
- Publiekelijk bekend is geworden buiten schuld van partijen.
- Wettelijk verplicht openbaar gemaakt dient te worden (mits vooraf aangekondigd).

### Artikel 5: Duur van de geheimhouding
De geheimhoudingsplicht blijft van kracht gedurende een periode van **{{duur_geheimhouding}} jaar** na beëindiging van de samenwerking.

### Artikel 6: Sancties
Bij overtreding van geheimhouding is de overtredende partij direct een boete verschuldigd van **€{{boete}}** per overtreding, onverminderd het recht op aanvullende schadevergoeding.

### Artikel 7: Toepasselijk recht
Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbank te **{{bevoegde_rechtbank}}**.

### Artikel 8: Overige bepalingen
{{extra_bepalingen}}

**Ondertekening:**  
Datum: {{datum_ondertekening}}  

Partij 1: ___________________  
Partij 2: ___________________`,

    'leveranciersovereenkomst': `# Leveranciersovereenkomst

**Leverancier:** {{naam_leverancier}}, gevestigd te {{adres_leverancier}}
**Afnemer:** {{naam_afnemer}}, gevestigd te {{adres_afnemer}}

### Artikel 1: Producten en diensten
Leverancier levert aan afnemer de volgende producten/diensten:
- {{producten_diensten}}

### Artikel 2: Looptijd en beëindiging
Deze overeenkomst gaat in per **{{startdatum}}** en wordt aangegaan voor een periode van **{{looptijd}}**. Opzegging dient te gebeuren met een termijn van **{{opzegtermijn}}**.

### Artikel 3: Prijzen en betaling
De vergoeding voor producten/diensten bedraagt **€{{prijs}} (exclusief btw)**. Facturering vindt plaats op **{{factuurfrequentie}}** basis, betaling binnen **{{betalingstermijn}} dagen**.

### Artikel 4: Leveringsvoorwaarden
Levering vindt plaats op het adres van de afnemer, tenzij anders afgesproken.

### Artikel 5: Garantie en aansprakelijkheid
Leverancier garandeert dat producten/diensten voldoen aan de afgesproken specificaties en kwaliteitseisen.

### Artikel 6: Geschillen
Eventuele geschillen worden voorgelegd aan de bevoegde rechtbank te **{{bevoegde_rechtbank}}**.

### Artikel 7: Overige bepalingen
{{extra_bepalingen}}

**Ondertekening:**  
Datum: {{datum_ondertekening}}  

Leverancier: ___________________  
Afnemer: ___________________`
};

function getTemplateContent(contractType: string): string {
    const template = TEMPLATES[contractType];
    if (!template) {
        throw new ClaudeApiError(`Template niet gevonden voor type: ${contractType}`);
    }
    return template;
}

const SYSTEM_PROMPT = `Je bent een juridische AI-assistent die professionele contracten genereert. 
Gebruik het aangeleverde template en vul alle {{placeholders}} in met de gegeven details.
Houd de tekst helder en praktisch, vermijd onnodig jargon.
Controleer of alle placeholders correct zijn ingevuld en of bedragen en data duidelijk zijn weergegeven.
Lever het contract in Markdown-formaat aan.`;

const ENHANCED_SYSTEM_PROMPT = `Je bent een ervaren juridische AI-assistent gespecialiseerd in het genereren en analyseren van Nederlandse contracten.

TAAK 1 - CONTRACT GENERATIE:
1. Gebruik het aangeleverde template als basis
2. Vul alle {{placeholders}} in met de gegeven details
3. Zorg dat de tekst helder en praktisch is, vermijd juridisch jargon
4. Controleer of alle data en bedragen correct zijn weergegeven
5. Lever het contract op in Markdown-formaat

TAAK 2 - SECTOR-SPECIFIEKE ANALYSE:
Analyseer het contract in de context van de opgegeven sector. Identificeer:

1. RISICO'S (maximaal 5):
   - Hoog: Direct bedrijfskritische risico's die onmiddellijke aandacht vereisen
   - Middel: Belangrijke aandachtspunten die op termijn aangepakt moeten worden
   - Laag: Potentiële verbeterpunten voor optimalisatie

2. AANBEVELINGEN (3-5 punten):
   - Concrete, actionable verbetervoorstellen
   - Focus op sector-specifieke best practices
   - Praktisch implementeerbare suggesties

3. SECTOR-SPECIFIEKE OVERWEGINGEN (2-4 punten):
   - Relevante wet- en regelgeving voor de sector
   - Gebruikelijke praktijken in de branche
   - Specifieke marktomstandigheden

FORMAT VOOR ANALYSE OUTPUT:
Geef de analyse als JSON in het volgende formaat:
{
    "risks": [
        {
            "severity": "high|medium|low",
            "description": "Concrete beschrijving van het risico"
        }
    ],
    "recommendations": [
        "Concrete, actionable aanbeveling"
    ],
    "considerations": [
        "Relevante sector-specifieke overweging"
    ]
}

Zorg dat alle output in het Nederlands is.`;

const ANALYSIS_SYSTEM_PROMPT = `Je bent een juridische AI-assistent gespecialiseerd in het analyseren van Nederlandse contracten.

TAAK - CONTRACT ANALYSE:
Analyseer het gegeven contract en identificeer:

1. RISICO'S (maximaal 5):
   - Hoog: Direct bedrijfskritische risico's die onmiddellijke aandacht vereisen
   - Middel: Belangrijke aandachtspunten die op termijn aangepakt moeten worden
   - Laag: Potentiële verbeterpunten voor optimalisatie

2. AANBEVELINGEN (3-5 punten):
   - Concrete, actionable verbetervoorstellen
   - Focus op best practices
   - Praktisch implementeerbare suggesties

3. JURIDISCHE OVERWEGINGEN (2-4 punten):
   - Relevante wet- en regelgeving
   - Gebruikelijke praktijken
   - Specifieke aandachtspunten

Geef de analyse als JSON in het volgende formaat:
{
    "risks": [
        {
            "severity": "high|medium|low",
            "description": "Concrete beschrijving van het risico"
        }
    ],
    "recommendations": [
        "Concrete, actionable aanbeveling"
    ],
    "considerations": [
        "Relevante juridische overweging"
    ]
}`;

export async function generateContract(request: ContractGenerationRequest): Promise<ContractGenerationResponse> {
    try {
        const template = getTemplateContent(request.contractType);
        console.log('Template loaded:', template.substring(0, 100) + '...');
        console.log('Request details:', request);
        
        const response = await fetch(`https://api.anthropic.com/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': PRIVATE_CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4096,
                system: SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Template:
${template}

Details:
${JSON.stringify(request.details, null, 2)}

Aanvullingen en aandachtspunten:
${request.details.contractSpecifics.additionalNotes || 'Geen aanvullingen'}

Genereer een professioneel contract op basis van bovenstaande template en details.`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API Error:', errorText);
            throw new ClaudeApiError(`API request failed: ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Claude API Response:', data);
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new ClaudeApiError('Unexpected API response format');
        }

        return {
            content: data.content[0].text
        };
    } catch (error) {
        console.error('Contract generation error:', error);
        if (error instanceof ClaudeApiError) {
            throw error;
        }
        throw new ClaudeApiError(`Failed to generate contract: ${(error as Error).message}`);
    }
}

export async function generateEnhancedContract(request: ContractGenerationRequest): Promise<EnhancedContractGenerationResponse> {
    try {
        const template = getTemplateContent(request.contractType);
        console.log('Template loaded:', template.substring(0, 100) + '...');
        console.log('Request details:', request);
        
        const response = await fetch(`https://api.anthropic.com/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': PRIVATE_CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4096,
                system: ENHANCED_SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Template:
${template}

Details:
${JSON.stringify(request.details, null, 2)}

Sector: ${request.details.sector}

Aanvullingen en aandachtspunten:
${request.details.contractSpecifics.additionalNotes || 'Geen aanvullingen'}

Genereer een professioneel contract op basis van bovenstaande template en details.
Geef ook een analyse van het contract specifiek voor de sector ${request.details.sector}.
Format de analyse als JSON in het volgende formaat:
{
    "risks": [
        {
            "severity": "high|medium|low",
            "description": "Concrete beschrijving van het risico"
        }
    ],
    "recommendations": [
        "Concrete, actionable aanbeveling"
    ],
    "considerations": [
        "Relevante sector-specifieke overweging"
    ]
}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API Error:', errorText);
            throw new ClaudeApiError(`API request failed: ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Claude API Response:', data);
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new ClaudeApiError('Unexpected API response format');
        }

        const responseText = data.content[0].text;
        const [contract, analysisJson] = responseText.split('```json');

        if (!analysisJson) {
            throw new ClaudeApiError('No analysis data found in response');
        }

        const analysis = JSON.parse(analysisJson.replace('```', '').trim());

        return {
            content: contract.trim(),
            analysis
        };
    } catch (error) {
        console.error('Enhanced contract generation error:', error);
        if (error instanceof ClaudeApiError) {
            throw error;
        }
        throw new ClaudeApiError(`Failed to generate enhanced contract: ${(error as Error).message}`);
    }
}

export async function analyzeContract(contractContent: string): Promise<AnalysisResult> {
    try {
        const response = await fetch(`https://api.anthropic.com/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': PRIVATE_CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4096,
                system: ANALYSIS_SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Analyseer het volgende contract:

${contractContent}

Geef een gedetailleerde analyse van de risico's, aanbevelingen en juridische overwegingen.`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API Error:', errorText);
            throw new ClaudeApiError(`API request failed: ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new ClaudeApiError('Unexpected API response format');
        }

        const analysisText = data.content[0].text;
        let analysis: AnalysisResult;

        try {
            // Extract JSON from the response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            analysis = JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error parsing analysis JSON:', error);
            throw new ClaudeApiError('Failed to parse analysis response');
        }

        return analysis;
    } catch (error) {
        console.error('Contract analysis error:', error);
        if (error instanceof ClaudeApiError) {
            throw error;
        }
        throw new ClaudeApiError(`Failed to analyze contract: ${(error as Error).message}`);
    }
} 