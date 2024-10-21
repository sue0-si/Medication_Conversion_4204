import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "../Components/Dashboard";
import AlertDialog from "../Components/AlertDialog";
import Administration from '../Components/Administration';
import axios from 'axios';

function ConversionResults({ resultsType }) {
    const [results, setResults] = React.useState({});
    const [warnings, setWarnings] = React.useState([]);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const { medicationData, patientData } = location.state || {};
    const [collapsedWarnings, setCollapsedWarnings] = React.useState([]);
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/po-iv');
    };

    const toggleWarning = (index) => {
        if (collapsedWarnings.includes(index)) {
            setCollapsedWarnings(collapsedWarnings.filter((i) => i !== index));
        } else {
            setCollapsedWarnings([...collapsedWarnings, index]);
        }
    };

    const fetchWarnings = async (drugName) => {
        try {
            const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${drugName}`);
            if (response.data.results && response.data.results.length > 0) {
                const warningsData = response.data.results[0];
                const newWarnings = [];

                // Collecting relevant warnings based on the API response
                newWarnings.push({ section: 'Boxed Warning', content: warningsData.boxed_warning || 'No boxed warning available.' });
                newWarnings.push({ section: 'Do not use', content: warningsData.do_not_use || 'No specific instructions available.' });
                newWarnings.push({ section: 'Drug Interaction', content: warningsData.drug_interactions || 'No drug interaction warning available.' });
                newWarnings.push({ section: 'When using', content: warningsData.when_using || 'No specific instructions available.' });

                // Include pregnancy warning if patient is pregnant
                if (patientData?.pregnant) {
                    newWarnings.push({ section: 'Pregnancy', content: warningsData.pregnancy || 'No pregnancy-specific warning available.' });
                }

                // Include geriatric warning if patient age > 65
                if (patientData?.age > 65) {
                    newWarnings.push({ section: 'Geriatric', content: warningsData.geriatric || 'No geriatric-specific warning available.' });
                }

                // Include pediatric warning if patient age < 18
                if (patientData?.age < 18) {
                    newWarnings.push({ section: 'Pediatric', content: warningsData.pediatric || 'No pediatric-specific warning available.' });
                }

                setWarnings(newWarnings);
            } else {
                setWarnings([{ section: 'General', content: 'No warnings available for this medication.' }]);
            }
        } catch (err) {
            setError("Error fetching warnings data.");
            setWarnings([{ section: 'General', content: 'No warnings available due to API error.' }]);
        }
    };

    React.useEffect(() => {
        if (!medicationData || !medicationData.name) {
            setError("No valid medication data provided.");
            return;
        }

        // Fetch warnings data when the component mounts
        fetchWarnings(medicationData.name);
    }, [medicationData]);

    return (
        <div>
            <Dashboard heading='Conversion Results'>
                <IconButton onClick={handleBackButton}> 
                    <ArrowBackIcon />
                </IconButton>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
                                    <TableCell><strong>{medicationData.route}</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Target Medication:</TableCell>
                                    <TableCell><strong>{medicationData.target}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Patient Information Section */}
                    {patientData && (
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
                                            <TableCell>Pregnant:</TableCell>
                                            <TableCell>{patientData.pregnant ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Age:</TableCell>
                                            <TableCell>{patientData.age}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {/* Warnings Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Warnings:
                    </Typography>
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

                    {/* Administration Instructions Section */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Administration Instructions:
                    </Typography>
                    <Administration targetRoute={medicationData?.targetRoute} />
                </Box>
            </Dashboard>
        </div>
    );
}

export default ConversionResults;
