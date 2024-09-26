// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";
import ConversionResults from "./ConversionResults";
import { defaultMedicationData } from "../Tools/Defaults";
import { defaultPatientData } from "../Tools/Defaults";


const PoIvConversion = () => {
    const [step, setStep] = React.useState('form');  // Step state to switch between form and results
    const [medicationData, setMedicationData] = React.useState(defaultMedicationData);  // State to hold form data
    const [patientData, setPatientData] = React.useState(defaultPatientData); // State to hold patient data

    const handleFormSubmit = () => {
        setStep('results');  // Move to the next step (results display)
    };
    return (
        <div>
            <Dashboard heading='PO:IV Conversion'>
                {step === 'form' && < MedInputForm medicationData={medicationData} setMedicationData={setMedicationData}
                    patientData={patientData} setPatientData={setPatientData} onSubmit={handleFormSubmit} />}
                {step === 'results' && <ConversionResults medicationData={medicationData} patientData={patientData}/>}
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;