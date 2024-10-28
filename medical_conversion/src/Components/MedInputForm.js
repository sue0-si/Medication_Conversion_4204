import { useState, useEffect, useContext } from "react";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, ToggleButton, ToggleButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import {MedicationContext} from "../Tools/MedicationContext"
import { useNavigate } from 'react-router-dom';
import PatientInfoForm from "./PatientInfoForm";
import SelectFormula from "./SelectFormula";
import SelectMedication from "./SelectMedication";

function MedInputForm({ formtype }) {
    const [submittedData, setSubmittedData] = useState(null);  // Store the form data on submit
    const navigate = useNavigate();
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [openErrorDialog, setOpenErrorDialog] = useState(false);  // For controlling pop-up dialog

    const { medicationData, setMedicationData, setPatientData } = useContext(MedicationContext);

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

        // Validate required fields
        const validationErrors = {};
        if (!medicationData.name) validationErrors.name = "Medication name is required.";
        if (!medicationData.dosage) validationErrors.dosage = "Dosage is required.";
        if (!medicationData.dosageUnit) validationErrors.dosageUnit = "Dosage unit is required.";
        if (!medicationData.route) validationErrors.route = "Administration route is required.";
        if (formtype === "alt" && !medicationData.target) validationErrors.target = "Target medication is required.";
        if (!medicationData.targetRoute && formtype === 'po-iv') validationErrors.targetRoute = "Target administration method is required.";

        // Set errors if there are any
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setOpenErrorDialog(true);  // Open error dialog if there are validation errors
            return;
        }

        setSubmittedData(medicationData);
        navigate("/" + formtype + "/" + medicationData.name, { state: { medicationData } });
    };

    const handleCloseDialog = () => {
        setOpenErrorDialog(false);  // Close the error dialog
    };

    return (
        <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

            <SelectMedication field="name" label="Select Source Medication" />


            <FormControl fullWidth margin="normal">
                <Typography variant="h6" gutterBottom>
                    Administration Method
                </Typography>
                <ToggleButtonGroup
                    value={medicationData.route}
                    exclusive
                    required
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
            {formtype === 'alt' && (
                <>
                    <SelectMedication field="target" label="Select Target Medication" />
                </>
            ) }

            {/*PO-IV form*/}
            {formtype === 'po-iv' && (
                <>

                    <FormControl fullWidth margin="normal">
                        <Typography variant="h6" gutterBottom>
                            Desired Administration Method
                        </Typography>
                        <ToggleButtonGroup
                            value={medicationData.targetRoute}
                            exclusive
                            required
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
                </>
            )}
            

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

            {/*Formulae selection*/}

            <SelectFormula/>

            {/*add patient section*/}
            <FormControl fullWidth margin="normal">
                <Box>
                    <button type="button" onClick={handleClick}>
                        {showPatientForm ? "Remove Patient" : "Add Patient"}
                    </button>

                    {/* Conditionally render the PatientInfo form */}
                    {showPatientForm && (<PatientInfoForm patientData={medicationData.patientData} setPatientData={setPatientData} />)}
                </Box>
            </FormControl>
            {/*submit button*/}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>

            {/* Error Dialog */}
            <Dialog
                open={openErrorDialog}
                onClose={handleCloseDialog}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">Submission Errors</DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        Please fix the following errors before submitting:
                        <ul>
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </FormControl>
    );
}

export default MedInputForm;
