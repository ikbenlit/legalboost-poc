export type ProcessingStep = 'idle' | 'analyzing' | 'generating' | 'complete' | 'error';
export type FileType = 'txt';

export interface ProcessingStatus {
    step: ProcessingStep;
    fileType: FileType | null;
    message?: string;
}

export interface ProcessingMessages {
  [key in ProcessingStep]: {
    pdf: string;
    docx: string;
  };
}

export const processingMessages: ProcessingMessages = {
  idle: {
    pdf: 'Gereed voor verwerking',
    docx: 'Gereed voor verwerking'
  },
  loading: {
    pdf: 'PDF-bestand laden...',
    docx: 'DOCX-bestand laden...'
  },
  parsing: {
    pdf: 'PDF-pagina\'s verwerken',
    docx: 'Document structuur analyseren'
  },
  analyzing: {
    pdf: 'Contract inhoud analyseren',
    docx: 'Contract inhoud analyseren'
  },
  generating: {
    pdf: 'Rapport genereren',
    docx: 'Rapport genereren'
  },
  complete: {
    pdf: 'Verwerking voltooid',
    docx: 'Verwerking voltooid'
  },
  error: {
    pdf: 'Fout bij verwerken van PDF',
    docx: 'Fout bij verwerken van DOCX'
  }
}; 