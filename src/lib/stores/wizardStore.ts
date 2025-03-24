import { writable } from 'svelte/store';

export interface ContractDetails {
    contractType: string;
    companyInfo: {
        name: string;
        kvkNumber: string;
        address: string;
    };
    contractorInfo: {
        name: string;
        address: string;
        bsn?: string;
        kvkNumber?: string;
    };
    contractSpecifics: {
        startDate: string;
        endDate?: string;
        salary?: number;
        rate?: number;
        hoursPerWeek?: number;
        notice_period?: number;
        additionalNotes?: string;
    };
}

export interface WizardState {
    currentStep: number;
    details: ContractDetails;
    isValid: boolean;
}

const initialState: WizardState = {
    currentStep: 1,
    details: {
        contractType: '',
        companyInfo: {
            name: '',
            kvkNumber: '',
            address: '',
        },
        contractorInfo: {
            name: '',
            address: '',
        },
        contractSpecifics: {
            startDate: '',
        }
    },
    isValid: false
};

function createWizardStore() {
    const { subscribe, set, update } = writable<WizardState>(initialState);

    return {
        subscribe,
        nextStep: () => update(state => ({ ...state, currentStep: state.currentStep + 1 })),
        previousStep: () => update(state => ({ ...state, currentStep: state.currentStep - 1 })),
        setStep: (step: number) => update(state => ({ ...state, currentStep: step })),
        updateDetails: (details: Partial<ContractDetails>) => 
            update(state => ({
                ...state,
                details: { ...state.details, ...details }
            })),
        reset: () => set(initialState),
        setValid: (isValid: boolean) => update(state => ({ ...state, isValid }))
    };
}

export const wizardStore = createWizardStore(); 