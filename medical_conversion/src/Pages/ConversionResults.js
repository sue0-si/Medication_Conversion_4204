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

    const toggleWarning = (index) => {
        if (collapsedWarnings.includes(index)) {
            setCollapsedWarnings(collapsedWarnings.filter((i) => i !== index));
        } else {
            setCollapsedWarnings([...collapsedWarnings, index]);
        }
    };

    const drugsMatch = warningData.drugs
        .filter(drug => drug.drug_name === medicationData.name)
        .map(drug => drug.drug_name);

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
            const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();  // Corrected normalization

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
                        medName: medicationData.target,
                        dosage: convertedDosage,
                        dosageUnit: medicationData.dosageUnit,
                        conversionFormula: `${medicationData.dosage}${medicationData.dosageUnit} ${medicationData.name} * ${conversionRatio} (Effective Dosage Ratio) = ${convertedDosage}${medicationData.dosageUnit} ${medicationData.target}`,
                        warnings: drugsMatch,
                        formulaName: medicationData.formulaName !== '' ? "Standard Ratio" : medicationData.formulaName
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
                    console.log(`Steroid conversion ratio found: ${conversionRatio}`);
                    const convertedDosage = Math.round((medicationData.dosage * conversionRatio) * 100) / 100;
                    setResults({
                        medName: medicationData.name,
                        dosage: convertedDosage,
                        dosageUnit: medicationData.dosageUnit,
                        conversionFormula: `${medicationData.dosage}${medicationData.dosageUnit} ${medicationData.name} * ${conversionRatio} (Effective Dosage Ratio) = ${convertedDosage}${medicationData.dosageUnit} ${medicationData.target}`,
                        warnings: drugsMatch,
                        formulaName: medicationData.formulaName !== '' ? "Standard Ratio" : medicationData.formulaName
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
                        <TableRow>
                            <TableCell>Target Form:</TableCell>
                            <TableCell><strong>{capitalizeFirstLetter(medicationData.targetRoute)}</strong></TableCell>
                        </TableRow>
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
                            <TableCell><strong>Standard Conversion Ratio</strong></TableCell>
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

            

             {/*Warnings Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Warnings:
            </Typography>
            {(results.warnings !== undefined && results.warnings.length !== 0) && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Warning</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.warnings.map((warning, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>
                                        <div key={index} align='center'> {collapsedWarnings.includes(index) ?
                                            <button style={{
                                                marginTop: '1rem', // add some spacing
                                                backgroundColor: '#f44336', // similar red to the "Okay" button
                                                color: '#ffffff', // make text white for better visibility
                                                border: 'none', // ensure no border for a consistent look
                                                cursor: 'pointer' // give a pointer cursor to indicate clickability
                                            }}
                                                onClick={() => toggleWarning(index)}>Expand Warning</button> : <AlertDialog
                                                warning={warning}
                                                onOkay={() => toggleWarning(index)} />
                                        }</div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) || (<p>No Warnings</p>)}
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
