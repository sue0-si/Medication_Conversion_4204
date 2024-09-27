// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";
import ConversionResults from "../Components/ConversionResults";
import ConversionCalculation from "../Components/ConversionCalculation";
import { defaultMedicationData } from "../Tools/Defaults";
import { defaultPatientData } from "../Tools/Defaults";
import { defaultResultsData } from "../Tools/Defaults";


const PoIvConversion = () => {
    const [step, setStep] = React.useState('form');  // Step state to switch between form and results
    const [medicationData, setMedicationData] = React.useState(defaultMedicationData);  // State to hold form data
    const [patientData, setPatientData] = React.useState(defaultPatientData); // State to hold patient data
    const [resultsData, setResultsData] = React.useState(defaultResultsData);
    const handleFormSubmit = () => {
        setStep('calculations');  // Move to the next step (results display)
    };
    const handleCalcualtionFinished = () => {
        setStep('results')
    }


    return (
        <div>
            <Dashboard heading='PO:IV Conversion'>
                {step === 'form' && < MedInputForm medicationData={medicationData} setMedicationData={setMedicationData}
                    patientData={patientData} setPatientData={setPatientData} onSubmit={handleFormSubmit}/>}
                {step === 'calculations' && <ConversionCalculation setResultsData={setResultsData} medicationData={medicationData}
                    onCalculationComplete={handleCalcualtionFinished} patientData={ patientData} />}
                {step === 'results' && <ConversionResults medicationData={medicationData} patientData={patientData} resultsData={ resultsData } />}
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;