// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";
import { MedicationProvider } from '../Tools/MedicationContext';


const AltConversion = () => {
    return (
        <div>
            <Dashboard heading='Alternative Medication Conversion'>
                <MedicationProvider>
                        <MedInputForm formtype={"alt"} />
                </MedicationProvider>
            </Dashboard>
        </div>
    );
};

export default AltConversion;