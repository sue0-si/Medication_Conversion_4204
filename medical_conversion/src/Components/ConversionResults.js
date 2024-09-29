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
            const firstAdminType = medicationData.route;
            const targetAdminType = medicationData.targetRoute;

            // Debugging logs to see if the values are correct
            console.log(`Looking up conversion for drug: ${normalizedDrugName}`);
            console.log(`From route: ${firstAdminType}, to route: ${targetAdminType}`);

            const firstDrugClass = drugClassMap[normalizedDrugName];
            if (!firstDrugClass) {
                setError("Invalid drug class");
                return;
            }

            if (firstDrugClass === 'opioid') {
                // Use opioid route conversions
                const conversionRatio = opioidRouteConversions?.[normalizedDrugName]?.[firstAdminType]?.[targetAdminType];

                // Debugging logs to check if the conversion is found
                console.log(`Conversion ratio found: ${conversionRatio}`);

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
                setError("Non-opioid drug classes not yet implemented.");
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
