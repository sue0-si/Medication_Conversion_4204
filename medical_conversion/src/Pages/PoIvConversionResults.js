import * as React from "react";
import { MedicationContext } from '../Tools/MedicationContext';
import { defaultResultsData } from '../Tools/Defaults';
import ConversionResults from '../Components/ConversionResults';  // Import shared ConversionResults component
import { performConversion } from '../Tools/ConversionLogic';  // Import shared conversion logic

function PoIvConversionResults() {
    const [results, setResults] = React.useState(defaultResultsData);
    const [error, setError] = React.useState(null);
    const { medicationData } = React.useContext(MedicationContext);
    

    React.useEffect(() => {
        // Use the shared conversion logic
        performConversion(medicationData, setResults, setError);
    }, [medicationData]);

    return (
        <div>
            {error !== null && (
                <p>Conversion Error: {error}</p>
                ) }
            <ConversionResults
                resultsType="po-iv"
                medicationData={medicationData}
                results={results}
            />
        </div>
    );
}

export default PoIvConversionResults;