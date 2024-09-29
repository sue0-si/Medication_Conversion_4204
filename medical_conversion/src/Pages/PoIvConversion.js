// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";
import { defaultMedicationData } from "../Tools/Defaults";
import { defaultPatientData } from "../Tools/Defaults";
import { defaultResultsData } from "../Tools/Defaults";


const PoIvConversion = () => {
    const [medicationData, setMedicationData] = React.useState(defaultMedicationData);  // State to hold form data
    const [patientData, setPatientData] = React.useState(defaultPatientData); // State to hold patient data
   


    return (
        <div>
            <Dashboard heading='PO:IV Conversion'>
                < MedInputForm redirectOnSubmit={"/po-iv/"} medicationData={medicationData} setMedicationData={setMedicationData}
                    patientData={patientData} setPatientData={setPatientData}/>
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;