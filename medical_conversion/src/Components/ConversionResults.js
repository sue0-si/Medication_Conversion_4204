// JavaScript source code
import * as React from "react";
import Administration from './Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertDialog from "./AlertDialog";
import axios from 'axios';
import warningData from '../Tools/warning.json';

function ConversionResults({ resultsType, medicationData, results }) {
    const [warnings, setWarnings] = React.useState([]);

    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        // Set target to name if target is empty
        if (!medicationData.target) {
            medicationData.target = medicationData.name;
            if (results.conversionFormula) {
                results.conversionFormula = results.conversionFormula.replace(/of .*$/, `of ${medicationData.name}`);
            }
        }
    }, [medicationData]);

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        if (string.toLowerCase() === "iv") return "IV";
        if (string.toLowerCase() === "sc") return "SC";

        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const getLocalWarnings = () => {
        const localWarnings = [];
        const drug = warningData.drugs.find(d => d.drug_name.toLowerCase() === medicationData.name.toLowerCase());

        if (drug) {
            drug.warnings.forEach(warning => {
                const patientInfo = warning.patient_info;
                let isApplicable = false;

                if (patientInfo === "general") {
                    isApplicable = true;
                } else {
                    for (const [key, value] of Object.entries(patientInfo)) {
                        switch (key) {
                            case "age":
                                const patientAge = parseInt(medicationData.patientData.age);
                                if (patientAge >= value.min && patientAge <= value.max) {
                                    isApplicable = true;
                                }
                                break;
                            case "gender":
                                if (medicationData.patientData.gender === value) {
                                    isApplicable = true;
                                }
                                break;
                            case "weight":
                                const patientWeight = parseInt(medicationData.patientData.weight);
                                if (patientWeight >= value.min && patientWeight <= value.max) {
                                    isApplicable = true;
                                }
                                break;
                            case "condition":
                                if (medicationData.patientData.disease?.toLowerCase().includes(value.toLowerCase()) ||
                                    (value === "pregnancy" && medicationData.patientData.pregnant)) {
                                    isApplicable = true;
                                }
                                break;
                            default: break;
                        }
                    }
                }

                if (isApplicable) {
                    localWarnings.push({
                        section: patientInfo === "general" ? 'General Warning' : 'Patient-Specific Warning',
                        content: warning.warning_message
                    });
                }
            });
        }

        // Check for hazardous combinations
        const combinationWarnings = warningData.hazardous_combinations.filter(combo =>
            combo.combination.some(drug =>
                drug.toLowerCase() === medicationData.name.toLowerCase() ||
                (medicationData.target && drug.toLowerCase() === medicationData.target.toLowerCase())
            )
        );

        combinationWarnings.forEach(warning => {
            localWarnings.push({
                section: 'Drug Interaction Warning',
                content: warning.warning_message
            });
        });

        return localWarnings;
    };

    const fetchWarnings = async (drugName) => {
        try {
            const fields = ['boxed_warning', 'do_not_use', 'drug_interactions', 'when_using', 'pregnancy', 'geriatric', 'pediatric'];
            const apiWarnings = [];

            for (const field of fields) {
                const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${field}:${drugName}`);
                if (response.data.results && response.data.results.length > 0) {
                    const warningData = response.data.results[0];
                    const content = warningData[field] ? warningData[field][0] : `No ${field.replace('_', ' ')} information available.`;
                    apiWarnings.push({ section: capitalizeFirstLetter(field.replace('_', ' ')), content });
                }
            }

            if (medicationData.patientData?.pregnant) {
                const pregnancyWarning = apiWarnings.find(warning => warning.section === 'Pregnancy');
                if (!pregnancyWarning) {
                    apiWarnings.push({ section: 'Pregnancy', content: 'No pregnancy-specific warning available.' });
                }
            }

            if (medicationData.patientData?.age > 65) {
                const geriatricWarning = apiWarnings.find(warning => warning.section === 'Geriatric');
                if (!geriatricWarning) {
                    apiWarnings.push({ section: 'Geriatric', content: 'No geriatric-specific warning available.' });
                }
            }

            if (medicationData.patientData?.age < 18) {
                const pediatricWarning = apiWarnings.find(warning => warning.section === 'Pediatric');
                if (!pediatricWarning) {
                    apiWarnings.push({ section: 'Pediatric', content: 'No pediatric-specific warning available.' });
                }
            }

            // Get local warnings and combine them with API warnings
            const localWarnings = getLocalWarnings();
            setWarnings([...apiWarnings, ...localWarnings]);

        } catch (err) {
            setError("Error fetching warnings data.");
            // If API fails, still show local warnings
            const localWarnings = getLocalWarnings();
            setWarnings(localWarnings.length > 0 ? localWarnings : [{ section: 'General', content: 'No warnings available due to API error.' }]);
        }
    };

    React.useEffect(() => {
        if (!medicationData || !medicationData.name) {
            setError("No valid medication data provided.");
            return;
        }

        // Fetch warnings for the medication
        fetchWarnings(medicationData.name);

    }, [medicationData]);

        return (
            <div>
                <Box sx={{
                    maxWidth: '800px', // Limit the maximum width
                    width: '100%',     // Allow it to grow up to maxWidth
                    margin: '0 auto',  // Center the content
                    padding: '16px',   // Add padding for spacing
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                }}>
                    
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


                    {/* Patient Information Section */}

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
                                            <TableCell>{medicationData.patientData.height} cm</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Weight:</TableCell>
                                            <TableCell>{medicationData.patientData.weight} kg</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gender:</TableCell>
                                            <TableCell>{medicationData.patientData.gender}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Kidney Impairment:</TableCell>
                                            <TableCell>{medicationData.patientData.kidney ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Liver Impairment:</TableCell>
                                            <TableCell>{medicationData.patientData.liver ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gastro Impairment:</TableCell>
                                            <TableCell>{medicationData.patientData.Gastro ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Disease:</TableCell>
                                            <TableCell>{medicationData.patientData.disease}</TableCell>
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

                                    <TableCell>
                                        <strong>
                                            {results.conversionFormula}
                                        </strong>
                                    </TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell>Formula Justification:</TableCell>
                                    <TableCell>
                                        <strong>
                                            {medicationData.formulaJustification}
                                        </strong>
                                    </TableCell>
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


                    {/*Warnings Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Warnings:
                    </Typography>
                    {(warnings !== undefined && warnings.length !== 0) && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Section</strong></TableCell>
                                        <TableCell><strong>Content</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {warnings.map((warning, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{warning.section}</TableCell>
                                            <TableCell>{warning.content}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Administration Instructions Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Administration Instructions:
                    </Typography>
                    <Administration targetRoute={medicationData?.targetRoute}></Administration>
                </Box>
            </div>
        );
    }


export default ConversionResults;