// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";
import { MedicationProvider } from '../Tools/MedicationContext';

const PoIvConversion = () => {
   


    return (
        <div>
            <Dashboard heading='PO:IV Conversion'>
                <MedicationProvider>
                    <MedInputForm formtype={"po-iv"} />
                </MedicationProvider>
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;