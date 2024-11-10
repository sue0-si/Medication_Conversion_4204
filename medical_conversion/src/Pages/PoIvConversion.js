import * as React from "react";
import Dashboard from "../Components/Dashboard";
import PoIvConversionTool from "./PoIvConversionTool";


const PoIvConversion = () => {
    return (
        <div>
            <Dashboard heading='PO:IV Medication Conversion'>
                <PoIvConversionTool />
            </Dashboard>
        </div>
    );
};

export default PoIvConversion;