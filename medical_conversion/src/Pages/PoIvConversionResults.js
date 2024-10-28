import * as React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultResultsData } from '../Tools/Defaults';
import ConversionResults from '../Components/ConversionResults';  // Import shared ConversionResults component
import { performConversion } from '../Tools/ConversionLogic';  // Import shared conversion logic

function PoIvConversionResults() {
    const [results, setResults] = React.useState(defaultResultsData);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const { medicationData } = location.state || {};
    const navigate = useNavigate();
    

    React.useEffect(() => {
        // Use the shared conversion logic
        performConversion(medicationData, setResults, setError);
    }, [medicationData]);

    return (
        <ConversionResults
            resultsType="po-iv"
            medicationData={medicationData}
            results={results}
        />
    );
}

export default PoIvConversionResults;