// JavaScript source code
import React from "react";
import Dashboard from "../Components/Dashboard";
import MedInputForm from "../Components/MedInputForm";

const PoIvConversion = () => {
    return (
        <div>
            <Dashboard heading='PO:IV Conversion'>
                <MedInputForm redirectOnSubmit="results"/>
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;