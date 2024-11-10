// JavaScript source code
import * as React from "react";
import Administration from './Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertDialog from "./AlertDialog";
import axios from 'axios';

function ConversionResults({ resultsType, medicationData, results }) {
    const [warnings, setWarnings] = React.useState([]);
    const [warningError, setWarningError] = React.useState(null);


        const capitalizeFirstLetter = (string) => {
            if (!string) return "";
            if (string.toLowerCase() === "iv") return "IV";
            if (string.toLowerCase() === "sc") return "SC";

            // Default capitalization for other strings
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        const fetchWarnings = async (drugName) => {
            try {
                const fields = ['boxed_warning', 'do_not_use', 'drug_interactions', 'when_using', 'pregnancy', 'geriatric', 'pediatric'];
                const newWarnings = [];

                for (const field of fields) {
                    const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${field}:${drugName}`);
                    if (response.data.results && response.data.results.length > 0) {
                        const warningData = response.data.results[0];
                        const content = warningData[field] ? warningData[field][0] : `No ${field.replace('_', ' ')} information available.`;
                        newWarnings.push({ section: capitalizeFirstLetter(field.replace('_', ' ')), content });
                    }
                }

                if (medicationData.patientData?.pregnant) {
                    const pregnancyWarning = newWarnings.find(warning => warning.section === 'Pregnancy');
                    if (!pregnancyWarning) {
                        newWarnings.push({ section: 'Pregnancy', content: 'No pregnancy-specific warning available.' });
                    }
                }

                if (medicationData.patientData?.age > 65) {
                    const geriatricWarning = newWarnings.find(warning => warning.section === 'Geriatric');
                    if (!geriatricWarning) {
                        newWarnings.push({ section: 'Geriatric', content: 'No geriatric-specific warning available.' });
                    }
                }

                if (medicationData.patientData?.age < 18) {
                    const pediatricWarning = newWarnings.find(warning => warning.section === 'Pediatric');
                    if (!pediatricWarning) {
                        newWarnings.push({ section: 'Pediatric', content: 'No pediatric-specific warning available.' });
                    }
                }

                setWarnings(newWarnings);
            } catch (err) {
                setWarningError("Error fetching warnings data.");
                setWarnings([{ section: 'General', content: 'No warnings available due to API error.' }]);
            }
        };

        React.useEffect(() => {
            if (!medicationData || !medicationData.name) {
                setWarningError("No valid medication data provided.");
                return;
            }

            // Fetch warnings for the medication
            fetchWarnings(medicationData.name);

        }, [medicationData]);

        

        return (
            <div>
                <Box sx={{ mt: 4 }}>
                    {warningError !== null && (
                        <p>Error obtaining conversion warnings: {warningError}</p>
                    )}
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