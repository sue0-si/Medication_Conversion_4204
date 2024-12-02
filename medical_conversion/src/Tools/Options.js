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
                formulaName: `${drug} to ${normalizedTargetDrug}`,
                justification: "Conversion Formula recieved as strength ratio {clincalc.com/benzodiazepine/} and does not account for patient variables"
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
                    formulaName: `${drug} ${route} to ${normalizedTargetDrug} ${route}`,
                justification: "Conversion Formula recieved as strength ratio {cancercalc.com/opioid_conversion.php / paindata.org/caclulator.php} and does not account for patient variables"
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
                formulaName: `${drug} to ${normalizedTargetDrug}`,
                justification: "Conversion Formula recieved as strength ratio {www.mdcalc.com/calc/10205/local-anesthetic-dosing-calculator} and does not account for patient variables"
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
                formulaName: `${drug} to ${normalizedTargetDrug}`,
                justification: "Conversion Formula recieved as strength ratio {www.mdcalc.com/calc/2040/steroid-conversion-calculator} and does not account for patient variables"
            });
        });
    });

    return formulaOptions;
};

/**
 * Function to only extract opioid formulae for po-iv
 */
export const extractOpioidFormulae = () => {
    const formulaOptions = [];
    // Add Opioids formulas
    Object.keys(opioids).forEach((drug) => {
        const drugData = opioids[drug];
        if (!drugData.route_conversions) {
            console.warn(`Skipping ${drug}, no route conversions available.`);
            return; // Skip drugs without route conversions
        }
    
        // Iterate through each route conversion
        Object.keys(drugData.route_conversions).forEach((conversionKey) => {
            const conversionRatio = drugData.route_conversions[conversionKey];
            if (conversionRatio === null || conversionRatio === undefined) {
                console.warn(`Skipping conversion for ${drug}: ${conversionKey} due to null/undefined ratio.`);
                return; // Skip if conversion ratio is undefined or null
            }
    
            // Extract source and target routes from conversionKey
            const [sourceRoute, targetRoute] = conversionKey.split("_to_");
    
            // Validate routes
            if (!sourceRoute || !targetRoute) {
                console.warn(`Invalid conversionKey format for ${drug}: ${conversionKey}`);
                return; // Skip invalid conversionKey
            }
    
            // Add the conversion formula to formulaOptions
            formulaOptions.push({
                sourceDrug: drug,
                sourceRoute: sourceRoute.toLowerCase(),
                targetDrug: drug, // Target drug is the same as the source drug in this structure
                targetRoute: targetRoute.toLowerCase(),
                conversionRatio,
                class: drugData.class,
                formulaName: `${drug} (${sourceRoute}) to (${targetRoute})`,
                justification: "Conversion formula received as a direct strength ratio and does not account for patient variables."
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

    Object.keys(opioids).forEach((drug) => {
        medicationConversions.to[drug] = new Set();

        // Iterate through all available routes for each drug
        Object.keys(opioids[drug].Conversions).forEach((route) => {
            Object.keys(opioids[drug].Conversions[route]).forEach((targetDrug) => {
                const normalizedTargetDrug = normalizeDrugName(targetDrug);

                // Initialize the 'from' set if it doesn't exist
                if (!medicationConversions.from[normalizedTargetDrug]) {
                    medicationConversions.from[normalizedTargetDrug] = new Set();
                }

                // Add the target drug and its route to the 'to' and 'from' sets
                medicationConversions.to[drug].add(`${normalizedTargetDrug} (${route})`);
                medicationConversions.from[normalizedTargetDrug].add(`${drug}`);
            });
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


/**
 * Function to only extract opioids for po-iv
 */
export const extractOpioidMedications = () => {
    const medicationConversions = {
        to: {},   // Map of medications that can be converted to others
        from: {}  // Map of medications that can be converted from others
    };
    
    // First Loop: Add basic opioid conversions
    Object.keys(opioids).forEach((drug) => {
        if (!medicationConversions.to[drug]) {
            medicationConversions.to[drug] = new Set();
        }
        Object.keys(opioids[drug].Conversions).forEach((targetDrug) => {
            const normalizedTargetDrug = normalizeDrugName(targetDrug);
            if (!medicationConversions.from[normalizedTargetDrug]) {
                medicationConversions.from[normalizedTargetDrug] = new Set();
            }
            medicationConversions.to[drug].add(normalizedTargetDrug);  // drug can convert to targetDrug
            medicationConversions.from[normalizedTargetDrug].add(drug); // Target drug can be converted from drug
        });
    });

    // Second Loop: Add conversions with routes
    Object.keys(opioids).forEach((drug) => {
        // Removed: medicationConversions.to[drug] = new Set();

        // Iterate through all available routes for each drug
        Object.keys(opioids[drug].Conversions).forEach((route) => {
            Object.keys(opioids[drug].Conversions[route]).forEach((targetDrug) => {
                const normalizedTargetDrug = normalizeDrugName(targetDrug);

                // Initialize the 'from' set if it doesn't exist
                if (!medicationConversions.from[normalizedTargetDrug]) {
                    medicationConversions.from[normalizedTargetDrug] = new Set();
                }

                // Initialize the 'to' set if it doesn't exist
                if (!medicationConversions.to[drug]) {
                    medicationConversions.to[drug] = new Set();
                }

                // Add the target drug and its route to the 'to' and 'from' sets
                medicationConversions.to[drug].add(`${normalizedTargetDrug} (${route})`);
                medicationConversions.from[normalizedTargetDrug].add(`${drug}`);
            });
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