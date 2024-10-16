import { useState } from "react";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useNavigate } from 'react-router-dom';
import PatientInfoForm from "./PatientInfoForm";

function MedInputForm({ redirectOnSubmit, medicationData, setMedicationData, patientData, setPatientData, formtype }) {
    const [submittedData, setSubmittedData] = useState(null);  // Store the form data on submit
    const navigate = useNavigate();
    const [showPatientForm, setShowPatientForm] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMedicationData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleClick = () => {
        setShowPatientForm(!showPatientForm)
        if (showPatientForm) {
            setMedicationData((prevData) => ({
                ...prevData,
                patient: true
            }));
        } else {
            setMedicationData((prevData) => ({
                ...prevData,
                patient: false
            }));
        }
        
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (medicationData && medicationData.name) {
            setSubmittedData(medicationData);  // Store form data for passing to ConversionResults

            navigate(redirectOnSubmit + medicationData.name , { state: { medicationData, patientData } });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/*PO-IV Form*/}
            {formtype === "po-iv" && (
                <>
                    <TextField
                        label="Medication Name"
                        name="name"
                        value={medicationData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <Typography variant="h6" gutterBottom>
                            Administration Method
                        </Typography>
                        <ToggleButtonGroup
                            value={medicationData.route}
                            exclusive
                            onChange={(event, newMethod) => {
                                setMedicationData((prevData) => ({
                                    ...prevData,
                                    route: newMethod,
                                }));
                            }}
                            aria-label="administration method"
                        >
                            <ToggleButton value="oral" aria-label="oral">Oral</ToggleButton>
                            <ToggleButton value="iv" aria-label="iv">IV</ToggleButton>
                            <ToggleButton value="sc" aria-label="sc">SC</ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>

                    <TextField
                        label="Desired Medication"
                        name="target"
                        value={medicationData.target}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <Typography variant="h6" gutterBottom>
                            Desired Administration Method
                        </Typography>
                        <ToggleButtonGroup
                            value={medicationData.targetRoute}
                            exclusive
                            onChange={(event, newMethod) => {
                                setMedicationData((prevData) => ({
                                    ...prevData,
                                    targetRoute: newMethod,
                                }));
                            }}
                            aria-label="target administration method"
                        >
                            <ToggleButton value="oral" aria-label="oral">Oral</ToggleButton>
                            <ToggleButton value="iv" aria-label="iv push">IV</ToggleButton>
                            <ToggleButton value="sc" aria-label="sc">SC</ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>

                    {/* Dosage Input Field */}
                    <TextField
                        label="Dosage"
                        name="dosage"
                        value={medicationData.dosage}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        type="number"
                    />

                    {/* Dosage Unit Selection */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Dosage Unit</InputLabel>
                        <Select
                            name="dosageUnit"
                            value={medicationData.dosageUnit}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="mg">mg</MenuItem>
                            <MenuItem value="mL">mL</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                            <MenuItem value="units">units</MenuItem>
                        </Select>
                    </FormControl>
               </>
            )}
            {/*ALT form*/ }
            {formtype === 'alt' && (
                <>
                    <TextField
                        label="Medication Name"
                        name="name"
                        value={medicationData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                </>
            )}

            {/*add patient section*/}
            <FormControl fullWidth margin="normal">
                <Box>
                    <button type="button" onClick={handleClick}>
                    {showPatientForm ? "Remove Patient" : "Add Patient"}
                    </button>

                    {/* Conditionally render the PatientInfo form */}
                    {showPatientForm && ( <PatientInfoForm patientData={patientData} setPatientData={setPatientData} /> )}
                </Box>
            </FormControl>
            {/*submit button*/}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
}

export default MedInputForm;
