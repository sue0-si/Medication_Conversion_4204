import benzodiazepines from './benzodiazepine.json';
import opioids from './opioids.json';
import localAnesthetics from './local_anesthetics.json';
import steroids from './steroids.json';


function normalizeDrugName(drug) {
    if (drug.includes("(")) {
        return drug.split('(')[0].trim();
    } else {
        return drug;
    }
}
/**
 * Function to extract formula options from multiple datasets
 */
export const extractFormulaOptions = () => {
    const formulaOptions = [];

    // Add Benzodiazepines formulas
    Object.keys(benzodiazepines).forEach((drug) => {
        Object.keys(benzodiazepines[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            formulaOptions.push({
                sourceDrug: drug,
                targetDrug: normalizedTargetDrug,
                conversionRatio: benzodiazepines[drug].Conversions[normalizedTargetDrug],
                class: benzodiazepines[drug].class,
                formulaName: `${drug} to ${normalizedTargetDrug}`
            });
        });
    });

    // Add Opioids formulas
    Object.keys(opioids).forEach((drug) => {
        Object.keys(opioids[drug].Conversions).forEach((route) => {
            Object.keys(opioids[drug].Conversions[route]).forEach((targetDrug) => {
                const normalizedTargetDrug = normalizeDrugName(targetDrug);
                formulaOptions.push({
                    sourceDrug: drug,
                    targetDrug: normalizedTargetDrug,
                    conversionRatio: opioids[drug].Conversions[route][normalizedTargetDrug],
                    class: opioids[drug].class,
                    formulaName: `${drug} to ${normalizedTargetDrug} via ${route}`
                });
            });
        });
    });

    // Add Local Anesthetics formulas
    Object.keys(localAnesthetics).forEach((drug) => {
        Object.keys(localAnesthetics[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            formulaOptions.push({
                sourceDrug: drug,
                targetDrug: normalizedTargetDrug,
                conversionRatio: localAnesthetics[drug].Conversions[normalizedTargetDrug],
                class: localAnesthetics[drug].class,
                formulaName: `${drug} to ${normalizedTargetDrug}`
            });
        });
    });

    // Add Steroids formulas
    Object.keys(steroids).forEach((drug) => {
        Object.keys(steroids[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            formulaOptions.push({
                sourceDrug: drug,
                targetDrug: normalizedTargetDrug,
                conversionRatio: steroids[drug].Conversions[normalizedTargetDrug],
                class: steroids[drug].class,
                formulaName: `${drug} to ${normalizedTargetDrug}`
            });
        });
    });

    return formulaOptions;
};


/**
 * Function to extract available medication names from multiple datasets
 */
export const extractMedicationOptions = () => {
    const medicationConversions = {
        to: {},   // Map of medications that can be converted to others
        from: {}  // Map of medications that can be converted from others
    };

    // Add Benzodiazepines conversions
    Object.keys(benzodiazepines).forEach((drug) => {
        medicationConversions.to[drug] = new Set();
        Object.keys(benzodiazepines[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            if (!medicationConversions.from[normalizedTargetDrug]) {
                medicationConversions.from[normalizedTargetDrug] = new Set();
            }
            medicationConversions.to[drug].add(normalizedTargetDrug);  // drug can convert to targetDrug
            medicationConversions.from[normalizedTargetDrug].add(drug); // Target drug can be converted from drug
        });
    });

    // Add Opioids conversions
    Object.keys(opioids).forEach((drug) => {
        medicationConversions.to[drug] = new Set();
        Object.keys(opioids[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            if (!medicationConversions.from[normalizedTargetDrug]) {
                medicationConversions.from[normalizedTargetDrug] = new Set();
            }
            medicationConversions.to[drug].add(normalizedTargetDrug);  // drug can convert to targetDrug
            medicationConversions.from[normalizedTargetDrug].add(drug); // Target drug can be converted from drug
        });
    });

    // Add Local Anesthetics conversions
    Object.keys(localAnesthetics).forEach((drug) => {
        medicationConversions.to[drug] = new Set();
        Object.keys(localAnesthetics[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            if (!medicationConversions.from[normalizedTargetDrug]) {
                medicationConversions.from[normalizedTargetDrug] = new Set();
            }
            medicationConversions.to[drug].add(normalizedTargetDrug);  // drug can convert to targetDrug
            medicationConversions.from[normalizedTargetDrug].add(drug); // Target drug can be converted from drug
        });
    });

    // Add Steroids conversions
    Object.keys(steroids).forEach((drug) => {
        medicationConversions.to[drug] = new Set();
        Object.keys(steroids[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            if (!medicationConversions.from[normalizedTargetDrug]) {
                medicationConversions.from[normalizedTargetDrug] = new Set();
            }
            medicationConversions.to[drug].add(normalizedTargetDrug);  // drug can convert to targetDrug
            medicationConversions.from[normalizedTargetDrug].add(drug); // Target drug can be converted from drug
        });
    });

    // Convert Sets to Arrays for easier filtering in UI
    Object.keys(medicationConversions.to).forEach(drug => {
        medicationConversions.to[drug] = Array.from(medicationConversions.to[drug]);
    });
    Object.keys(medicationConversions.from).forEach(drug => {
        medicationConversions.from[drug] = Array.from(medicationConversions.from[drug]);
    });

    return medicationConversions;
};