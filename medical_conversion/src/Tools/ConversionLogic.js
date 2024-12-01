import opioidRouteConversions from './opioidRouteConversions';
import steroids from './steroids.json';
import opioids from './opioids.json';
import benzodiazepine from './benzodiazepine.json';
import localAnesthetics from './local_anesthetics.json';
import { drugClassMap } from './drugClassMap';

export const performConversion = (medicationData, setResults, setError, type) => {
    if (!medicationData || !medicationData.name) {
        setError("No valid medication data provided.");
        return;
    }

    const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
    const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();
    const firstAdminType = medicationData.route;
    const targetAdminType = medicationData.targetRoute || medicationData.route;

    let conversionRatio = 1;  // Default ratio
    let convertedDosage = medicationData.dosage;  // Initialize with original dosage
    let conversionFormula = ""; // For storing the formula used

    // 1. Use custom formula if available
    if (medicationData.formula && medicationData.formula.customFormula) {
        let formulaToEvaluate = medicationData.formula.customFormula.replace(/dose/gi, medicationData.dosage);
        try {
            let result = eval(formulaToEvaluate); // Note: eval can be dangerous; consider safer alternatives
            convertedDosage = result;
            // Update conversionFormula to reflect the custom formula
            conversionFormula = `${medicationData.formula.customFormula.replace(/dose/gi, medicationData.dosage)} = ${convertedDosage} ${medicationData.dosageUnit} of ${medicationData.target}`;
        } catch (error) {
            setError("Error evaluating custom formula");
            return;
        }
    } else if (medicationData.formula && medicationData.formula.conversionRatio) {
        // Use the provided conversion ratio
        conversionRatio = medicationData.formula.conversionRatio;
        convertedDosage = medicationData.dosage * conversionRatio;
        conversionFormula = `${medicationData.dosage} ${medicationData.dosageUnit} of ${medicationData.name} * ${conversionRatio} = ${convertedDosage} ${medicationData.dosageUnit} of ${medicationData.target}`;
    } else {
        // 2. Apply default logic based on drug class
        const firstDrugClass = drugClassMap[normalizedDrugName];
        if (!firstDrugClass) {
            setError("Invalid drug class");
            return;
        }

        // Existing logic for opioids or other drug classes
        switch (firstDrugClass) {
            case 'opioid':
                if (type === "poiv") {
                    conversionRatio = opioidRouteConversions?.[normalizedDrugName]?.[firstAdminType]?.[targetAdminType] || 1;
                } else if (type === "alt") {
                    conversionRatio = opioids?.[normalizedDrugName]?.Conversions?.[normalizedDrugNameTarget] || 1;
                }
                break;
            case 'steroid':
                conversionRatio = steroids?.[normalizedDrugName]?.Conversions?.[normalizedDrugNameTarget] || 1;
                break;
            case 'benzodiazepine':
                conversionRatio = benzodiazepine?.[normalizedDrugName]?.Conversions?.[normalizedDrugNameTarget] || 1;
                break;
            case 'local anesthetic':
                conversionRatio = localAnesthetics?.[normalizedDrugName]?.Conversions?.[normalizedDrugNameTarget] || 1;
                break;
            default:
                setError("No valid drug class found");
                return;
        }
        convertedDosage = medicationData.dosage * conversionRatio;
        conversionFormula = `${medicationData.dosage} ${medicationData.dosageUnit} of ${medicationData.name} * ${conversionRatio} = ${convertedDosage} ${medicationData.dosageUnit} of ${medicationData.target}`;
    }

    // Set the results for display
    setResults({
        medName: medicationData.target,
        dosage: Math.round(convertedDosage * 100) / 100,
        dosageUnit: medicationData.dosageUnit,
        conversionFormula: conversionFormula,
        warnings: [],  // Add warnings if needed
        formulaName: medicationData.formulaName || "Standard Formula",
    });
};
