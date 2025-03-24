import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { browser } from '$app/environment';

// PDF.js worker configuratie
if (browser) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PdfMetadataInfo {
  Title?: string;
  Author?: string;
  Keywords?: string;
  [key: string]: string | undefined;
}

interface ParseResult {
  text: string;
  html?: string;
  error?: string;
  metadata?: {
    pageCount: number;
    title?: string;
    author?: string;
    keywords?: string;
  };
}

// Mammoth transformatie opties voor betere DOCX verwerking
const mammothOptions = {
  styleMap: [
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "p[style-name='Heading 4'] => h4:fresh",
    "p[style-name='Heading 5'] => h5:fresh",
    "p[style-name='Heading 6'] => h6:fresh",
    "r[style-name='Strong'] => strong",
    "r[style-name='Emphasis'] => em",
    "table => table",
    "tr => tr",
    "td => td",
    "p[style-name='List Paragraph'] => ul > li:fresh",
    "p[style-name='Quote'] => blockquote:fresh",
  ],
  transformDocument: (element: any) => {
    return element;
  },
};

/**
 * Parse een TXT bestand naar platte tekst
 */
async function parseTxt(file: File): Promise<ParseResult> {
  try {
    const text = await file.text();
    return {
      text,
      metadata: {
        pageCount: text.split('\n\n').length // Schatting van aantal pagina's op basis van dubbele regeleinden
      }
    };
  } catch (error: any) {
    return {
      text: '',
      error: `Fout bij het parsen van TXT bestand: ${error.message}`
    };
  }
}

/**
 * Parse een DOCX bestand naar platte tekst
 */
async function parseDocx(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value,
      error: result.messages.length > 0 ? result.messages[0].message : undefined
    };
  } catch (error: any) {
    return {
      text: '',
      error: `Fout bij het parsen van DOCX bestand: ${error.message}`
    };
  }
}

/**
 * Parse een PDF bestand naar platte tekst met metadata
 */
async function parsePdf(file: File): Promise<ParseResult> {
  if (!browser) {
    return {
      text: '',
      error: 'PDF parsing is alleen beschikbaar in de browser'
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Metadata ophalen
    const metadata = await pdf.getMetadata().catch(() => ({ info: {} }));
    const info = (metadata?.info || {}) as PdfMetadataInfo;
    
    // Tekst van alle pagina's ophalen
    const pageTexts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Verbeterde tekstextractie met behoud van layout
      const pageText = textContent.items
        .reduce((text: string, item: any) => {
          const itemText = item.str || '';
          // Voeg spatie toe als er een significante horizontale afstand is
          return text + (item.hasEOL ? itemText + '\n' : itemText + ' ');
        }, '')
        .trim();
      
      pageTexts.push(pageText);
    }

    return {
      text: pageTexts.join('\n\n'),
      metadata: {
        pageCount: pdf.numPages,
        title: info.Title,
        author: info.Author,
        keywords: info.Keywords
      }
    };
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    return {
      text: '',
      error: `Fout bij het parsen van PDF bestand: ${error.message}`
    };
  }
}

/**
 * Hoofdfunctie voor het parsen van bestanden
 * Selecteert automatisch de juiste parser op basis van het bestandstype
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  switch (fileType) {
    case 'txt':
      return parseTxt(file);
    case 'docx':
      return parseDocx(file);
    case 'pdf':
      return parsePdf(file);
    default:
      return {
        text: '',
        error: `Niet-ondersteund bestandsformaat: ${fileType}`
      };
  }
} 