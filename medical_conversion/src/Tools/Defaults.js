// JavaScript source code
export const defaultMedicationData = {
    name: '',
    route: '',  // Renamed from form to route for administrative method
    dosage: 0,  // Commenting out dosage-related functionality
    dosageUnit: 'mg', // Default unit is 'mg', commented out
    target: '', // name of drug to convert to
    targetRoute: '', // desired method of administration (PO-IV onv.)
    formulaName: '',
    formula: {},  // Select box for different formulas
    patient: false
};

export const defaultPatientData = {
    height: 0,
    weight: 0,
    gender: "",
    liver: false,
    kidney: false,
    gastro: false,
    disease: ""
};
export const defaultResultsData = {
    medName: '',
    dosage: 0,
    dosageUnit: '',
    route: '',
    error: "None",
    conversionFormula: '',
    formulaName: '',
    warnings: []
}