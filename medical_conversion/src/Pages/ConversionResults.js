import * as React from "react";
import opioidRouteConversions from '../Tools/opioidRouteConversions';
import steroids from '../Tools/steroids.json';
import opioids from '../Tools/opioids.json';
import benzodiazepine from '../Tools/benzodiazepine.json';
import localAnesthetics from '../Tools/local_anesthetics.json';
import { drugClassMap } from '../Components/drugClassMap';  // Correct import
import Administration from '../Components/Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { defaultResultsData } from '../Tools/Defaults'
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "../Components/Dashboard";
import AlertDialog from "../Components/AlertDialog";
import warningData from '../Tools/warning.json'

function ConversionResults({ resultsType }) {
    const [results, setResults] = React.useState(defaultResultsData);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const { medicationData } = location.state || {};
    const { patientData } = location.state || {};
    const [collapsedWarnings, setCollapsedWarnings] = React.useState([]);
    const [warningIndex, setWarningIndex] = React.useState(0); 
    const [showGeneralWarning, setShowGeneralWarning] = React.useState(true); 
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/po-iv');
    };

    const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle undefined or empty string

    // Handle special cases for "iv" and "sc"
    if (string.toLowerCase() === "iv") return "IV";
    if (string.toLowerCase() === "sc") return "SC";

    // Default capitalization for other strings
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

    /*const toggleWarning = (index) => {
        if (collapsedWarnings.includes(index)) {
            setCollapsedWarnings(collapsedWarnings.filter((i) => i !== index));
        } else {
            setCollapsedWarnings([...collapsedWarnings, index]);
        }
    };*/

    const toggleWarning = () => {
        if (showGeneralWarning && specificWarnings.length > 0) {
            // Switch from general to specific warnings
            setShowGeneralWarning(false);
            setWarningIndex(0);
        } else if (!showGeneralWarning && warningIndex < specificWarnings.length - 1) {
            // Show the next specific warning
            setWarningIndex(warningIndex + 1);
        } else {
            // Reset to general warning if no more specific warnings are left
            setShowGeneralWarning(true);
            setWarningIndex(0);
        }
    };

    const drugsMatch = warningData.drugs
        .filter(drug => drug.drug_name === medicationData.name)
        .map(drug => drug.drug_name);


    const drugEntry = warningData.drugs.find(drug => drug.drug_name === medicationData.name);

    const isWarningPresent = !!drugEntry;

    const generalWarning = drugEntry
        ? drugEntry.warnings.find(warning => warning.patient_info === "general")?.warning_message || null
        : null;

    // Function to check for patient-specific warnings
    const patientSpecificWarnings = () => {
        if (!drugEntry || !patientData) return [];

        return drugEntry.warnings
            .filter(warning => {
                const patientInfo = warning.patient_info;

                if (patientInfo.age) {
                    const { min, max } = patientInfo.age;
                    if (patientData.age < min || patientData.age > max) return false;
                }
                if (patientInfo.gender && patientInfo.gender !== patientData.gender) return false;
                if (patientInfo.condition && !patientData.disease.includes(patientInfo.condition)) return false;

                return true;
            })
            .map(warning => warning.warning_message);
    };

    const specificWarnings = patientSpecificWarnings();

    const [close, isClose] = React.useState(false)

    const handleClick = () => {
        isClose(true)
    }
    React.useEffect(() => {
        if (!medicationData || !medicationData.name) {
            setError("No valid medication data provided.");
            return;
        }

        const calculateConversion = () => {
            const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
            const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();
            const firstAdminType = medicationData.route;
            const targetAdminType = medicationData.targetRoute || medicationData.route;

            let conversionRatio = 1;  // Default ratio
            let convertedDosage = medicationData.dosage;  // Initialize with original dosage

            // 1. Use custom formula if available
            if (medicationData.formula && medicationData.formula.conversionRatio) {
                conversionRatio = medicationData.formula.conversionRatio;
                console.log("Using custom formula with conversion ratio:", conversionRatio);
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
                        conversionRatio = opioidRouteConversions?.[normalizedDrugName]?.[firstAdminType]?.[targetAdminType] || 1;
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
            }

            // Retrieve and Display Warning

            // Perform conversion using the chosen ratio
            convertedDosage = medicationData.dosage * conversionRatio;

            // Set results, including conversion formula and name
            const conversionFormulaText = `${medicationData.dosage}${medicationData.dosageUnit} of ${medicationData.name} * ${conversionRatio} = ${convertedDosage}${medicationData.dosageUnit} of ${medicationData.target}`;
            setResults({
                medName: medicationData.target,
                dosage: Math.round(convertedDosage * 100) / 100,
                dosageUnit: medicationData.dosageUnit,
                conversionFormula: conversionFormulaText,
                warnings: specificWarnings,  // Add warnings if needed
                formulaName: medicationData.formulaName || "Standard Ratio",
            });
        };

        calculateConversion();
    }, [medicationData]);

    //React.useEffect(() => {
    //    if (!medicationData || !medicationData.name) {
    //        setError("No valid medication data provided.");
    //        return;
    //    }


    //    const calculateConversion = () => {
    //        const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
    //        const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();  // Corrected normalization

    //        const firstAdminType = medicationData.route;
    //        const targetAdminType = (medicationData.targetRoute == null ? medicationData.route : medicationData.targetRoute);

    //        // Debugging logs to see if the values are correct
    //        console.log(`Looking up conversion for drug: ${normalizedDrugName}`);
    //        console.log(`From route: ${firstAdminType}, to route: ${targetAdminType}`);

    //        const firstDrugClass = drugClassMap[normalizedDrugName];
    //        if (!firstDrugClass) {
    //            setError("Invalid drug class");
    //            return;
    //        }

    //        if (firstDrugClass === 'opioid') {
    //            // Use opioid route conversions
    //            const conversionRatio = opioidRouteConversions?.[normalizedDrugName]?.[firstAdminType]?.[targetAdminType];

    //            // Debugging logs to check if the conversion is found
    //            console.log(`Conversion ratio found: ${conversionRatio}`);

    //            if (conversionRatio != null) {
    //                const convertedDosage = Math.round((medicationData.dosage * conversionRatio) * 100) / 100;
    //                setResults({
    //                    medName: medicationData.target,
    //                    dosage: convertedDosage,
    //                    dosageUnit: medicationData.dosageUnit,
    //                    conversionFormula: medicationData.formula !== {} ? medicationData.formula : `${medicationData.dosage}${medicationData.dosageUnit} ${medicationData.name} * ${conversionRatio} (Effective Dosage Ratio) = ${convertedDosage}${medicationData.dosageUnit} ${medicationData.target}`,
    //                    warnings: drugsMatch,
    //                    formulaName: medicationData.formulaName !== '' ? medicationData.formulaName : "Standard Ratio"
    //                });
    //            } else {
    //                setError(`No conversion available from ${firstAdminType} to ${targetAdminType}`);
    //            }
    //        } else {
    //            let conversionData;

    //            switch (firstDrugClass) {
    //                case 'steroid':
    //                    conversionData = steroids;
    //                    break;
    //                case 'opioid':
    //                    conversionData = opioids;
    //                    break;
    //                case 'benzodiazepine':
    //                    conversionData = benzodiazepine;
    //                    break;
    //                case 'local anesthetic':
    //                    conversionData = localAnesthetics;
    //                    break;
    //                default:
    //                    setError("No valid drug class found");
    //                    return;
    //            }

    //            const firstDrug = normalizedDrugName;
    //            const secondDrug = normalizedDrugNameTarget;
    //            const firstDrugConversions = conversionData[firstDrug]?.Conversions;

    //            if (!firstDrugConversions) {
    //                setError("No conversion data found");
    //                return;
    //            }

    //            const conversionRatio = firstDrugConversions[secondDrug] || null;
    //            if (conversionRatio != null) {
    //                console.log(`Steroid conversion ratio found: ${conversionRatio}`);
    //                const convertedDosage = Math.round((medicationData.dosage * conversionRatio) * 100) / 100;
    //                setResults({
    //                    medName: medicationData.name,
    //                    dosage: convertedDosage,
    //                    dosageUnit: medicationData.dosageUnit,
    //                    conversionFormula: medicationData.formula !== {} ? medicationData.formula : `${medicationData.dosage}${medicationData.dosageUnit} ${medicationData.name} * ${conversionRatio} (Effective Dosage Ratio) = ${convertedDosage}${medicationData.dosageUnit} ${medicationData.target}`,
    //                    warnings: drugsMatch,
    //                    formulaName: medicationData.formulaName !== '' ? medicationData.formulaName : "Standard Ratio"
    //                });
    //            } else {
    //                setError("No conversion found");
    //            }
    //        }
            
    //    };

    //    calculateConversion();
    //}, [medicationData]);

    return (
        <div>
        <Dashboard heading='Conversion Results'>
        <IconButton onClick={handleBackButton}> 
                <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            {error ? <p style={{ color: 'red' }}>{error}</p> : <div></div>}
            <Box sx={{ mt: 4 }}>
            
            <Typography variant="h4" gutterBottom>
                Conversion Results
            </Typography>

                    {/* Conversion Information Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Conversion Information:
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Medication Name:</TableCell>
                                    <TableCell><strong>{medicationData.name}</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dosage:</TableCell>
                                    <TableCell><strong>{medicationData.dosage} {medicationData.dosageUnit}</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Form:</TableCell>
                                    <TableCell><strong>{capitalizeFirstLetter(medicationData.route)}</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Target Medication:</TableCell>
                                    <TableCell><strong>{medicationData.target}</strong></TableCell>
                                </TableRow>
                                {resultsType === 'po-iv' && (
                                    <>
                                        <TableRow>
                                            <TableCell>Target Form:</TableCell>
                                            <TableCell><strong>{capitalizeFirstLetter(medicationData.targetRoute)}</strong></TableCell>
                                        </TableRow>
                                    </>
                                )}
                                
                            </TableBody>
                        </Table>
                    </TableContainer>

            {/* Patient Information Section (if available) */}
            {medicationData.patient && (
                <>
                    <Typography variant="h6" gutterBottom>
                        Patient Information:
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Height:</TableCell>
                                    <TableCell>{patientData.height} cm</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Weight:</TableCell>
                                    <TableCell>{patientData.weight} kg</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gender:</TableCell>
                                    <TableCell>{patientData.gender}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Kidney Impairment:</TableCell>
                                    <TableCell>{patientData.kidney ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Liver Impairment:</TableCell>
                                    <TableCell>{patientData.liver ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gastro Impairment:</TableCell>
                                    <TableCell>{patientData.Gastro ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Disease:</TableCell>
                                    <TableCell>{patientData.disease}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

                    {/* Conversion Formula Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Conversion Formula:
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Formula Name:</TableCell>
                                    <TableCell><strong>{results.formulaName || medicationData.formulaName}</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Formula:</TableCell>
                                    <TableCell><strong>{results.conversionFormula}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

            {/* Conversion Results Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Calculated Dosage:
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Medication Name:</TableCell>
                            <TableCell><strong>{results.medName}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Dosage:</TableCell>
                            <TableCell><strong>{results.dosage} {results.dosageUnit}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/*{*/}
            {/*    close == false && (*/}
            {/*    drugsMatch.length > 0 ? drugsMatch.map((warning, index) => (*/}
            {/*        <AlertDialog warning={warning} onOkay={handleClick}></AlertDialog>*/}
            {/*    )) : <AlertDialog warning={"Underdosing / Overdosing could lead to death or severe/permanent disability"} onOkay={handleClick}></AlertDialog>*/}
            {/*)}*/}

            

            {/* Warning Section */}
            <Typography variant="h6" gutterBottom>
                        Warnings:
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Warning</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showGeneralWarning && generalWarning ? (
                                    <TableRow>
                                        <TableCell align='center'>
                                            <AlertDialog
                                                warning={generalWarning}
                                                onOkay={toggleWarning}
                                            />
                                            {specificWarnings.length > 0 && (
                                                <Button 
                                                    onClick={toggleWarning} 
                                                    style={{ 
                                                        marginTop: '1rem', 
                                                        backgroundColor: '#f44336', 
                                                        color: '#ffffff'
                                                    }}>
                                                    Show Patient Specific Warnings
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : specificWarnings.length > 0 ? (
                                    <TableRow>
                                        <TableCell align='center'>
                                            <AlertDialog
                                                warning={specificWarnings[warningIndex]}
                                                onOkay={toggleWarning}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell align='center'>
                                            No Warnings
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
            {/* Administration Instructions Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Administration Instructions:
            </Typography>
            <Administration targetRoute={medicationData?.targetRoute}></Administration>
        </Box>
                
            </Dashboard>
            
        </div>
    );
}

export default ConversionResults;
