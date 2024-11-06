import * as React from "react";
import opioidRouteConversions from '../Tools/opioidRouteConversions';
import steroids from '../Tools/steroids.json';
import opioids from '../Tools/opioids.json';
import benzodiazepine from '../Tools/benzodiazepine.json';
import localAnesthetics from '../Tools/local_anesthetics.json';
import { drugClassMap } from '../Components/drugClassMap';
import Administration from '../Components/Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { defaultResultsData } from '../Tools/Defaults';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "../Components/Dashboard";
import axios from 'axios';

function ConversionResults({ resultsType }) {
    const [results, setResults] = React.useState(defaultResultsData);
    const [warnings, setWarnings] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const location = useLocation();
    const { medicationData, patientData } = location.state || {};
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/po-iv');
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        if (string.toLowerCase() === "iv") return "IV";
        if (string.toLowerCase() === "sc") return "SC";
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const fetchWarnings = async (drugName) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(drugName)}&limit=1`);

            if (response.data.results && response.data.results.length > 0) {
                const warningData = response.data.results[0];
                const newWarnings = [];

                // Define the mapping of API fields to warning sections
                const warningFieldsMap = {
                    boxed_warning: "Boxed Warning",
                    warnings: "Warnings",
                    precautions: "Precautions",
                    contraindications: "Contraindications",
                    drug_interactions: "Drug Interactions",
                    pregnancy: "Pregnancy",
                    geriatric_use: "Geriatric Use",
                    pediatric_use: "Pediatric Use"
                };

                // Iterate over each field and extract content individually
                for (const [field, sectionName] of Object.entries(warningFieldsMap)) {
                    try {
                        let content = "No information available.";

                        if (warningData[field] && warningData[field].length > 0) {
                            // Extract the content and remove any headers like "DRUG INTERACTIONS:"
                            content = warningData[field][0].replace(/^[A-Z\s]+:/, '').trim();
                            const fieldRegex = new RegExp(`^${field.replace(/_/g, ' ')}`, 'i');
                            content = content.replace(fieldRegex, '').trim();
                        }

                        newWarnings.push({ section: sectionName, content });
                    } catch (sectionError) {
                        console.error(`Error processing section ${sectionName}:`, sectionError);
                        newWarnings.push({ section: sectionName, content: `Error retrieving ${sectionName} information.` });
                    }
                }

                // Handle patient-specific warnings
                if (patientData?.pregnant) {
                    const pregnancyWarning = newWarnings.find(warning => warning.section === 'Pregnancy');
                    if (!pregnancyWarning) {
                        newWarnings.push({ section: 'Pregnancy', content: 'No pregnancy-specific warning available.' });
                    }
                }

                if (patientData?.age > 65) {
                    const geriatricWarning = newWarnings.find(warning => warning.section === 'Geriatric Use');
                    if (!geriatricWarning) {
                        newWarnings.push({ section: 'Geriatric Use', content: 'No geriatric-specific warning available.' });
                    }
                }

                if (patientData?.age < 18) {
                    const pediatricWarning = newWarnings.find(warning => warning.section === 'Pediatric Use');
                    if (!pediatricWarning) {
                        newWarnings.push({ section: 'Pediatric Use', content: 'No pediatric-specific warning available.' });
                    }
                }

                setWarnings(newWarnings);
            } else {
                setWarnings([{ section: 'General', content: 'No warnings available for the specified drug.' }]);
            }

        } catch (err) {
            console.error('Error fetching warnings data:', err);
            setError("Error fetching warnings data.");
            setWarnings([{ section: 'General', content: 'No warnings available due to API error.' }]);
        } finally {
            setLoading(false);
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

    React.useEffect(() => {
        const calculateConversion = () => {
            if (!medicationData) return;

            const normalizedDrugName = medicationData.name.charAt(0).toUpperCase() + medicationData.name.slice(1).toLowerCase();
            const normalizedDrugNameTarget = medicationData.target.charAt(0).toUpperCase() + medicationData.target.slice(1).toLowerCase();
            const firstAdminType = medicationData.route;
            const targetAdminType = medicationData.targetRoute || medicationData.route;

            let conversionRatio = 1;
            let convertedDosage = medicationData.dosage;

            if (medicationData.formula && medicationData.formula.conversionRatio) {
                conversionRatio = medicationData.formula.conversionRatio;
            } else {
                const firstDrugClass = drugClassMap[normalizedDrugName];
                if (!firstDrugClass) {
                    setError("Invalid drug class");
                    return;
                }

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

            convertedDosage = medicationData.dosage * conversionRatio;
            const conversionFormulaText = `${medicationData.dosage}${medicationData.dosageUnit} of ${medicationData.name} * ${conversionRatio} = ${convertedDosage}${medicationData.dosageUnit}`;
            setResults({
                medName: medicationData.target,
                dosage: Math.round(convertedDosage * 100) / 100,
                dosageUnit: medicationData.dosageUnit,
                conversionFormula: conversionFormulaText,
                formulaName: medicationData.formulaName || "Standard Ratio",
            });
        };

        if (warnings.length > 0) {
            calculateConversion();
        }

    }, [warnings, medicationData]);

    return (
        <div>
            <Dashboard heading='Conversion Results'>
                <IconButton onClick={handleBackButton}>
                    <ArrowBackIcon />
                </IconButton>
                {error && <Typography color="error">{error}</Typography>}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {!loading && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Conversion Results
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                            Conversion Information:
                        </Typography>
                        <TableContainer component={Paper} sx={{ mb: 4 }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Medication Name:</TableCell>
                                        <TableCell><strong>{medicationData?.name || "N/A"}</strong></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Dosage:</TableCell>
                                        <TableCell><strong>{medicationData?.dosage} {medicationData?.dosageUnit}</strong></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Form:</TableCell>
                                        <TableCell><strong>{capitalizeFirstLetter(medicationData?.route)}</strong></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Target Medication:</TableCell>
                                        <TableCell><strong>{medicationData?.target || "N/A"}</strong></TableCell>
                                    </TableRow>
                                    {resultsType === 'po-iv' && (
                                        <TableRow>
                                            <TableCell>Target Form:</TableCell>
                                            <TableCell><strong>{capitalizeFirstLetter(medicationData?.targetRoute)}</strong></TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell>Conversion Formula:</TableCell>
                                        <TableCell><strong>{results.conversionFormula}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                                            <TableCell style={{ whiteSpace: 'pre-line' }}>{warning.content}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                            Administration Instructions:
                        </Typography>
                        <Administration targetRoute={medicationData?.targetRoute} />
                    </Box>
                )}
            </Dashboard>
        </div>
    );
}

export default ConversionResults;
