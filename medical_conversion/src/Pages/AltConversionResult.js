import * as React from "react";
import opioidRouteConversions from '../Tools/opioidRouteConversions';
import steroids from '../Tools/steroids.json';
import opioids from '../Tools/opioids.json';
import benzodiazepine from '../Tools/benzodiazepine.json';
import localAnesthetics from '../Tools/local_anesthetics.json';
import { drugClassMap } from '../Components/drugClassMap';
import Administration from '../Components/Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { defaultResultsData } from '../Tools/Defaults';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "../Components/Dashboard";
import axios from 'axios';

const AltConversionResult = () => {
    const [results, setResults] = React.useState(defaultResultsData);
    const [results2, setResults2] = React.useState(defaultResultsData);
    const [warnings, setWarnings] = React.useState([]);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const { medicationData } = location.state || {};
    const { patientData } = location.state || {};
    const navigate = useNavigate();
    const keys = [];
    const drugConversion = [];

    const handleBackButton = () => {
        navigate('/alt');
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        if (string.toLowerCase() === "iv") return "IV";
        if (string.toLowerCase() === "sc") return "SC";
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

            if (patientData?.pregnant) {
                const pregnancyWarning = newWarnings.find(warning => warning.section === 'Pregnancy');
                if (!pregnancyWarning) {
                    newWarnings.push({ section: 'Pregnancy', content: 'No pregnancy-specific warning available.' });
                }
            }

            if (patientData?.age > 65) {
                const geriatricWarning = newWarnings.find(warning => warning.section === 'Geriatric');
                if (!geriatricWarning) {
                    newWarnings.push({ section: 'Geriatric', content: 'No geriatric-specific warning available.' });
                }
            }

            if (patientData?.age < 18) {
                const pediatricWarning = newWarnings.find(warning => warning.section === 'Pediatric');
                if (!pediatricWarning) {
                    newWarnings.push({ section: 'Pediatric', content: 'No pediatric-specific warning available.' });
                }
            }

            setWarnings(newWarnings);
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

        fetchWarnings(medicationData.name);

        const calculateConversion = () => {
            const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
            const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();

            const firstAdminType = medicationData.route;
            const targetAdminType = medicationData.targetRoute;

            console.log(`Looking up conversion for drug: ${normalizedDrugName}`);
            
            const firstDrugClass = drugClassMap[normalizedDrugName];
            if (!firstDrugClass) {
                setError("Invalid drug class");
                return;
            }

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

            for (const key in conversionData) {
                if (key !== capitalizeFirstLetter(medicationData.name)) {
                    keys.push(key);
                }
            }

            for (let i = 0; i < keys.length; i++) {
                const converted = conversionData[medicationData.name]?.Conversions[keys[i]];
                drugConversion.push(converted);
            }

            setResults({
                medName: keys[0],
                dosage: drugConversion[0] === null ? drugConversion[0][1] : drugConversion[0],
                dosageUnit: medicationData.dosageUnit,
                conversionFormula: '',
                warnings: warnings,
                formulaName: ''
            });
            setResults2({
                medName: keys[1],
                dosage: drugConversion[1],
                dosageUnit: medicationData.dosageUnit,
                conversionFormula: '',
                warnings: warnings,
                formulaName: ''
            });
        };

        calculateConversion();
    }, [medicationData]);

    return (
        <div>
            <Dashboard heading='Conversion Results'>
                <IconButton onClick={handleBackButton}> 
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" gutterBottom>
                    Conversion Results
                </Typography>

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

                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Medication Name:</TableCell>
                                <TableCell><strong>{results2.medName}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dosage:</TableCell>
                                <TableCell><strong>{results2.dosage} {results2.dosageUnit}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

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
            </Dashboard>
        </div>
    );
}

export default AltConversionResult;
