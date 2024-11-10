// JavaScript source code
import * as React from "react";
import Dashboard from "../Components/Dashboard";
import AltConversionTool from "./AltConversionTool";


const AltConversion = () => {
    return (
        <div>
            <Dashboard heading='Alternative Medication Conversion'>
                <AltConversionTool/>
            </Dashboard>
        </div>
    );
};

export default AltConversion;