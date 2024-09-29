import * as React from "react";
import opioidRouteConversions from '../Tools/opioidRouteConversions';
import steroids from '../Tools/steroids.json';
import opioids from '../Tools/opioids.json';
import benzodiazepine from '../Tools/benzodiazepine.json';
import localAnesthetics from '../Tools/local_anesthetics.json';
import { drugClassMap } from './drugClassMap';  // Correct import

function ConversionResults({ medicationData }) {
    const [results, setResults] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (!medicationData || !medicationData.name) {
            setError("No valid medication data provided.");
            return;
        }

        const calculateConversion = () => {
            const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
            const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();

            const firstDrugClass = drugClassMap[normalizedDrugName];
            const secondDrugClass = drugClassMap[normalizedDrugNameTarget];

            if (!firstDrugClass || !secondDrugClass) {
                setError("Invalid drug classes");
                return;
            }

            if (firstDrugClass === 'opioid' && secondDrugClass === 'opioid') {
                const firstAdminType = medicationData.route;
                const targetAdminType = medicationData.targetRoute;
                const conversionRatio = opioidRouteConversions?.[normalizedDrugName]?.[firstAdminType]?.[targetAdminType];

                if (conversionRatio != null) {
                    const convertedDosage = Math.round((medicationData.dosage * conversionRatio) * 100) / 100;
                    setResults({
                        medName: medicationData.name,
                        dosage: convertedDosage,
                        dosageUnit: medicationData.dosageUnit,
                    });
                } else {
                    setError(`No conversion available from ${firstAdminType} to ${targetAdminType}`);
                }
            } else {
                let conversionData;

                switch (firstDrugClass) {
                    case 'steroid':
                        conversionData = steroids;
                        break;
                    case 'opioid':
                        conversionData = opioids;
                        break;
                    case 'benzodiazepine':
                        conversionData = benzodiazepine;
                        break;
                    case 'local anesthetic':
                        conversionData = localAnesthetics;
                        break;
                    default:
                        setError("No valid drug class found");
                        return;
                }

                const firstDrug = normalizedDrugName;
                const secondDrug = normalizedDrugNameTarget;
                const firstDrugConversions = conversionData[firstDrug]?.Conversions;

                if (!firstDrugConversions) {
                    setError("No conversion data found");
                    return;
                }

                const conversionRatio = firstDrugConversions[secondDrug] || null;
                if (conversionRatio != null) {
                    const convertedDosage = Math.round((medicationData.dosage * conversionRatio) * 100) / 100;
                    setResults({
                        medName: medicationData.name,
                        dosage: convertedDosage,
                        dosageUnit: medicationData.dosageUnit,
                    });
                } else {
                    setError("No conversion found");
                }
            }
        };

        calculateConversion();
    }, [medicationData]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {results && (
                <div>
                    <h2>Conversion Results</h2>
                    <p>Medication: {results.medName}</p>
                    <p>Converted Dosage: {results.dosage}</p>
                    <p>Dosage Unit: {results.dosageUnit}</p>
                </div>
            )}
        </div>
    );
}

export default ConversionResults;
