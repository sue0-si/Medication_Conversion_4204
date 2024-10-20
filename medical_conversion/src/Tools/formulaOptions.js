import benzodiazepines from './benzodiazepine.json';
import opioids from './opioids.json';
import localAnesthetics from './local_anesthetics.json';
import steroids from './steroids.json';

/**
 * Function to extract formula options from multiple datasets
 */
export const extractFormulaOptions = () => {
    let formulaOptions = [];

    // 1. Extract Benzodiazepine Conversions
    Object.keys(benzodiazepines).forEach((drug) => {
        const conversions = benzodiazepines[drug].Conversions;
        Object.keys(conversions).forEach((targetDrug) => {
            formulaOptions.push({
                formulaName: `${drug} to ${targetDrug}`,
                conversionRatio: conversions[targetDrug],
                class: benzodiazepines[drug].class
            });
        });
    });

    // 2. Extract Opioid Conversions
    Object.keys(opioids).forEach((drug) => {
        const conversions = opioids[drug].Conversions;
        Object.keys(conversions).forEach((route) => {
            Object.keys(conversions[route]).forEach((targetDrug) => {
                formulaOptions.push({
                    formulaName: `${drug} (${route}) to ${targetDrug}`,
                    conversionRatio: conversions[route][targetDrug],
                    class: opioids[drug].class
                });
            });
        });
    });

    // 3. Extract Local Anesthetic Conversions
    Object.keys(localAnesthetics).forEach((drug) => {
        const conversions = localAnesthetics[drug].Conversions;
        Object.keys(conversions).forEach((targetDrug) => {
            formulaOptions.push({
                formulaName: `${drug} to ${targetDrug}`,
                conversionRatio: conversions[targetDrug],
                class: localAnesthetics[drug].class
            });
        });
    });

    // 4. Extract Steroid Conversions
    Object.keys(steroids).forEach((drug) => {
        const conversions = steroids[drug].Conversions;
        Object.keys(conversions).forEach((targetDrug) => {
            formulaOptions.push({
                formulaName: `${drug} to ${targetDrug}`,
                conversionRatio: conversions[targetDrug],
                class: steroids[drug].class
            });
        });
    });

    return formulaOptions;
};