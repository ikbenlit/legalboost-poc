import { writable } from 'svelte/store';

export interface CompanyInfo {
    name: string;
    kvkNumber: string;
    address: string;
}

export interface ContractorInfo {
    name: string;
    address: string;
    bsn?: string;
    kvkNumber?: string;
}

export interface ContractSpecifics {
    startDate: string;
    endDate?: string;
    salary?: number;
    rate?: number;
    hoursPerWeek?: number;
    notice_period?: number;
    additionalNotes?: string;
}

export interface ContractDetails {
    contractType: 'arbeidsovereenkomst' | 'leveranciersovereenkomst' | 'geheimhoudingsverklaring';
    sector: string;
    companyInfo: CompanyInfo;
    contractorInfo: ContractorInfo;
    contractSpecifics: ContractSpecifics;
}

interface WizardState {
    currentStep: number;
    details: ContractDetails;
}

const initialState: WizardState = {
    currentStep: 1,
    details: {
        contractType: 'arbeidsovereenkomst',
        sector: '',
        companyInfo: {
            name: '',
            kvkNumber: '',
            address: ''
        },
        contractorInfo: {
            name: '',
            address: ''
        },
        contractSpecifics: {
            startDate: ''
        }
    }
};

function createWizardStore() {
    const { subscribe, set, update } = writable<WizardState>(initialState);

    return {
        subscribe,
        nextStep: () => update(state => ({
            ...state,
            currentStep: Math.min(state.currentStep + 1, 4)
        })),
        previousStep: () => update(state => ({
            ...state,
            currentStep: Math.max(state.currentStep - 1, 1)
        })),
        updateDetails: (details: Partial<ContractDetails>) => update(state => ({
            ...state,
            details: {
                ...state.details,
                ...details
            }
        })),
        reset: () => set(initialState)
    };
}

export const wizardStore = createWizardStore(); 