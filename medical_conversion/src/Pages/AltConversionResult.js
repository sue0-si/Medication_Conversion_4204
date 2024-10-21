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

const AltConversionResult = () => {
    const [results, setResults] = React.useState(defaultResultsData);
    const [results2, setResults2] = React.useState(defaultResultsData);
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
        if (!string) return ""; // Handle undefined or empty string
    
        // Handle special cases for "iv" and "sc"
        if (string.toLowerCase() === "iv") return "IV";
        if (string.toLowerCase() === "sc") return "SC";
    
        // Default capitalization for other strings
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const drugsMatch = warningData.drugs
        .filter(drug => drug.drug_name === medicationData.name)
        .map(drug => drug.drug_name);

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
                    if (key != capitalizeFirstLetter(medicationData.name)) {
                        keys.push(key);
                    }
                }
  
                for (let i = 0; i < keys.length; i++) {
                    const converted = conversionData[medicationData.name]?.Conversions[keys[i]];
                    drugConversion.push(converted);
 
                }     
                console.log(drugConversion)
                setResults({
                    medName: keys[0],
                    dosage: drugConversion[0] === null ? drugConversion[0][1] : drugConversion[0],
                    dosageUnit: medicationData.dosageUnit,
                    conversionFormula: '',
                    warnings: drugsMatch,
                    formulaName: ''
                });
                setResults2({
                    medName: keys[1],
                    dosage: drugConversion[1],
                    dosageUnit: medicationData.dosageUnit,
                    conversionFormula: '',
                    warnings: drugsMatch,
                    formulaName: ''
                });       
        };

        calculateConversion();
    }, [medicationData]);

    
    return (
        <div>
            <Dashboard heading='Conversion Results'>
                <IconButton onClick={handleBackButton}> 
                    <ArrowBackIcon></ArrowBackIcon>
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
                            <TableCell><strong>{results2.dosage} {results.dosageUnit}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            
            </Dashboard>
        </div>
    );
}

export default AltConversionResult;