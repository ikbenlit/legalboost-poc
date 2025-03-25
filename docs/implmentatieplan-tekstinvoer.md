# Implementatieplan: Tekst-invoer Optie voor Contract Analyzer

## Fase 1: Ontwerp en Basisimplementatie

### UI Aanpassingen
- **Tabbed interface toevoegen**
  - Tab "Bestand uploaden" (huidige functionaliteit)
  - Tab "Tekst plakken" (nieuwe functionaliteit)
- **UI Componenten voor Tekstinvoer**
  - Groot tekstgebied met voldoende regels
  - Karakterteller/woordenteller
  - Placeholder tekst met instructies
  - Wisknop voor het tekstgebied
- **Toggle mechanisme**
  - State voor wisselen tussen upload/tekstinvoer
  - Conditionele rendering van interface

### State Management
- **State variabelen**
  ```typescript
  let activeTab: 'file' | 'text' = 'file';
  let contractText: string = '';
  ```
- **Conditionele logica** in bestaande `handleAnalyze()` functie
- **Validatie** voor minimale tekstlengte

## Fase 2: Backend Integratie

### API Endpoint Aanpassingen
- **Request handling uitbreiden**
  - Ondersteuning voor formData én JSON body
  - Controle op request type
- **Verwerkingslogica aanpassen**
  - Directe tekstverwerking naast bestandsverwerking

### Error Handling
- **Specifieke foutmeldingen**
  - Te korte tekst
  - Tekst in ongeldig formaat
  - Rate limiting/quota overschrijding

## Fase 3: Gebruikerservaring Verbeteringen

### Helper Functionaliteit
- **Voorbeeldtekst**
  - "Laad voorbeeld" knop
  - Verschillende contractvoorbeelden
- **Kopieer/plak assistentie**
  - Instructies voor kopiëren uit bronnen
  - Sneltoets-hints (Ctrl+V, ⌘+V)

### Accessibility
- **Keyboard navigatie**
  - Tabindex voor interactieve elementen
  - Sneltoetsen voor acties
- **Screen reader ondersteuning**
  - ARIA labels
  - Statusupdates

## Fase 4: Testing en Verfijning

### Test Scenario's
- **Functionele tests**
  - Diverse tekstlengtes
  - Verschillende contractformaten
  - Edge cases
- **Usability testing**
  - Gebruikersgemak testen
  - Feedback verzamelen

### Performance Optimalisaties
- **Tekstverwerking**
  - Chunking voor grote teksten
  - Debounce mechanisme

## Fase 5: Documentatie en Release

### Gebruikersdocumentatie
- **Instructies**
  - Stapsgewijze handleiding
  - Best practices
  - Voorbeelden

### Deployment
- **Feature release**
  - Staging test
  - Productie deployment
  - Post-release monitoring

## Tijdsinschatting
- **Fase 1**: 1 dag
- **Fase 2**: 0.5 dag
- **Fase 3**: 1 dag
- **Fase 4**: 0.5-1 dag
- **Fase 5**: 0.5 dag
- **Totaal**: 3.5-4 dagen

## Technische Aandachtspunten
- Tekstlimiet bepalen o.b.v. Claude API
- Tekstsanitisatie implementeren
- Sessie behoud bij paginaverversing
- Responsieve interface voor alle schermen