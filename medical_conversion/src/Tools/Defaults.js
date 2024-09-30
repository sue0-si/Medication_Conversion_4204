// JavaScript source code
export const defaultMedicationData = {
    name: '',
    dosage: 0,  // Commenting out dosage-related functionality
    dosageUnit: 'mg', // Default unit is 'mg', commented out
    target: '', // name of drug to convert to
    route: '',  // Renamed from form to route for administrative method
    targetRoute: '', // desired method of administration
    // isAdministrative: false,  // Checkbox for administrative, commented out
    formulaName: '',
    formula: '',  // Select box for different formulas
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