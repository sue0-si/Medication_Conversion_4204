import { createContext, useState } from 'react';
import { defaultMedicationData } from './Defaults';

// Create the context
export const MedicationContext = createContext();

// Create a provider component
export const MedicationProvider = ({ children }) => {
    const [medicationData, setMedicationData] = useState(defaultMedicationData);

    // Function to update patient data specifically
    const setPatientData = (newPatientData) => {
        setMedicationData(prevState => ({
            ...prevState,
            patientData: { ...prevState.patientData, ...newPatientData }
        }));
    };

    return (
        <MedicationContext.Provider value={{ medicationData, setMedicationData, setPatientData }}>
            {children}
        </MedicationContext.Provider>
    );
};