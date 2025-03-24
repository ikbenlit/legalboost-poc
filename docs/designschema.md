# Design Schema voor de Scherp Legal App

Dit design schema is gebaseerd op de huidige implementatie van de app en zorgt voor een consistente gebruikerservaring.

## Kleurenpalet

1. **Primaire Kleuren**
   - **Primary (`bg-primary`)**: Donkere achtergrond voor feature cards en accent elementen
   - **Accent (`bg-accent`)**: Voor primaire call-to-action knoppen
   - **Hover (`text-hover`, `bg-hover`)**: Voor hover states en accenten
   - **Text Light (`text-text-light`)**: Lichte tekst op donkere achtergronden
   - **Text (`text-text`)**: Standaard tekst kleur

2. **Grijstinten**
   - **Wit (`bg-white`)**: Voor de algemene achtergrond en cards
   - **Lichtgrijs (`bg-gray-50`)**: Voor sectie achtergronden
   - **Tekstgrijs (`text-gray-600`)**: Voor secundaire tekst en links
   - **Transparant Wit**: `bg-white/80` met `backdrop-blur-sm` voor de header

## Typografie

1. **Koppen**
   - Hero: `text-5xl font-bold` voor de hoofdtitel
   - H2: `text-3xl font-bold` voor sectie koppen
   - H3: `text-xl font-semibold` voor feature titels
   - H4: `font-semibold` voor footer koppen

2. **Tekst Groottes**
   - Groot: `text-xl` voor hero paragraaf en belangrijke tekst
   - Basis: `text-base` voor normale tekst
   - Klein: Voor metadata en labels

## UI Componenten

### Knoppen
1. **Primaire CTA**
```html
<button class="bg-accent text-text-light px-8 py-3 rounded-full text-lg hover:bg-hover hover:text-primary transition-colors w-full sm:w-auto">
```

2. **Navigatie Links**
```html
<a class="text-gray-600 hover:text-primary transition-colors">
```

### Containers
1. **Feature Cards**
```html
<div class="bg-primary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
```

2. **Header**
```html
<nav class="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
```

3. **Sectie Container**
```html
<section class="py-20">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
```

### Iconen
1. **Feature Iconen**
```html
<div class="w-12 h-12 bg-hover/20 rounded-lg flex items-center justify-center mb-4">
  <svg class="h-6 w-6 text-hover">
```

2. **Sociale Media Iconen**
```html
<svg class="h-6 w-6" fill="currentColor">
```

## Layout & Spacing

1. **Verticale Ritme**
   - Sectie padding: `py-20`
   - Tussen elementen: `mb-4`, `mb-6`, `mb-8`, `mb-12`
   - Grid gap: `gap-4`, `gap-8`

2. **Container Structuur**
   - Basis container: `container mx-auto px-4`
   - Maximum breedte content: `max-w-4xl mx-auto`
   - Grid layouts: `grid md:grid-cols-3`, `grid md:grid-cols-4`

## Responsiviteit

1. **Breakpoints**
   - Mobiel: Standaard styling (verticale stacking)
   - Desktop: 
     - `md:flex` voor navigatie
     - `md:grid-cols-3` voor features
     - `md:grid-cols-4` voor footer
     - `sm:w-auto` voor buttons

2. **Responsive Aanpassingen**
   - Knoppen: `w-full sm:w-auto`
   - Navigatie: `hidden md:flex`
   - Layout: Flex column naar row: `flex-col sm:flex-row`

## Best Practices

1. **Consistentie**
   - Gebruik van vaste padding en margin waardes
   - Consistente hover effecten met `transition-colors`
   - Uniforme border radius met `rounded-xl` voor cards

2. **Interactiviteit**
   - Hover states voor alle klikbare elementen
   - Transitie effecten voor smooth interacties
   - Duidelijke visuele feedback (shadow changes, color transitions)

3. **Performance**
   - Gebruik van SVG iconen voor scherpte
   - Efficiënte gebruik van utility classes
   - Optimale image sizing
