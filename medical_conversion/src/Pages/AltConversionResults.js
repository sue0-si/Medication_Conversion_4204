import * as React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultResultsData } from '../Tools/Defaults';
import ConversionResults from '../Components/ConversionResults';  // Import shared ConversionResults component
import { performConversion } from '../Tools/ConversionLogic';  // Import shared conversion logic

const AltConversionResult = () => {
    const [results, setResults] = React.useState(defaultResultsData);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const { medicationData } = location.state || {};
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/alt');
    };

    React.useEffect(() => {
        // Use shared conversion logic for alt conversions or add custom logic here
        performConversion(medicationData, setResults, setError);
    }, [medicationData]);

    return (
        <ConversionResults
            resultsType="alt"
            medicationData={medicationData}
            results={results}
        />
    );
}

export default AltConversionResult;
