// JavaScript source code
import * as React from "react";
import Administration from './Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Dashboard from "./Dashboard";
import AlertDialog from "./AlertDialog";
import warningData from '../Tools/warning.json'

function ConversionResults({ resultsType, medicationData, results }) {
    const [collapsedWarnings, setCollapsedWarnings] = React.useState([]);
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/' + {resultsType});
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
  
    return (
        <div>
            <Dashboard heading='Conversion Results'>
                <IconButton onClick={handleBackButton}>
                    <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
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