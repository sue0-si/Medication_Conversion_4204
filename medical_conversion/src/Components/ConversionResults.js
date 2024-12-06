// JavaScript source code
import * as React from "react";
import opioidRouteConversions from '../Tools/opioidRouteConversions';
import steroids from '../Tools/steroids.json';
import opioids from '../Tools/opioids.json';
import benzodiazepine from '../Tools/benzodiazepine.json';
import localAnesthetics from '../Tools/local_anesthetics.json';
import { drugClassMap } from '../Tools/drugClassMap';  // Correct import
import Administration from '../Components/Administration';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "../Components/Dashboard";
import AlertDialog from "../Components/AlertDialog";
import warningData from '../Tools/warning.json';
import MedicationContext from '../Tools/MedicationContext';
import axios from 'axios';

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

function ConversionResults({ resultsType, medicationData, results }) {
    const [warnings, setWarnings] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [patientVariableWarning, setPatientVariableWarning] = React.useState("");

    React.useEffect(() => {
        // Set target to name if target is empty
        if (!medicationData.target) {
            medicationData.target = medicationData.name;
            if (results.conversionFormula) {
                results.conversionFormula = results.conversionFormula.replace(/of .*$/, `of ${medicationData.name}`);
            }
        }
    }, [medicationData, results]);

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        if (string.toLowerCase() === "iv") return "IV";
        if (string.toLowerCase() === "sc") return "SC";
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const fetchGeneralWarningFromLLM = async (drugName) => {
        const prompt = `Provide general warnings for the drug ${drugName}. Respond only in bullets.`;
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: prompt },
                ],
                model: "llama3-8b-8192",
                temperature: 0.1,
                max_tokens: 150 // Set a smaller max token size for concise output
            });
            // Clean and format the response
            let responseText = completion.choices[0].message.content.trim();

            // Remove unnecessary prefixes like "Here is the output:"
            responseText = responseText
                .replace(/^(Here is the output:|Output:)/i, "")
                .replace(/\*\*/g, "") // Remove all instances of "**"
                .trim();

            const formattedResponse = responseText
                .split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0) // Remove empty lines
                .join("\n \n");
                
            return formattedResponse;
        } catch (err) {
            return "Unable to fetch general warning from the AI model.";
        }
    };

    const fetchWarnings = async (drugName) => {
        try {
            const fields = ['boxed_warning', 'do_not_use', 'drug_interactions', 'when_using', 'pregnancy', 'geriatric', 'pediatric'];
            const apiWarnings = [];

            for (const field of fields) {
                const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${field}:${drugName}`);
                if (response.data.results && response.data.results.length > 0) {
                    const wData = response.data.results[0];
                    const content = wData[field] ? wData[field][0] : `No ${field.replace('_', ' ')} information available.`;
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

            setWarnings([...apiWarnings]);

        } catch (err) {
            const llmGeneratedWarning = await fetchGeneralWarningFromLLM(medicationData.name);
            setWarnings([{ section: 'General Warning', content: llmGeneratedWarning }]);
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
        async function fetchPatientVariableWarning() {
            if (!medicationData || !medicationData.patientData || medicationData.patientData.height === 0 || medicationData.patientData.weight === 0) {
                return;
            }
    
            const pd = medicationData.patientData;
            const prompt = `Given these patient variables:
- Height: ${pd.height} cm
- Weight: ${pd.weight} kg
- Gender: ${pd.gender}
- Pregnancy: ${pd.pregnant ? 'Yes' : 'No'}
- Liver impairment: ${pd.liver ? 'Yes' : 'No'}
- Kidney impairment: ${pd.kidney ? 'Yes' : 'No'}
- GI impairment: ${pd.Gastro ? 'Yes' : 'No'}
- Existing Disease: ${pd.disease}

The target medication is ${medicationData.target} and the calculated dosage is ${results.dosage} ${results.dosageUnit}. Are there any risks associated with these variables. 
only include variables that pose SIGNIFICANT ADDED risk. Do not list out all the variables. Give me only bullets.`;

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "user", content: prompt },
                    ],
                    model: "llama3-8b-8192",
                    temperature: 0.05, // Added temperature
                    max_tokens: 300   // Added max_tokens
                });
                // Clean and format the response
                let responseText = completion.choices[0].message.content.trim();

                // Remove unnecessary prefixes like "Here is the output:"
                responseText = responseText
                    .replace(/^(Here is the output:|Output:)/i, "")
                    .replace(/\*\*/g, "") // Remove all instances of "**"
                    .trim();

                // Format the response as a list with bullet points
                const formattedResponse = responseText
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line.length > 0) // Remove empty lines
                    .join("\n \n");
                setPatientVariableWarning(formattedResponse);
            } catch (err) {
                setPatientVariableWarning("The patient variables do not pose additional risk.");
            }
        }
        fetchPatientVariableWarning();
    }, [medicationData, results]);

    return (
        <div>
            <Box sx={{
                maxWidth: '800px', // Limit the maximum width
                width: '100%',
                margin: '0 auto',
                padding: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
            }}>

                <Typography variant="h4" gutterBottom>
                    Conversion Results: { medicationData.name } to { medicationData.target }
                </Typography>

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
                                        {medicationData.formulaJustification ?? results.formulaJustification ?? "Justification not available."}
                                    </strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>


                {/* Warnings Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Warnings:
                </Typography>
                {(warnings?.length > 0 || patientVariableWarning) && (
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
                                        <TableCell>Drug-Specific Warnings</TableCell>
                                        <TableCell style={{ whiteSpace: 'pre-wrap' }}>{warning.content}</TableCell>                                    </TableRow>
                                ))}
                                {patientVariableWarning && (
                                    <TableRow>
                                        <TableCell>Patient-Specific Warnings</TableCell>
                                        <TableCell style={{ whiteSpace: 'pre-wrap' }}>{patientVariableWarning}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Disclaimer Section */}
                <Typography 
                    variant="body2" 
                    sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}
                >
                    ** We stress we stress caution when using ANY of the results, as they may be prone to error. Furthermore, the source utilized for patient-variable warnings is a Large Language Model (AI).**
                </Typography>

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
